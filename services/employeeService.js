const Cashier = require("../models/Cashier");
const Stylist = require("../models/Stylist");
const Staff = require("../models/Staff");

const CashierService = require("./cashierService");
const StylistService = require("./stylistService");
const StaffService = require("./staffService");

const employeeHelper = require("../helpers/employeeHelper");
const userRoleUtils = require("../utils/userRoleUtils");

const User = require("../models/User");

const roles = ["user", "cashier", "stylist", "staff", "admin"];

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

async function getAllEmployees(page = 1, limit = 10) {
  try {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const roles = ["user", "cashier", "stylist", "staff", "admin"];
    function getHighestRoleId(userRoles) {
      if (!userRoles || userRoles.length === 0) return 0;
      let highest = userRoles[0];
      for (const role of userRoles) {
        if (roles.indexOf(role) > roles.indexOf(highest)) highest = role;
      }
      return roles.indexOf(highest);
    }

    // 🧱 Base pipeline với thêm schedule
    const basePipeline = [
      // 🏦 Cashiers (không có schedule)
      {
        $project: {
          userId: 1,
          branchId: 1,
          active: 1,
          createdAt: 1,
          schedule: 1,
          roleType: { $literal: "cashier" },
        },
      },
      // ✂️ Stylists
      {
        $unionWith: {
          coll: "stylists",
          pipeline: [
            {
              $project: {
                userId: 1,
                branchId: 1,
                active: 1,
                createdAt: 1,
                schedule: 1,
                roleType: { $literal: "stylist" },
              },
            },
          ],
        },
      },
      // 🧑‍💼 Staffs
      {
        $unionWith: {
          coll: "staffs",
          pipeline: [
            {
              $project: {
                userId: 1,
                branchId: 1,
                active: 1,
                createdAt: 1,
                schedule: 1,
                roleType: { $literal: "staff" },
              },
            },
          ],
        },
      },
    ];

    // 🧮 Count unique userId
    const countPipeline = [
      ...basePipeline,
      { $group: { _id: "$userId" } },
      { $count: "totalCount" },
    ];
    const countResult = await Cashier.aggregate(countPipeline);
    const totalCount = countResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // ⚙️ Main pipeline (có schedule)
    const pipeline = [
      ...basePipeline,
      {
        $group: {
          _id: "$userId",
          doc: { $first: "$$ROOT" },
          allRoles: { $addToSet: "$roleType" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            userId: "$_id",
            branchId: "$doc.branchId",
            active: "$doc.active",
            createdAt: "$doc.createdAt",
            roleType: "$doc.roleType",
            allRoles: "$allRoles",
            schedule: "$doc.schedule", // ✅ giữ lại schedule
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "branches",
          localField: "branchId",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: { path: "$branch", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$user._id",
          username: "$user.username",
          phone: "$user.phone",
          email: "$user.email",
          userRoles: "$user.roles",
          branch: {
            id: "$branch._id",
            name: "$branch.name",
          },
          status: "$active",
          roleType: 1,
          allRoles: 1,
          schedule: 1, // ✅ include schedule vào output
        },
      },
    ];

    const result = await Cashier.aggregate(pipeline);

    const formatted = result.map((e) => ({
      id: e.userId,
      username: e.username,
      phone: e.phone,
      email: e.email,
      status: e.status,
      branch: e.branch || null,
      role: getHighestRoleId(e.userRoles),
      roleType: e.roleType,
      allRoles: e.allRoles,
      schedule: e.schedule || [], // ✅ fallback nếu null
    }));

    return {
      status: 200,
      message: "Lấy danh sách nhân viên thành công",
      data: formatted,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Đã xảy ra lỗi khi lấy danh sách nhân viên",
      error: error.message,
    };
  }
}

async function addEmployee(email, data) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: 404,
        message: "Người dùng không tồn tại",
      };
    }

    if (user.roles.includes(data.role)) {
      return {
        status: 400,
        message: `Người dùng đã có vai trò ${data.role}`,
      };
    }

    const { role, branchId, schedule, position } = data;
    switch (role) {
      case "cashier":
        await CashierService.createCashier({
          userId: user._id,
          branchId,
          schedule,
        });
        break;
      case "stylist":
        await StylistService.createStylist({
          userId: user._id,
          branchId,
          schedule,
        });
        break;
      case "staff":
        await StaffService.createStaff({
          userId: user._id,
          branchId,
          position: position ? position : "receptionist",
          schedule,
        });
        break;
      default:
        return {
          status: 400,
          message: "Vai trò không hợp lệ",
        };
    }
    return {
      status: 201,
      message: "Thêm nhân viên thành công",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Đã xảy ra lỗi khi thêm nhân viên" + error.message,
      error: error.message,
    };
  }
}

