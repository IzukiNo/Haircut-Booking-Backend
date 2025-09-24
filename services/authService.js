const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

async function register(name, email, password) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { status: 400, message: "User đã tồn tại" };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username: name,
    email: email,
    password: hashedPassword,
  });

  await user.save();
  return { status: 201, message: "Đăng ký thành công" };
}
async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    return { status: 400, message: "Sai Email hoặc mật khẩu" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { status: 400, message: "Sai Email hoặc mật khẩu" };
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  return { status: 200, message: "Đăng nhập thành công", token };
}
async function me(id) {
  const user = await User.findById(id);
  if (!user) {
    return { status: 404, message: "User không tồn tại" };
  }

  const data = {
    username: user.username,
    email: user.email,
    phone: user.phone ? user.phone : "",
  };

  return { status: 200, message: "Lấy thông tin User thành công", data };
}

module.exports = { register, login, me };
