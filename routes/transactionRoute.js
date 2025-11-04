const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/",
  authMiddleware(["cashier", "staff", "admin"]),
  transactionController.createTransaction
);
router.get(
  "/:id",
  authMiddleware(["cashier", "staff", "admin"]),
  transactionController.getTransactionById
);
router.get(
  "/",
  authMiddleware(["cashier", "staff", "admin"]),
  transactionController.getAllTransactions
);
router.patch(
  "/:id",
  authMiddleware(["cashier", "staff", "admin"]),
  transactionController.updateTransaction
);
router.delete(
  "/:id",
  authMiddleware(["admin"]),
  transactionController.deleteTransaction
);
module.exports = router;
