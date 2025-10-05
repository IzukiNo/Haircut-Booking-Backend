const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.patch("/me", authMiddleware(["user"]), userController.updateUser);
router.patch(
  "/me/password",
  authMiddleware(["user"]),
  userController.updatePassword
);
router.delete("/me", authMiddleware(["user"]), userController.deleteAccount);

module.exports = router;
