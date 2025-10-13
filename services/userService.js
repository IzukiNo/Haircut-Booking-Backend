const User = require("../models/User");
const bcrypt = require("bcrypt");

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

async function updatePassword(userId, currentPassword, newPassword) {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      return { status: 400, message: "Invalid User ID" };
    }
    if (!currentPassword || !newPassword) {
      return {
        status: 400,
        message: "Current password and new password are required",
      };
    }
    const user = await User.findById(userId);
    if (!user) {
      return { status: 404, message: "User not found" };
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { status: 400, message: "Incorrect password or email" };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    return { status: 200, message: "Password updated successfully" };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

async function deleteAccount(userId, password) {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      return { status: 400, message: "Invalid User ID" };
    }

    if (!password) {
      return { status: 400, message: "Password is required" };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 400, message: "Incorrect password or email" };
    }

    await User.findByIdAndDelete(userId);
    return { status: 200, message: "Account deleted successfully" };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

module.exports = { updateUser, updatePassword, deleteAccount };
