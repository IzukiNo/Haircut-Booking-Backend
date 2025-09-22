const Appointment = require('../models/Appointment');

async function createAppointment(data) {}

async function cancelAppointment(appointmentId) {
    updateAppointmentStatus(appointmentId, "canceled");
}

async function getAppointmentsByUser(userId, status="all", page=1, limit=10) {}

async function getAppointmentById(appointmentId) {}

async function updateAppointmentStatus(appointmentId, status = "confirmed") {}

async function deleteAppointment(appointmentId) {}

async function submitReview(appointmentId, review) {}

module.exports = {
    createAppointment,
    cancelAppointment,
    getAppointmentsByUser,
    getAppointmentById,
    updateAppointmentStatus,
    deleteAppointment,
    submitReview
};