const staffService = require("../services/staffService");

const { buildEmployeeFilter } = require("../utils/buildEmployeeFilter");

async function createStaff(req, res) {
  try {
    const { userId, branchId, position, schedule } = req.body;
    const result = await staffService.createStaff({
      userId,
      branchId,
      position,
      schedule,
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("createStaff error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function getStaffByUserId(req, res) {
  try {
    const { userId } = req.params;
    const result = await staffService.getStaffByUserId(userId);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("getStaffByUserId error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function getAllStaffs(req, res) {
  try {
    const { page, limit, ...filter } = req.query;
    const result = await staffService.getAllStaffs({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filter: buildEmployeeFilter(filter),
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("getAllStaffs error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function updateStaff(req, res) {
  try {
    const { userId } = req.params;
    const { branchId, position, schedule } = req.body;
    const result = await staffService.updateStaff(userId, {
      branchId,
      position,
      schedule,
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("updateStaff error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function deleteStaff(req, res) {
  try {
    const { userId } = req.params;
    const result = await staffService.deleteStaff(userId);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("deleteStaff error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

module.exports = {
  createStaff,
  getStaffByUserId,
  getAllStaffs,
  updateStaff,
  deleteStaff,
};
