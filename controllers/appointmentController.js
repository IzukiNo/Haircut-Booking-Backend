const appointmentService = require('../services/appointmentService');

async function createAppointment(req, res) {
    try {
        const { staffId, serviceId, branchId, note, date, time } = req.body;
        const customerId = req.user._id;

        // Validate required fields
        if (!serviceId || !branchId) {
            return res.status(400).json({
                status: 400,
                message: "serviceId and branchId are required",
                data: null
            });
        }

        const result = await appointmentService.createAppointment(
            customerId,
            staffId,
            serviceId,
            branchId,
            note,
            date,
            time
        );

        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error: " + error.message,
            data: null
        });
    }
}

async function cancelAppointment(req, res) {
    try {
        const { appointmentId } = req.params;
        const userId = req.user._id;

        if (!appointmentId) {
            return res.status(400).json({
                status: 400,
                message: "Appointment ID is required",
                data: null
            });
        }

        const result = await appointmentService.cancelAppointment(appointmentId, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error: " + error.message,
            data: null
        });
    }
}

async function getAppointmentsByUser(req, res) {
    try {
        const userId = req.user._id;
        const { status = "all", page = 1, limit = 10 } = req.query;

        // Convert page and limit to numbers
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        // Validate pagination parameters
        if (pageNum < 1 || limitNum < 1) {
            return res.status(400).json({
                status: 400,
                message: "Page and limit must be positive numbers",
                data: null
            });
        }

        if (limitNum > 100) {
            return res.status(400).json({
                status: 400,
                message: "Limit cannot exceed 100",
                data: null
            });
        }

        const result = await appointmentService.getAppointmentsByUser(
            userId,
            status,
            pageNum,
            limitNum
        );

        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error: " + error.message,
            data: null
        });
    }
}

async function getAppointmentById(req, res) {
    try {
        const { appointmentId } = req.params;
        const userId = req.user._id;

        if (!appointmentId) {
            return res.status(400).json({
                status: 400,
                message: "Appointment ID is required",
                data: null
            });
        }

        const result = await appointmentService.getAppointmentById(appointmentId);
        
        if (result.status !== 200) {
            return res.status(result.status).json(result);
        }

        // Check if user has permission to view this appointment
        const appointment = result.data;
        const isCustomer = appointment.customerId._id.toString() === userId.toString();
        const isStaff = appointment.staffId && appointment.staffId._id.toString() === userId.toString();

        if (!isCustomer && !isStaff) {
            return res.status(403).json({
                status: 403,
                message: "You don't have permission to view this appointment",
                data: null
            });
        }

        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error: " + error.message,
            data: null
        });
    }
}

async function updateAppointmentStatus(req, res) {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        if (!appointmentId || !status) {
            return res.status(400).json({
                status: 400,
                message: "Appointment ID and status are required",
                data: null
            });
        }

        const result = await appointmentService.updateAppointmentStatus(appointmentId, status);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error: " + error.message,
            data: null
        });
    }
}

async function deleteAppointment(req, res) {
    try {
        const { appointmentId } = req.params;
        const userId = req.user._id;

        if (!appointmentId) {
            return res.status(400).json({
                status: 400,
                message: "Appointment ID is required",
                data: null
            });
        }

        // First check if appointment exists and user has permission
        const appointmentCheck = await appointmentService.getAppointmentById(appointmentId);
        
        if (appointmentCheck.status !== 200) {
            return res.status(appointmentCheck.status).json(appointmentCheck);
        }

        // Check if user is the customer of this appointment (only customers can delete)
        const appointment = appointmentCheck.data;
        const isCustomer = appointment.customerId._id.toString() === userId.toString();

        if (!isCustomer) {
            return res.status(403).json({
                status: 403,
                message: "Only customers can delete their appointments",
                data: null
            });
        }

        // Don't allow deletion of confirmed or completed appointments
        if (appointment.status === "confirmed" || appointment.status === "completed") {
            return res.status(400).json({
                status: 400,
                message: "Cannot delete confirmed or completed appointments. Please cancel instead.",
                data: null
            });
        }

        const result = await appointmentService.deleteAppointment(appointmentId);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error: " + error.message,
            data: null
        });
    }
}

async function submitReview(req, res) {
    try {
        const {appointmentId}=req.params;
        const { rating, comment } = req.body;
        const customerId = req.user._id;

        if (!appointmentId || !rating) {
            return res.status(400).json({
                status: 400,
                message: "appointmentId and rating are required",
                data: null
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
            return res.status(400).json({
                status: 400,
                message: "Rating must be an integer between 1 and 5",
                data: null
            });
        }

        const result = await appointmentService.submitReview(
            customerId,
            appointmentId,
            parseInt(rating, 10),
            comment
        );

        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error: " + error.message,
            data: null
        });
    }
}

module.exports = {
    createAppointment,
    cancelAppointment,
    getAppointmentsByUser,
    getAppointmentById,
    updateAppointmentStatus,
    deleteAppointment,
    submitReview
};