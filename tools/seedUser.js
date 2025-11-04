const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const MONGO_URI =
  "mongodb+srv://izukino:izukino181106@cluster0.poyll.mongodb.net/haircut-booking";

async function register(name, email, password, roles = ["user"]) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log(`⚠️  User ${email} đã tồn tại`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username: name,
    email: email,
    password: hashedPassword,
    roles: roles,
  });

  await user.save();
  console.log(`✅ Đã tạo tài khoản: ${email} (${roles.join(", ")})`);
}

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công");

    const users = [
      { name: "User1", email: "user1@test.com", roles: ["user"] },
      { name: "User2", email: "user2@test.com", roles: ["user"] },
      { name: "User3", email: "user3@test.com", roles: ["user"] },
      { name: "User4", email: "user4@test.com", roles: ["user"] },
      { name: "User5", email: "user5@test.com", roles: ["user"] },
    ];

    for (const u of users) {
      await register(u.name, u.email, "asdasd123", u.roles);
    }

    console.log("🎉 Hoàn tất seed tài khoản test");
  } catch (error) {
    console.error("❌ Lỗi seed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Đã ngắt kết nối MongoDB");
  }
}

seedUsers();
