require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoute");
const appointmentRoutes = require("./routes/appointmentRoute");
const userRoutes = require("./routes/userRoutes");
const branchRoutes = require("./routes/branchRoute");
const serviceRoutes = require("./routes/serviceRoute");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || `http://localhost:3001`,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

process.env.NODE_ENV === "dev" && app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🟢 Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Kết nối MongoDB thất bại:", err));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log("Current Environment:", process.env.NODE_ENV);
  console.log(`Server is running on http://localhost:${port}`);
});
