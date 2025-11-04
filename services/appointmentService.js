const Appointment = require("../models/Appointment");
const Review = require("../models/Review");

const User = require("../models/User");

const { Types } = require("mongoose");

const employeeHelper = require("../helpers/employeeHelper");

const {
  checkUserHasActiveAppointment,
  checkAppointmentConflict,
} = require("../helpers/appointmentHelper");

async function createAppointment(
  customerId,
  stylistId,
  serviceId, // 🔥 có thể là 1 ID hoặc mảng ID
  branchId,
  note = "",
  date,
  time
) {
  try {
    if (!customerId || !serviceId || !branchId || !date || !time) {
      return {
        status: 400,
        message: "Missing Parameters",
        data: null,
      };
    }

    const serviceIds = Array.isArray(serviceId) ? serviceId : [serviceId];
    const allValidIds = serviceIds.every((id) => Types.ObjectId.isValid(id));
    if (
      !Types.ObjectId.isValid(customerId) ||
      (branchId && !Types.ObjectId.isValid(branchId)) ||
      !allValidIds
    ) {
      return {
        status: 400,
        message: "Invalid ID",
        data: null,
      };
    }

    let existStylist = null;

    const appointmentData = {
      customerId,
      serviceId: serviceIds,
      branchId,
      note,
      date,
      time,
    };

    if (stylistId) {
      if (!Types.ObjectId.isValid(stylistId)) {
        return {
          status: 400,
          message: "Invalid stylist ID",
          data: null,
        };
      }

      existStylist = await employeeHelper.getEmployeeById("stylist", stylistId);
      if (!existStylist) {
        return {
          status: 404,
          message: "Stylist not found",
          data: null,
        };
      }

      appointmentData.stylistId = existStylist._id;
    }
    const hasActiveAppointment = await checkUserHasActiveAppointment(
      customerId
    );
    if (hasActiveAppointment) {
      return {
        status: 403,
        message:
          "Bạn đang có lịch hẹn đang chờ hoặc đã được xác nhận nhưng chưa hoàn thành.",
        data: null,
      };
    }
    const hasConflict = await checkAppointmentConflict(
      branchId,
      existStylist ? existStylist._id : null,
      date,
      time
    );
    if (hasConflict) {
      return {
        status: 409,
        message: "Not available - Time slot conflict",
        data: null,
      };
    }

    const appointment = new Appointment(appointmentData);
    const savedAppointment = await appointment.save();

    return {
      status: 201,
      message: "Appointment created successfully",
      data: savedAppointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to create appointment: " + error.message,
      data: null,
    };
  }
}

async function cancelAppointment(userId, appointmentId) {
  try {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(appointmentId)
    )
      return { status: 400, message: "Invalid ID" };

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return { status: 404, message: "Appointment not found" };

    if (appointment.customerId.toString() !== userId.toString())
      return { status: 403, message: "You cannot cancel this appointment" };

    if (["completed", "canceled"].includes(appointment.status))
      return {
        status: 400,
        message: `Cannot cancel ${appointment.status} appointment`,
      };

    appointment.status = "canceled";
    await appointment.save();

    return {
      status: 200,
      message: "Appointment canceled successfully",
      data: appointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to cancel appointment: " + error.message,
    };
  }
}

async function completeAppointment(stylistId, appointmentId) {
  try {
    if (
      !Types.ObjectId.isValid(stylistId) ||
      !Types.ObjectId.isValid(appointmentId)
    ) {
      return { status: 400, message: "Invalid ID" };
    }

    const stylist = await employeeHelper.getEmployeeById("stylist", stylistId);
    if (!stylist) {
      return { status: 403, message: "You are not authorized to complete" };
    }

    console.log("Stylist found:", stylist);

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return { status: 404, message: "Appointment not found" };
    }

    if (appointment.stylistId?.toString() !== stylist._id.toString()) {
      return {
        status: 403,
        message: "Bạn không được phép hoàn thành cuộc hẹn này",
      };
    }

    if (appointment.status !== "confirmed") {
      return {
        status: 400,
        message: "Chỉ những cuộc hẹn đã xác nhận mới có thể hoàn thành",
      };
    }

    appointment.status = "completed";
    await appointment.save();

    return {
      status: 200,
      message: "Cuộc hẹn đã được đánh dấu là hoàn thành",
      data: appointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to complete appointment: " + error.message,
    };
  }
}

