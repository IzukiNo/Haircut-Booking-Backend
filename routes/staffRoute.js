const router = require("express").Router();
const staffController = require("../controllers/staffController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware(["admin"]), staffController.createStaff);
router.get(
  "/:userId",
  authMiddleware(["admin"]),
  staffController.getStaffByUserId
);
router.get("/", authMiddleware(["admin"]), staffController.getAllStaffs);
router.patch(
  "/:userId",
  authMiddleware(["admin"]),
  staffController.updateStaff
);
router.delete(
  "/:userId",
  authMiddleware(["admin"]),
  staffController.deleteStaff
);

module.exports = router;
