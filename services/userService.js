const User = require("../models/User");

const { Types } = require("mongoose");

async function updateUser(id, data) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return { status: 400, message: "Invalid User ID", data: null };
    }
    const { password, roles, _id, ...safeData } = data;
    const updated = await User.findByIdAndUpdate(
      id,
      { ...safeData, updatedAt: new Date() },
      { new: true }
    ).select("-password -__v -createdAt -updatedAt -roles");

    if (!updated) {
      return { status: 404, message: "User not found", data: null };
    }

    return { status: 200, message: "User updated successfully", data: updated };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
}

async function updatePassword(userId, currentPassword, newPassword) {}

async function deleteAccount(userId, password) {}

module.exports = { updateUser, updatePassword, deleteAccount };
