const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("/etc/ssl/cloudflare/origin.key"),
  cert: fs.readFileSync("/etc/ssl/cloudflare/origin.pem"),
};

https.createServer(options, app).listen(443, "0.0.0.0", () => {
  console.log(
    "Current Environment:",
    env.trim() === "dev" ? "Development ⚙️" : "Production 🟢"
  );
  console.log("HTTPS Server running on https://api.izukino.tech");
});