async function approveAppointment(staffId, appointmentId) {
  try {
    if (!staffId) return { status: 400, message: "Staff ID is required" };
    if (!appointmentId)
      return { status: 400, message: "Appointment ID is required" };

    if (
      !Types.ObjectId.isValid(staffId) ||
      !Types.ObjectId.isValid(appointmentId)
    )
      return { status: 400, message: "Invalid ID" };

    const staff = await employeeHelper.getEmployeeById("staff", staffId);
    if (!staff)
      return { status: 403, message: "You are not authorized to approve" };

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return { status: 404, message: "Appointment not found" };

    if (appointment.status !== "pending")
      return {
        status: 400,
        message: "Only pending appointments can be approved",
      };

    appointment.status = "confirmed";
    appointment.approvedBy = staff._id;
    await appointment.save();

    return {
      status: 200,
      message: "Appointment approved successfully",
      data: appointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to approve appointment: " + error.message,
    };
  }
}

async function getAppointmentsByUser(
  userId,
  status = "all",
  page = 1,
  limit = 10
) {
  try {
    if (!userId) {
      return {
        status: 400,
        message: "User ID is required",
        data: null,
      };
    }

    if (userId && !Types.ObjectId.isValid(userId)) {
      return {
        status: 400,
        message: "Invalid User ID",
        data: null,
      };
    }

    const filter = {
      $or: [{ customerId: userId }],
    };

    if (status !== "all") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(filter)
      .select("-approvedBy")
      .populate({
        path: "stylistId",
        select: "userId",
        populate: { path: "userId", select: "username" },
      })
      .populate("serviceId", "name price description")
      .populate("branchId", "name address phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Appointment.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      message: "Appointments retrieved successfully",
      data: {
        appointments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to get appointments: " + error.message,
      data: null,
    };
  }
}
async function getAllAppointments(status = "all", page = 1, limit = 10) {
  try {
    const filter = {};

    if (status !== "all") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(filter)
      .select("-approvedBy")
      .populate("customerId", "username")
      .populate({
        path: "stylistId",
        select: "userId",
        populate: { path: "userId", select: "username" },
      })
      .populate("serviceId", "name price")
      .populate("branchId", "name address phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Appointment.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      message: "Appointments retrieved successfully",
      data: {
        appointments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to get appointments: " + error.message,
      data: null,
    };
  }
}

async function getAppointmentById(appointmentId) {
  try {
    if (!appointmentId) {
      return {
        status: 400,
        message: "Appointment ID is required",
        data: null,
      };
    }

    if (appointmentId && !Types.ObjectId.isValid(appointmentId)) {
      return {
        status: 400,
        message: "Invalid Appointment ID",
        data: null,
      };
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("customerId", "name email phone")
      .populate({
        path: "stylistId",
        populate: { path: "userId", select: "name email" },
      })
      .populate("serviceId", "name price description")
      .populate("branchId", "name")
      .populate({
        path: "approvedBy",
        populate: { path: "userId", select: "name email" },
      })
      .lean();

    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Appointment retrieved successfully",
      data: appointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to get appointment: " + error.message,
      data: null,
    };
  }
}

async function changeAppointmentStatus(appointmentId, status) {
  try {
    if (!appointmentId || !status)
      return { status: 400, message: "Missing Parameters" };
    const STATUS_ENUM = ["pending", "confirmed", "canceled", "completed"];
    if (!STATUS_ENUM.includes(status))
      return { status: 400, message: "Invalid status" };

    if (!Types.ObjectId.isValid(appointmentId))
      return { status: 400, message: "Invalid Appointment ID" };

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return { status: 404, message: "Appointment not found" };

    appointment.status = status;
    await appointment.save();

    return {
      status: 200,
      message: `Appointment status changed to ${status}`,
      data: appointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to change appointment status: " + error.message,
    };
  }
}

async function deleteAppointment(appointmentId) {
  try {
    if (!appointmentId) {
      return {
        status: 400,
        message: "Appointment ID is required",
        data: null,
      };
    }

    if (appointmentId && !Types.ObjectId.isValid(appointmentId)) {
      return {
        status: 400,
        message: "Invalid Appointment ID",
        data: null,
      };
    }

    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null,
      };
    }

    await Review.deleteMany({ appointmentId });

    return {
      status: 200,
      message: "Appointment deleted successfully",
      data: appointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to delete appointment: " + error.message,
      data: null,
    };
  }
}

