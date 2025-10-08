const cashierService = require("../services/cashierService");

const { buildEmployeeFilter } = require("../utils/buildEmployeeFilter");

async function createCashier(req, res) {
  try {
    const { userId, branchId } = req.body;
    const result = await cashierService.createCashier({ userId, branchId });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("createCashier error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function getCashierByUserId(req, res) {
  try {
    const { userId } = req.params;
    const result = await cashierService.getCashierByUserId(userId);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("getCashierByUserId error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function getAllCashiers(req, res) {
  try {
    const { page, limit, ...filter } = req.query;
    const result = await cashierService.getAllCashiers({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filter: buildEmployeeFilter(filter),
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("getAllCashiers error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function updateCashier(req, res) {
  try {
    const { userId } = req.params;
    const { branchId } = req.body;
    const result = await cashierService.updateCashier(userId, { branchId });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("updateCashier error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function deleteCashier(req, res) {
  try {
    const { userId } = req.params;
    const result = await cashierService.deleteCashier(userId);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("deleteCashier error:", err);
    const status = err?.status || 500;
    return res.status(status).json({
      status,
      message: err?.message || "Internal Server Error",
    });
  }
}

module.exports = {
  createCashier,
  getCashierByUserId,
  getAllCashiers,
  updateCashier,
  deleteCashier,
};
