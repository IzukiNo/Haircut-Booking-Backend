const Appointment = require("../models/Appointment");
const Staff = require("../models/Staff");

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
      appointmentData.stylistId = stylistId;
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
      stylistId,
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

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null,
      };
    }

    if (["canceled", "completed"].includes(appointment.status)) {
      return {
        status: 400,
        message: `Cannot cancel an appointment that is already ${appointment.status}`,
        data: null,
      };
    }

    return await updateAppointmentStatus(appointmentId, "canceled", userId);
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

    const filter = {
      $or: [{ customerId: userId }],
    };

    if (status !== "all") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(filter)
      .populate("customerId", "name email")
      .populate({
        path: "stylistId",
        populate: { path: "userId", select: "name email" },
      })
      .populate("serviceId", "name duration price")
      .populate("branchId", "name address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

    const appointment = await Appointment.findById(appointmentId)
      .populate("customerId", "name email phone")
      .populate("stylistId", "name email")
      .populate("serviceId", "name duration price description")
      .populate("branchId", "name address phone");

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

async function updateAppointmentStatus({
  appointmentId,
  status = "confirmed",
  userId = null,
}) {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return { status: 404, message: "Appointment not found", data: null };

    let staffId = null;
    const staff = await Staff.findOne({ userId });
    if (staff) staffId = staff._id;

    if (
      !staffId &&
      userId &&
      appointment.customerId.toString() !== userId.toString()
    ) {
      return {
        status: 403,
        message: "You don't have permission to update this appointment",
        data: null,
      };
    }

    appointment.status = status;
    if (staffId) appointment.approvedBy = staffId;

    await appointment.save();

    return {
      status: 200,
      message: `Appointment status updated to ${status}`,
      data: appointment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to update appointment status: " + error.message,
      data: null,
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
