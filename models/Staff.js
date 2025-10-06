const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  position: {
    type: String,
    enum: ["receptionist", "manager"],
    default: "receptionist",
  },
  workDays: [
    {
      day: {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        required: true,
      },
      startTime: {
        type: String,
        match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
        required: true,
      },
      endTime: {
        type: String,
        match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
        required: true,
      },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Staff", staffSchema);
