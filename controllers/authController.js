const authService = require("../services/authService");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    res.status(result.status).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: err.message || "Internal Server Error" });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(result.status).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: err.message || "Internal Server Error" });
  }
}
async function me(req, res) {
  try {
    const id = req.user.id;
    const result = await authService.me(id);
    res.status(result.status).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: err.message || "Internal Server Error" });
  }
}

module.exports = { register, login, me };
