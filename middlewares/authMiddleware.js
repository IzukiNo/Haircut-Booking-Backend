const jwt = require("jsonwebtoken");
const User = require("../models/User");

function authMiddleware(requiredRoles = []) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Không có token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User không tồn tại" });
      }

      req.user = user;

      if (requiredRoles.length > 0) {
        const hasPermission = requiredRoles.some((r) => user.roles.includes(r));
        if (!hasPermission) {
          return res.status(403).json({ message: "Không đủ quyền" });
        }
      }

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token đã hết hạn" });
      }
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
}

module.exports = authMiddleware;
