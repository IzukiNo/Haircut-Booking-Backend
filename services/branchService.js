const Branch = require("../models/Branch");

async function createBranch(name, address, phone, managerId) {}

async function getAllBranches() {}

async function getBranchById(branchId) {}

async function updateBranch(branchId, name, address, phone, managerId) {}

async function deleteBranch(branchId) {}

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
