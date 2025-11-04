const employeeService = require("../services/employeeService");

async function getAllEmployees(req, res) {
  try {
    const { page, limit } = req.query;
    const employees = await employeeService.getAllEmployees(page, limit);
    res.status(employees.status).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function addEmployee(req, res) {
  try {
    const { email, role, branchId, schedule, position } = req.body;
    console.log(schedule);
    const result = await employeeService.addEmployee(email, {
      role,
      branchId,
      schedule,
      position,
    });
    res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function changeEmployeeRole(req, res) {
  try {
    const {
      userId,
      currentRole,
      newRole,
      branchId,
      phone,
      username,
      active,
      schedule,
    } = req.body;

    // ✅ Kiểm tra input
    if (!userId || !currentRole || !newRole) {
      return res.status(400).json({
        status: 400,
        message: "Missing required fields: userId, currentRole, newRole",
        data: null,
      });
    }

    // ✅ Gọi helper xử lý logic đổi role
    const result = await employeeService.switchEmployeeRole(
      userId,
      currentRole,
      newRole,
      {
        branchId,
        phone,
        username,
        active,
        schedule,
      }
    );

    // ✅ Trả về đúng format chuẩn
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("❌ changeEmployeeRole error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
}

async function removeEmployee(req, res) {
  try {
    const { role } = req.body;
    const userId = req.params.id;
    const result = await employeeService.removeEmployee(userId, role);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("❌ removeEmployee error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
}

module.exports = {
  getAllEmployees,
  addEmployee,
  changeEmployeeRole,
  removeEmployee,
};
