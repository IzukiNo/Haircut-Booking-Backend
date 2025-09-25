const User = require("../models/User");

async function updateUser(id, data) {
  try {
    const { password, roles, _id, ...safeData } = data;

    const updated = await User.findByIdAndUpdate(
      id,
      { ...safeData, updatedAt: new Date() },
      { new: true }
    ).select("-password -__v -_id -createdAt -updatedAt -roles");

    if (!updated) {
      return { status: 404, message: "User not found", data: null };
    }

    return { status: 200, message: "User updated successfully", data: updated };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
}

module.exports = { updateUser };
