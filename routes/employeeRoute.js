const router = require("express").Router();
const employeesController = require("../controllers/employeeController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/",
  authMiddleware(["staff", "admin"]),
  employeesController.getAllEmployees
);
router.post("/", authMiddleware(["admin"]), employeesController.addEmployee);
router.patch(
  "/",
  authMiddleware(["admin"]),
  employeesController.changeEmployeeRole
);
router.delete(
  "/:id",
  authMiddleware(["admin"]),
  employeesController.removeEmployee
);

module.exports = router;
