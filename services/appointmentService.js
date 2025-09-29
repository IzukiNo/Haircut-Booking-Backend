const Appointment = require("../models/Appointment");
const Review = require("../models/Review");

async function createAppointment(customerId,staffId,serviceId,branchId,note="") {}

async function cancelAppointment(appointmentId) {} // Use updateAppointmentStatus to "canceled"

async function getAppointmentsByUser(
  userId,
  status = "all",
  page = 1,
  limit = 10
) {}

async function getAppointmentById(appointmentId) {}

async function updateAppointmentStatus(appointmentId, status = "confirmed") {}

async function deleteAppointment(appointmentId) {}

async function submitReview(customerId,appointmentId,rating,comment="") {}

module.exports = {
  createAppointment,
  cancelAppointment,
  getAppointmentsByUser,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  submitReview,
};
