const Appointment = require("../models/Appointment");
const Staff = require("../models/Staff");
const Stylist = require("../models/Stylist");

const { Types } = require("mongoose");

const employeeHelper = require("../helpers/employeeHelper");

const {
  checkUserHasActiveAppointment,
  checkAppointmentConflict,
} = require("../helpers/appointmentHelper");

async function createAppointment(
  customerId,
  stylistId,
  serviceId,
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

    const appointmentData = {
      customerId,
      serviceId,
      branchId,
      note,
      date,
      time,
    };

    if (stylistId) {
      const existStylist = await employeeHelper.getEmployeeById(
        "stylist",
        stylistId
      );

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
        message: "Not available - You have an active appointment",
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

async function cancelAppointment(appointmentId, userId) {
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

    return await updateAppointmentStatus(
      appointmentId,
      "canceled",
      userId,
      false
    );
  } catch (error) {
    return {
      status: 500,
      message: "Failed to cancel appointment: " + error.message,
      data: null,
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
      .populate("customerId", "name email phone")
      .populate({
        path: "stylistId",
        select: "userId",
        populate: { path: "userId", select: "name email" },
      })
      .populate("serviceId", "name price description")
      .populate("branchId", "name address phone")
      .populate({
        path: "approvedBy",
        populate: { path: "userId", select: "name email" },
      })
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

async function updateAppointmentStatus(
  appointmentId,
  status = "confirmed",
  userId = null,
  force = false // true: staff, false: user
) {
  try {
    const STATUS_ENUM = ["pending", "confirmed", "canceled", "completed"];
    if (!STATUS_ENUM.includes(status)) {
      return { status: 400, message: "Invalid status" };
    }

    if (!appointmentId) {
      return {
        status: 400,
        message: "Appointment ID is required",
      };
    }

    if (appointmentId && !Types.ObjectId.isValid(appointmentId)) {
      return {
        status: 400,
        message: "Invalid Appointment ID",
      };
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return { status: 404, message: "Appointment not found", data: null };
    }

    if (userId && !Types.ObjectId.isValid(userId)) {
      return {
        status: 400,
        message: "Invalid User ID",
      };
    }

    let staffId = null;
    if (force && userId) {
      const staff = await employeeHelper.getEmployeeById("staff", userId);
      if (!staff)
        return {
          status: 403,
          message: "You are not authorized to perform this action",
        };
      staffId = staff._id;
    }

    if (!force && userId) {
      if (appointment.customerId.toString() !== userId.toString()) {
        return {
          status: 403,
          message: "You don't have permission to update this appointment",
        };
      }

      if (["canceled", "completed"].includes(appointment.status)) {
        return {
          status: 400,
          message: `Cannot cancel an appointment that is already ${appointment.status}`,
          data: null,
        };
      }

      if (status !== "canceled") {
        return {
          status: 403,
          message: "Customers can only cancel appointments",
        };
      }
    }

    appointment.status = status;
    if (staffId) appointment.approvedBy = staffId;

    await appointment.save();

    return { status: 200, message: `Appointment status updated to ${status}` };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to update appointment status: " + error.message,
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

module.exports = {
  createAppointment,
  cancelAppointment,
  getAppointmentsByUser,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};
