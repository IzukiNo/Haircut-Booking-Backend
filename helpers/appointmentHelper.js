const Appointment = require("../models/Appointment");

async function checkUserHasActiveAppointment(userId) {
  try {
    const activeAppointment = await Appointment.exists({
      customerId: userId,
      status: { $in: ["pending", "confirmed"] },
    });

    return !!activeAppointment;
  } catch (error) {
    throw new Error(
      "Error checking active appointment for user",
      userId,
      ":",
      error
    );
  }
}

async function checkAppointmentConflict(branchId, staffId, date, time) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      branchId,
      date: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: { $in: ["pending", "confirmed"] },
    };

    if (staffId) {
      query.staffId = staffId;
    }

    const conflict = await Appointment.exists(query);
    return !!conflict;
  } catch (error) {
    throw new Error("Error checking appointment conflict: " + error.message);
  }
}

module.exports = { checkUserHasActiveAppointment, checkAppointmentConflict };
