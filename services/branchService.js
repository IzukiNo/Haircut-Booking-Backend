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
    const updated = await Branch.findByIdAndUpdate(
      branchId,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).populate({
      path: "managerId",
      select: "username email phone",
    });

    if (!updated) {
      return { status: 404, message: "Branch not found", data: null };
    }

    return {
      status: 200,
      message: "Branch updated successfully",
      data: updated,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error updating branch",
      data: err.message,
    };
  }
}

async function deleteBranch(branchId) {
  try {
    const deletedBranch = await Branch.findByIdAndDelete(branchId);
    if (!deletedBranch) {
      return {
        status: 404,
        message: "Branch not found",
      };
    }
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
