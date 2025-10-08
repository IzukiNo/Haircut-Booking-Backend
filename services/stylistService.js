const Stylist = require("../models/Stylist");
const User = require("../models/User");
const employeeHelper = require("../helpers/employeeHelper");

const { Types } = require("mongoose");

async function createStylist({ userId, branchId, schedule }) {
  if (!userId || !branchId || !schedule) {
    return { status: 400, message: "Missing Parameters", data: null };
  }

  if (!Array.isArray(schedule) || schedule.length === 0) {
    return { status: 400, message: "Invalid schedule format", data: null };
  }

  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid User ID", data: null };
  }

  const user = await User.findById(userId);
  if (!user) return { status: 404, message: "User not found", data: null };

  const exist = await employeeHelper.findEmployeeById("stylist", userId);
  if (exist)
    return { status: 409, message: "User already is a stylist", data: null };

  const stylist = await Stylist.create({ userId, branchId, schedule });
  return { status: 201, message: "Stylist created", data: stylist };
}

async function getStylistById(userId) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }
  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }
  const stylist = await employeeHelper.getEmployeeById("stylist", userId);
  if (!stylist)
    return { status: 404, message: "Stylist not found", data: null };
  return { status: 200, message: "Success", data: stylist };
}

async function getAllStylists(query) {
  const result = await employeeHelper.getAllEmployees("stylist", query);
  return { status: 200, message: "Success", ...result };
}

async function updateStylist(userId, { branchId, schedule }) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }
  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }
  const stylist = await employeeHelper.getEmployeeById("stylist", userId);
  if (!stylist)
    return { status: 404, message: "Stylist not found", data: null };

  const styleDB = await Stylist.findById(stylist._id);

  if (branchId) styleDB.branchId = branchId;
  if (schedule) styleDB.schedule = schedule;
  const saved = await styleDB.save();

  await saved.populate([
    { path: "userId", select: "username email" },
    { path: "branchId", select: "name address phone" },
  ]);

  return {
    status: 200,
    message: "Stylist updated",
    data: saved,
  };
}

async function deleteStylist(userId) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }
  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }
  const stylist = await employeeHelper.getEmployeeById("stylist", userId);
  if (!stylist)
    return { status: 404, message: "Stylist not found", data: null };

  const stylistDB = await Stylist.findById(stylist._id).populate([
    { path: "userId", select: "username email" },
    { path: "branchId", select: "name address phone" },
  ]);

  await stylistDB.deleteOne();

  return { status: 200, message: "Stylist deleted", data: stylistDB };
}

module.exports = {
  createStylist,
  getStylistById,
  getAllStylists,
  updateStylist,
  deleteStylist,
};
