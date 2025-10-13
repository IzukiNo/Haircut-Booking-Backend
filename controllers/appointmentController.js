const appointmentService = require("../services/appointmentService");

async function createAppointment(req, res) {
  try {
    const userId = req.user._id;
    const { stylistId, serviceId, branchId, note, date, time } = req.body;

    const result = await appointmentService.createAppointment(
      userId,
      stylistId,
      serviceId,
      branchId,
      note,
      date,
      time
    );

    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function cancelAppointment(req, res) {
  try {
    const userId = req.user._id;
    const { appointmentId } = req.params;

    const result = await appointmentService.cancelAppointment(
      userId,
      appointmentId
    );
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function approveAppointment(req, res) {
  try {
    const staffId = req.user._id;
    const { appointmentId } = req.params;

    const result = await appointmentService.approveAppointment(
      staffId,
      appointmentId
    );
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function completeAppointment(req, res) {
  try {
    const stylistId = req.user._id;
    const { appointmentId } = req.params;

    const result = await appointmentService.completeAppointment(
      stylistId,
      appointmentId
    );
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function getAppointmentsByUser(req, res) {
  try {
    const userId = req.user._id;
    const { status, page, limit } = req.query;

    const result = await appointmentService.getAppointmentsByUser(
      userId,
      status,
      Number(page),
      Number(limit)
    );

    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function getAppointmentById(req, res) {
  try {
    const { appointmentId } = req.params;

    const result = await appointmentService.getAppointmentById(appointmentId);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function updateAppointmentStatus(req, res) {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const result = await appointmentService.changeAppointmentStatus(
      appointmentId,
      status
    );
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { appointmentId } = req.params;

    const result = await appointmentService.deleteAppointment(appointmentId);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

module.exports = {
  createAppointment,
  cancelAppointment,
  approveAppointment,
  completeAppointment,
  getAppointmentsByUser,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};
