const Branch = require("../models/Branch");

async function createBranch(name, address, phone, managerId) {
  try {
    const branch = new Branch({
      name,
      address,
      phone,
      managerId: managerId || null,
    });

    await branch.save();

    const data = await Branch.findById(branch._id).populate({
      path: "managerId",
      select: "username email phone",
    });

    return {
      status: 201,
      message: "Branch created successfully",
      data,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Error creating branch",
    };
  }
}

async function getAllBranches() {
  try {
    const data = await Branch.find().populate({
      path: "managerId",
      select: "username email phone",
    });

    return {
      status: 200,
      message: "Branches fetched successfully",
      data,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching branches",
    };
  }
}

async function getBranchById(branchId) {
  try {
    const data = await Branch.findById(branchId).populate({
      path: "managerId",
      select: "username email phone",
    });

    if (!data) {
      return {
        status: 404,
        message: "Branch not found",
      };
    }

    return {
      status: 200,
      message: "Branch fetched successfully",
      data,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching branch",
    };
  }
}

async function updateBranch(branchId, data) {
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return { status: 404, message: "Branch not found" };
    }

    if (data.name !== undefined) branch.name = data.name;
    if (data.address !== undefined) branch.address = data.address;
    if (data.phone !== undefined) branch.phone = data.phone;
    if (data.managerId !== undefined) branch.managerId = data.managerId;

    await branch.save();

    const updated = await Branch.findById(branchId).populate({
      path: "managerId",
      select: "username email phone",
    });

    return {
      status: 200,
      message: "Branch updated successfully",
      data: updated,
    };
  } catch (error) {
    return { status: 500, message: "Error updating branch" };
  }
}

async function deleteBranch(branchId) {
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return {
        status: 404,
        message: "Branch not found",
      };
    }

    await Branch.findByIdAndDelete(branchId);

    return {
      status: 200,
      message: "Branch deleted successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error deleting branch",
    };
  }
}

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
