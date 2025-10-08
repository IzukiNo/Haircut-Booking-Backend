const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }, // in đồng
  status: { type: Boolean, default: true }, // true: available, false: unavailable
  duration: { type: Number, required: true }, // in minutes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Service", serviceSchema);
