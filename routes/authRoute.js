const router = require("express").Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware(["user"]), authController.me);

module.exports = router;
