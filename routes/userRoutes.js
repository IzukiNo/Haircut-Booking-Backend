const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.patch("/me", authMiddleware(["user"]), userController.updateUser);

module.exports = router;
