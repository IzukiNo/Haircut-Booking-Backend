require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoute");

const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoute");
const reviewRoutes = require("./routes/reviewRoute");

const branchRoutes = require("./routes/branchRoute");
const serviceRoutes = require("./routes/serviceRoute");

const stylistRoutes = require("./routes/stylistRoute");
const staffRoutes = require("./routes/staffRoute");
const cashierRoutes = require("./routes/cashierRoute");

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

const env = process.env.NODE_ENV || "prod";
if (env.trim() === "dev") {
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

app.listen(port, () => {
  console.log(
    "Current Environment:",
    env.trim() === "dev" ? "Development ⚙️" : "Production 🟢"
  );
  console.log(`🟢 Server is running on http://localhost:${port}`);
});
