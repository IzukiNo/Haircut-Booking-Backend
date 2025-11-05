const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoute");
const reviewRoutes = require("./routes/reviewRoute");
const branchRoutes = require("./routes/branchRoute");
const serviceRoutes = require("./routes/serviceRoute");
const stylistRoutes = require("./routes/stylistRoute");
const staffRoutes = require("./routes/staffRoute");
const cashierRoutes = require("./routes/cashierRoute");
const employeeRoutes = require("./routes/employeeRoute");
const transactionRoutes = require("./routes/transactionRoute");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next();
});

if ((process.env.NODE_ENV || "prod").trim() === "dev") {
  app.use(morgan("dev"));
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🟢 Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Kết nối MongoDB thất bại:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/stylists", stylistRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/cashiers", cashierRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/transactions", transactionRoutes);

module.exports = app;
