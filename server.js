require("dotenv").config();
const https = require("https");
const fs = require("fs");

const app = require("./app");
const env = process.env.NODE_ENV || "prod";

const options = {
  key: fs.readFileSync("/etc/ssl/cloudflare/origin.key"),
  cert: fs.readFileSync("/etc/ssl/cloudflare/origin.pem"),
};

https.createServer(options, app).listen(443, "0.0.0.0", () => {
  console.log(
    "Current Environment:",
    env.trim() === "dev" ? "Development ⚙️" : "Production 🟢"
  );
  console.log("✅ HTTPS server running on https://api.izukino.tech");
});
