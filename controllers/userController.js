const userService = require("../services/userService");

async function updateUser(req, res) {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }
    const result = await userService.updateUser(userId, updateData);
    return res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

module.exports = { updateUser };
