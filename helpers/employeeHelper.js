const Stylist = require("../models/Stylist");
const Staff = require("../models/Staff");
const Cashier = require("../models/Cashier");

function getModelByRole(role) {
  switch (role) {
    case "stylist":
      return Stylist;
    case "staff":
      return Staff;
    case "cashier":
      return Cashier;
    default:
      return null;
  }
}

// userId from User -> Employee Id
async function findEmployeeById(role, userId) {
  const model = getModelByRole(role);
  if (!model) return false;
  const employee = await model.findOne({ userId });
  return !!employee;
}

// userId from User -> Employee Details
async function getEmployeeById(role, userId) {
  const model = getModelByRole(role);
  if (!model) return null;

  const doc = await model
    .findOne({ userId })
    .populate("userId", "username email phone")
    .populate("branchId", "name address")
    .lean();

  if (!doc) return null;
  return doc;
}

async function getAllEmployees(
  role,
  { page = 1, limit = 10, filter = {} } = {}
) {
  const model = getModelByRole(role);
  if (!model) return { data: [], pagination: {} };

  const skip = (page - 1) * limit;
  const totalCount = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  const data = await model
    .find(filter)
    .populate("userId", "username email phone")
    .populate("branchId", "name address")
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

module.exports = {
  findEmployeeById,
  getEmployeeById,
  getAllEmployees,
};
