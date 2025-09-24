const branchService = require("../services/branchService");

async function createBranch(req, res) {
  try {
    const { name, address, phone, managerId } = req.body;

    if (!name || !address || !phone) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }

    const result = await branchService.createBranch(
      name,
      address,
      phone,
      managerId
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

async function getAllBranches(req, res) {
  try {
    const result = await branchService.getAllBranches();
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

async function getBranchById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }

    const result = await branchService.getBranchById(id);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

async function updateBranch(req, res) {
  try {
    const { id } = req.params;
    if (!id || !req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }

    const result = await branchService.updateBranch(id, req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

async function deleteBranch(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }

    const result = await branchService.deleteBranch(id);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
