const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

async function register(name, email, password) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { status: 400, message: "User da ton tai" };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username: name,
    email: email,
    password: hashedPassword,
  });

  await user.save();
  return { status: 201, message: "Dang ky thanh cong" };
}
async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    return { status: 400, message: "User khong ton tai" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { status: 400, message: "Mat khau khong chinh xac" };
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  return { status: 200, message: "Dang nhap thanh cong", token };
}
async function me(id) {
  const user = await User.findById(id);
  if (!user) {
    return { status: 404, message: "User khong ton tai" };
  }

  const data = {
    username: user.username,
    email: user.email,
    phone: user.phone ? user.phone : "",
  };

  return { status: 200, message: "Lay thong tin user thanh cong", data };
}

module.exports = { register, login, me };
