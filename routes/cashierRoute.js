const router = require("express").Router();
const cashierController = require("../controllers/cashierController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/",
  authMiddleware(["staff", "admin"]),
  cashierController.createCashier
);
router.get(
  "/:userId",
  authMiddleware(["staff", "admin"]),
  cashierController.getCashierByUserId
);
router.get(
  "/",
  authMiddleware(["staff", "admin"]),
  cashierController.getAllCashiers
);
router.patch(
  "/:userId",
  authMiddleware(["staff", "admin"]),
  cashierController.updateCashier
);
router.delete(
  "/:userId",
  authMiddleware(["staff", "admin"]),
  cashierController.deleteCashier
);

module.exports = router;
