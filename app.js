require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoute");
const appointmentRoutes = require("./routes/appointmentRoute");
const userRoutes = require("./routes/userRoutes");

const port = 3000;

const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🟢 Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Kết nối MongoDB thất bại:", err));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
