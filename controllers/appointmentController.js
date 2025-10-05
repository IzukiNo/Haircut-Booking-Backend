const appointmentService = require("../services/appointmentService");

async function createAppointment(req, res) {
  try {
    const userId = req.user._id;
    const { staffId, serviceId, branchId, note, date, time } = req.body;

    const result = await appointmentService.createAppointment(
      userId,
      staffId,
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
      appointmentId,
      userId
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

    const result = await appointmentService.updateAppointmentStatus(
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
  getAppointmentsByUser,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};
