const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/", authMiddleware(["admin"]), serviceController.createService);
router.get(
  "/",
  authMiddleware(["user", "staff", "admin"]),
  serviceController.getAllServices
);
router.get(
  "/:serviceId",
  authMiddleware(["user", "staff", "admin"]),
  serviceController.getServiceById
);
router.patch(
  "/:serviceId",
  authMiddleware(["admin"]),
  serviceController.updateService
);
router.delete(
  "/:serviceId",
  authMiddleware(["admin"]),
  serviceController.deleteService
);

module.exports = router;
