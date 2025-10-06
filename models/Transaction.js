const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cashier",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank_transfer", "momo", "zalo_pay"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "failed", "refunded"],
    default: "pending",
  },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
});

module.exports = mongoose.model("Transaction", transactionSchema);
