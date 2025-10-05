const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled", "completed"],
    default: "pending",
  },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
