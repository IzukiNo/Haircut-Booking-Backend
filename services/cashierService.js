const Cashier = require("../models/Cashier");
const User = require("../models/User");
const employeeHelper = require("../helpers/employeeHelper");

const { addRoleToUser, removeRoleFromUser } = require("../utils/userRoleUtils");

const { Types } = require("mongoose");

async function createCashier({ userId, branchId, schedule }) {
  if (!userId || !branchId) {
    return { status: 400, message: "Missing Parameters", data: null };
  }

  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid User ID", data: null };
  }

  const user = await User.findById(userId);
  if (!user) return { status: 404, message: "User not found", data: null };

  const exist = await employeeHelper.findEmployeeById("cashier", userId);
  if (exist)
    return {
      status: 409,
      message: "User already is a cashier",
      data: null,
    };

  const cashier = await Cashier.create({ userId, branchId, schedule });
  if (!cashier) {
    return { status: 500, message: "Failed to create cashier", data: null };
  }

  const addRole = await addRoleToUser(userId, "cashier");
  if (!addRole) {
    await cashier.deleteOne();
    return {
      status: 500,
      message: "Failed to assign role to user",
      data: null,
    };
  }

  return { status: 201, message: "Cashier created", data: cashier };
}

async function getCashierByUserId(userId) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }

  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }

  const cashier = await employeeHelper.getEmployeeById("cashier", userId);
  if (!cashier)
    return { status: 404, message: "Cashier not found", data: null };
  return { status: 200, message: "Success", data: cashier };
}

async function getAllCashiers(query) {
  const result = await employeeHelper.getAllEmployees("cashier", query);
  return { status: 200, message: "Success", ...result };
}

async function updateCashier(userId, { branchId }) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }

  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }

  const cashier = await employeeHelper.getEmployeeById("cashier", userId);
  if (!cashier)
    return { status: 404, message: "Cashier not found", data: null };

  const cashierDB = await Cashier.findById(cashier._id);
  if (branchId) cashierDB.branchId = branchId;
  const saved = await cashierDB.save();

  await saved.populate([
    { path: "userId", select: "username email" },
    { path: "branchId", select: "name address phone" },
  ]);

  return { status: 200, message: "Cashier updated", data: saved };
}

async function deleteCashier(userId) {
  if (!userId) {
    return { status: 400, message: "User ID is required", data: null };
  }
  if (!Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid user ID", data: null };
  }
  const cashier = await employeeHelper.getEmployeeById("cashier", userId);
  if (!cashier)
    return { status: 404, message: "Cashier not found", data: null };
  const cashierDB = await Cashier.findById(cashier._id).populate([
    { path: "userId", select: "username email" },
    { path: "branchId", select: "name address phone" },
  ]);

  const remove = await cashierDB.deleteOne();
  if (!remove) {
    return { status: 500, message: "Failed to delete cashier", data: null };
  }
  const removeRole = await removeRoleFromUser(userId, "cashier");
  if (!removeRole) {
    return {
      status: 500,
      message: "Failed to remove role from user",
      data: null,
    };
  }

  return { status: 200, message: "Cashier deleted", data: cashierDB };
}

module.exports = {
  createCashier,
  getCashierByUserId,
  getAllCashiers,
  updateCashier,
  deleteCashier,
};
