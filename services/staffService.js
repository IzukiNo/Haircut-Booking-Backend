const Staff = require("../models/Staff");
const User = require("../models/User");
const employeeHelper = require("../helpers/employeeHelper");

const { Types } = require("mongoose");

async function createStaff({ userId, branchId, position, schedule }) {
  if (!userId || !branchId || !schedule) {
    return { status: 400, message: "Missing Parameters", data: null };
  }

  if (!Array.isArray(schedule) || schedule.length === 0) {
    return { status: 400, message: "Invalid schedule format", data: null };
  }

  if (position && !["receptionist", "manager"].includes(position)) {
    return { status: 400, message: "Invalid position", data: null };
  }

  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid User ID", data: null };
  }

  const user = await User.findById(userId);
  if (!user) return { status: 404, message: "User not found", data: null };

  const exist = await employeeHelper.findEmployeeById("staff", userId);
  if (exist)
    return {
      status: 409,
      message: "User already is a staff",
      data: null,
    };
  const staff = await Staff.create({ userId, branchId, position, schedule });
  return { status: 201, message: "Staff created", data: staff };
}

async function getStaffByUserId(userId) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }
  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }
  const staff = await employeeHelper.getEmployeeById("staff", userId);
  if (!staff) return { status: 404, message: "Staff not found", data: null };
  return { status: 200, message: "Success", data: staff };
}

async function getAllStaffs(query) {
  const result = await employeeHelper.getAllEmployees("staff", query);
  return { status: 200, message: "Success", ...result };
}

async function updateStaff(userId, { branchId, position, schedule }) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }

  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }
  const staff = await employeeHelper.getEmployeeById("staff", userId);
  if (!staff) return { status: 404, message: "Staff not found", data: null };

  const staffDB = await Staff.findById(staff._id);

  if (branchId) staffDB.branchId = branchId;
  if (position) {
    if (!["receptionist", "manager"].includes(position)) {
      return { status: 400, message: "Invalid position", data: null };
    }
    staffDB.position = position;
  }
  if (schedule) staffDB.schedule = schedule;
  const saved = await staffDB.save();

  await saved.populate([
    { path: "userId", select: "username email" },
    { path: "branchId", select: "name address phone" },
  ]);
  return { status: 200, message: "Staff updated", data: saved };
}

async function deleteStaff(userId) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }
  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }
  const staff = await employeeHelper.getEmployeeById("staff", userId);
  if (!staff) return { status: 404, message: "Staff not found", data: null };

  const staffDB = await Staff.findById(staff._id).populate([
    { path: "userId", select: "username email" },
    { path: "branchId", select: "name address phone" },
  ]);

  await staffDB.deleteOne();

  return { status: 200, message: "Staff deleted", data: staffDB };
}

module.exports = {
  createStaff,
  getStaffByUserId,
  getAllStaffs,
  updateStaff,
  deleteStaff,
};
