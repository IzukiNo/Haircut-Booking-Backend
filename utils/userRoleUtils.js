const User = require("../models/User");

// Global role order
const VALID_ROLES = ["user", "stylist", "cashier", "staff", "admin"];

/**
 * Add role to user
 * return true / false
 */
async function addRoleToUser(userId, role) {
  try {
    if (!userId || !role) return false;

    let user = await User.findById(userId);
    if (!user) return false;

    let normalizedRole = String(role).trim().toLowerCase();
    if (!VALID_ROLES.includes(normalizedRole)) return false;

    if (!Array.isArray(user.roles)) user.roles = [];

    let hasRole = user.roles.some(
      (r) => String(r).toLowerCase() === normalizedRole
    );
    if (hasRole) return true;

    user.roles.push(normalizedRole);
    await user.save();
    return true;
  } catch (error) {
    console.error("addRoleToUser error:", error.message);
    return false;
  }
}

/**
 * Remove a role from user
 */
async function removeRoleFromUser(userId, role) {
  try {
    if (!userId || !role) return false;

    let user = await User.findById(userId);
    if (!user) return false;

    let normalizedRole = String(role).trim().toLowerCase();
    if (!VALID_ROLES.includes(normalizedRole)) return false;

    if (!Array.isArray(user.roles)) user.roles = [];

    let before = user.roles.length;
    user.roles = user.roles.filter(
      (r) => String(r).toLowerCase() !== normalizedRole
    );

    if (user.roles.length === before) return true; // không có role đó thì coi như ok
    await user.save();
    return true;
  } catch (error) {
    console.error("removeRoleFromUser error:", error.message);
    return false;
  }
}

/**
 * Promote user to next higher role
 */
async function promoteUser(userId) {
  try {
    if (!userId) return false;

    let user = await User.findById(userId);
    if (!user) return false;

    if (!Array.isArray(user.roles)) user.roles = [];

    // Xác định role cao nhất hiện tại
    let highestRoleIndex = -1;
    for (let r of user.roles) {
      let idx = VALID_ROLES.indexOf(String(r).toLowerCase());
      if (idx > highestRoleIndex) highestRoleIndex = idx;
    }

    // Nếu đã là admin -> không promote nữa
    if (highestRoleIndex === VALID_ROLES.length - 1) return true;

    let nextRole = VALID_ROLES[highestRoleIndex + 1];
    if (!user.roles.includes(nextRole)) {
      user.roles.push(nextRole);
      await user.save();
    }

    return true;
  } catch (error) {
    console.error("promoteUser error:", error.message);
    return false;
  }
}

/**
 * Demote user to next lower role
 */
async function demoteUser(userId) {
  try {
    if (!userId) return false;

    let user = await User.findById(userId);
    if (!user) return false;

    if (!Array.isArray(user.roles)) user.roles = [];

    // Xác định role cao nhất hiện tại
    let highestRoleIndex = -1;
    for (let r of user.roles) {
      let idx = VALID_ROLES.indexOf(String(r).toLowerCase());
      if (idx > highestRoleIndex) highestRoleIndex = idx;
    }

    // Nếu đang là user -> không demote nữa
    if (highestRoleIndex <= 0) return true;

    let currentRole = VALID_ROLES[highestRoleIndex];
    let lowerRole = VALID_ROLES[highestRoleIndex - 1];

    // Xóa role hiện tại, thêm role thấp hơn
    user.roles = user.roles.filter((r) => r !== currentRole);
    if (!user.roles.includes(lowerRole)) user.roles.push(lowerRole);

    await user.save();
    return true;
  } catch (error) {
    console.error("demoteUser error:", error.message);
    return false;
  }
}

module.exports = {
  addRoleToUser,
  removeRoleFromUser,
  promoteUser,
  demoteUser,
};
