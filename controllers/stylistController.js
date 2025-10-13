const stylistService = require("../services/stylistService");

const { buildEmployeeFilter } = require("../utils/buildEmployeeFilter");

async function createStylist(req, res) {
  try {
    const { userId, branchId, schedule } = req.body;
    const result = await stylistService.createStylist({
      userId,
      branchId,
      schedule,
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("createStylist error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function getStylistById(req, res) {
  try {
    const result = await stylistService.getStylistById(req.params.id);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("getStylistById error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function getAllStylists(req, res) {
  try {
    const { page, limit, ...filter } = req.query;
    const result = await stylistService.getAllStylists({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filter: buildEmployeeFilter(filter),
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("getAllStylists error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function updateStylist(req, res) {
  try {
    const { userId } = req.params;
    const { branchId, schedule } = req.body;
    const result = await stylistService.updateStylist(userId, {
      branchId,
      schedule,
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("updateStylist error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function deleteStylist(req, res) {
  try {
    const { userId } = req.params;
    const result = await stylistService.deleteStylist(userId);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("deleteStylist error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

module.exports = {
  createStylist,
  getStylistById,
  getAllStylists,
  updateStylist,
  deleteStylist,
};