async function switchEmployeeRole(
  userId,
  currentRole,
  newRole,
  extraData = {}
) {
  const currentModel = getModelByRole(roles[currentRole]);
  const newModel = getModelByRole(roles[newRole]);

  console.log(extraData);

  if (!currentModel || !newModel) {
    return { status: 400, message: "Invalid role(s)", data: null };
  }

  // 🔎 Tìm user theo email
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return { status: 404, message: "User not found", data: null };
  }

  // 🔎 Tìm record hiện tại (theo role)
  const oldRecord = await currentModel.findOne({ userId: user._id });
  if (!oldRecord) {
    return {
      status: 404,
      message: `Employee with role ${currentRole} not found`,
      data: null,
    };
  }

  // ✅ Nếu có yêu cầu đổi thông tin user (username / phone)
  const updatedUserFields = {};
  if (extraData.username && extraData.username !== user.username) {
    updatedUserFields.username = extraData.username;
  }
  if (extraData.phone && extraData.phone !== user.phone) {
    updatedUserFields.phone = extraData.phone;
  }

  if (Object.keys(updatedUserFields).length > 0) {
    Object.assign(user, updatedUserFields);
    await user.save();
  }

  // ✅ Nếu role không thay đổi → chỉ update dữ liệu hiện tại
  if (currentRole === newRole) {
    Object.assign(oldRecord, extraData);
    await oldRecord.save();

    return {
      status: 200,
      message: `Employee with role ${currentRole} updated successfully`,
      data: {
        user,
        employee: oldRecord,
      },
    };
  }

  // ✅ Merge logic: nếu có extraData thì dùng, không thì giữ dữ liệu cũ
  const mergedData = {
    userId: oldRecord.userId,
    branchId: extraData.branchId || oldRecord.branchId,
    active:
      typeof extraData.active === "boolean"
        ? extraData.active
        : oldRecord.active,
    ...oldRecord.toObject(),
    ...extraData,
  };

  // Xóa các field không nên clone
  delete mergedData._id;
  delete mergedData.createdAt;

  // 1️⃣ Xóa khỏi collection cũ
  await currentModel.findByIdAndDelete(oldRecord._id);

  // 2️⃣ Tạo record mới bên collection role mới
  const newRecord = await newModel.create(mergedData);

  // 3️⃣ Cập nhật role trong User
  try {
    await userRoleUtils.removeRoleFromUser(user._id, currentRole);
    await userRoleUtils.addRoleToUser(user._id, newRole);
  } catch (err) {
    // rollback nếu lỗi
    await newModel.findByIdAndDelete(newRecord._id);
    await currentModel.create(oldRecord.toObject());
    return {
      status: 500,
      message: "Failed to update user roles — rollback done",
      data: null,
    };
  }

  return {
    status: 200,
    message: `Employee switched from ${currentRole} to ${newRole}`,
    data: {
      user,
      employee: newRecord,
    },
  };
}

async function removeEmployee(userId, role) {
  const model = getModelByRole(role);
  if (!model) {
    return { status: 400, message: "Invalid role", data: null };
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return { status: 404, message: "User not found", data: null };
  }
  const employeeRecord = await model.findOne({ userId: user._id });
  if (!employeeRecord) {
    return {
      status: 404,
      message: `Employee with role ${role} not found`,
      data: null,
    };
  }

  await model.findByIdAndDelete(employeeRecord._id);
  await userRoleUtils.removeRoleFromUser(user._id, role);

  return {
    status: 200,
    message: `Employee with role ${role} removed successfully`,
    data: null,
  };
}

module.exports = {
  getAllEmployees,
  addEmployee,
  removeEmployee,
  switchEmployeeRole,
};
