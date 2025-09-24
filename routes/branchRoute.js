const branchController = require("../controllers/branchController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/", authMiddleware(["admin"]), branchController.createBranch);
router.get(
  "/",
  authMiddleware(["user", "staff", "admin"]),
  branchController.getAllBranches
);
router.get(
  "/:id",
  authMiddleware(["user", "staff", "admin"]),
  branchController.getBranchById
);
router.patch("/:id", authMiddleware(["admin"]), branchController.updateBranch);
router.delete("/:id", authMiddleware(["admin"]), branchController.deleteBranch);

module.exports = router;