async function updateAppointmentService(stylistId, appointmentId, serviceIds) {
  try {
    if (!appointmentId || !serviceIds) {
      return {
        status: 400,
        message: "Missing Parameters",
        data: null,
      };
    }
    if (!Types.ObjectId.isValid(appointmentId)) {
      return {
        status: 400,
        message: "Invalid Appointment ID",
        data: null,
      };
    }
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return {
        status: 400,
        message: "Invalid Service IDs",
        data: null,
      };
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null,
      };
    }

    const stylist = await employeeHelper.getEmployeeById("stylist", stylistId);
    if (!stylist) {
      return { status: 403, message: "You are not authorized to update" };
    }

    if (appointment.stylistId.toString() !== stylist._id.toString()) {
      return {
        status: 403,
        message: "Bạn không được phép cập nhật cuộc hẹn này",
      };
    }

    appointment.serviceId = serviceIds;
    await appointment.save();

    return {
      status: 200,
      message: "Cập nhật dịch vụ cuộc hẹn thành công",
      data: appointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to update appointment services: " + error.message,
      data: null,
    };
  }
}

async function forceCreateAppointment(
  email, // ✅ thay vì customerId
  stylistId,
  serviceId, // có thể là 1 hoặc nhiều ID
  branchId,
  note = "",
  date,
  time
) {
  try {
    // 🔎 Validate cơ bản
    if (!email || !serviceId || !branchId || !date || !time) {
      return {
        status: 400,
        message: "Missing Parameters",
        data: null,
      };
    }

    // 🔍 Lấy customerId từ email
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: 404,
        message: "Customer not found with provided email",
        data: null,
      };
    }

    // 🔧 Chuẩn hóa serviceId thành mảng
    const serviceIds = Array.isArray(serviceId) ? serviceId : [serviceId];
    const allValidIds = serviceIds.every((id) => Types.ObjectId.isValid(id));
    if (
      !Types.ObjectId.isValid(user._id) ||
      (branchId && !Types.ObjectId.isValid(branchId)) ||
      !allValidIds
    ) {
      return {
        status: 400,
        message: "Invalid ID format",
        data: null,
      };
    }

    // 🔍 Stylist (nếu có)
    let existStylist = null;
    if (stylistId) {
      if (!Types.ObjectId.isValid(stylistId)) {
        return {
          status: 400,
          message: "Invalid stylist ID",
          data: null,
        };
      }

      existStylist = await employeeHelper.getEmployeeById("stylist", stylistId);
      if (!existStylist) {
        return {
          status: 404,
          message: "Stylist not found",
          data: null,
        };
      }
    }

    // 🧩 Dữ liệu appointment
    const appointmentData = {
      customerId: user._id,
      serviceId: serviceIds,
      branchId,
      note,
      date,
      time,
    };

    if (existStylist) {
      appointmentData.stylistId = existStylist._id;
    }

    // ⚡ Force create: bỏ qua check active/conflict
    const appointment = new Appointment(appointmentData);
    const savedAppointment = await appointment.save();

    return {
      status: 201,
      message: "Appointment force-created successfully by admin",
      data: savedAppointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to force-create appointment: " + error.message,
      data: null,
    };
  }
}

module.exports = {
  createAppointment,
  cancelAppointment,
  completeAppointment,
  approveAppointment,
  getAppointmentsByUser,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentService,
  changeAppointmentStatus,
  deleteAppointment,
  forceCreateAppointment,
};
