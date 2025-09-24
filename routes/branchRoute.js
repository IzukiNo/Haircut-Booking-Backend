const branchController = require("../controllers/branchController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/", authMiddleware(["admin"]), branchController.createBranch);
router.get("/", authMiddleware(["user"]), branchController.getAllBranches);
router.get(
  "/:branchId",
  authMiddleware(["user"]),
  branchController.getBranchById
);
router.put(
  "/:branchId",
  authMiddleware(["admin"]),
  branchController.updateBranch
);
router.delete(
  "/:branchId",
  authMiddleware(["admin"]),
  branchController.deleteBranch
);
