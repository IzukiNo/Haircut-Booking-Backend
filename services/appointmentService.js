const Appointment = require("../models/Appointment");
const Review = require("../models/Review");

async function createAppointment(customerId, staffId, serviceId, branchId, note = "") {
  try {
    // Validate required fields
    if (!customerId || !serviceId || !branchId) {
      return {
        status: 400,
        message: "Missing required fields: customerId, serviceId, and branchId are required",
        data: null
      };
    }

    const appointmentData = {
      customerId,
      serviceId,
      branchId,
      note,
      date: new Date(), // You might want to accept this as a parameter
      time: "09:00" // You might want to accept this as a parameter
    };

    // Add staffId if provided
    if (staffId) {
      appointmentData.staffId = staffId;
    }

    const appointment = new Appointment(appointmentData);
    const savedAppointment = await appointment.save();

    return {
      status: 201,
      message: "Appointment created successfully",
      data: savedAppointment
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to create appointment: " + error.message,
      data: null
    };
  }
}

async function cancelAppointment(appointmentId, userId) {
  try {
    if (!appointmentId) {
      return {
        status: 400,
        message: "Appointment ID is required",
        data: null
      };
    }

    return await updateAppointmentStatus(appointmentId, "canceled", userId);
  } catch (error) {
    return {
      status: 500,
      message: "Failed to cancel appointment: " + error.message,
      data: null
    };
  }
}

async function getAppointmentsByUser(userId, status = "all", page = 1, limit = 10) {
  try {
    if (!userId) {
      return {
        status: 400,
        message: "User ID is required",
        data: null
      };
    }

    // Build query filter
    const filter = {
      $or: [
        { customerId: userId },
        { staffId: userId }
      ]
    };

    // Add status filter if not "all"
    if (status !== "all") {
      filter.status = status;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get appointments with pagination
    const appointments = await Appointment.find(filter)
      .populate('customerId', 'name email')
      .populate('staffId', 'name email')
      .populate('serviceId', 'name duration price')
      .populate('branchId', 'name address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
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
          hasPrev: page > 1
        }
      }
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to get appointments: " + error.message,
      data: null
    };
  }
}

async function getAppointmentById(appointmentId) {
  try {
    if (!appointmentId) {
      return {
        status: 400,
        message: "Appointment ID is required",
        data: null
      };
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('customerId', 'name email phone')
      .populate('staffId', 'name email')
      .populate('serviceId', 'name duration price description')
      .populate('branchId', 'name address phone');

    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null
      };
    }

    return {
      status: 200,
      message: "Appointment retrieved successfully",
      data: appointment
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to get appointment: " + error.message,
      data: null
    };
  }
}

async function updateAppointmentStatus(appointmentId, status = "confirmed", userId) {
  try {
    if (!appointmentId) {
      return {
        status: 400,
        message: "Appointment ID is required",
        data: null
      };
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "canceled", "completed"];
    if (!validStatuses.includes(status)) {
      return {
        status: 400,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        data: null
      };
    }

    // Fetch appointment once
    const appointment = await Appointment.findById(appointmentId)
      .populate('customerId', 'name email')
      .populate('staffId', 'name email')
      .populate('serviceId', 'name duration price')
      .populate('branchId', 'name address');

    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null
      };
    }

    // If userId is provided, check permission
    if (userId) {
      if (appointment.customerId._id.toString() !== userId.toString()) {
        return {
          status: 403,
          message: "You don't have permission to update this appointment",
          data: null
        };
      }
    }

    // Update and save
    appointment.status = status;
    await appointment.save();

    return {
      status: 200,
      message: `Appointment status updated to ${status} successfully`,
      data: appointment
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to update appointment status: " + error.message,
      data: null
    };
  }
}

async function deleteAppointment(appointmentId) {
  try {
    if (!appointmentId) {
      return {
        status: 400,
        message: "Appointment ID is required",
        data: null
      };
    }

    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null
      };
    }

    // Also delete any associated reviews
    await Review.deleteMany({ appointmentId });

    return {
      status: 200,
      message: "Appointment deleted successfully",
      data: appointment
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to delete appointment: " + error.message,
      data: null
    };
  }
}

async function submitReview(customerId, appointmentId, rating, comment = "") {
  try {
    // Validate required fields
    if (!customerId || !appointmentId || !rating) {
      return {
        status: 400,
        message: "Missing required fields: customerId, appointmentId, and rating are required",
        data: null
      };
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return {
        status: 400,
        message: "Rating must be between 1 and 5",
        data: null
      };
    }

    // Check if appointment exists and belongs to the customer
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null
      };
    }

    if (appointment.customerId.toString() !== customerId.toString()) {
      return {
        status: 403,
        message: "You can only review your own appointments",
        data: null
      };
    }

    // Check if appointment is completed
    if (appointment.status !== "completed") {
      return {
        status: 400,
        message: "You can only review completed appointments",
        data: null
      };
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ customerId, appointmentId });
    if (existingReview) {
      return {
        status: 400,
        message: "You have already reviewed this appointment",
        data: null
      };
    }

    const review = new Review({
      customerId,
      appointmentId,
      rating,
      comment
    });

    const savedReview = await review.save();
    
    // Populate the saved review
    const populatedReview = await Review.findById(savedReview._id)
      .populate('customerId', 'name email')
      .populate('appointmentId', 'date time status');

    return {
      status: 201,
      message: "Review submitted successfully",
      data: populatedReview
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to submit review: " + error.message,
      data: null
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
  submitReview,
};