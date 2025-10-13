const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post(
  "/",
  authMiddleware(["user"]),
  appointmentController.createAppointment
);
router.get(
  "/me",
  authMiddleware(["user"]),
  appointmentController.getAppointmentsByUser
);
router.get(
  "/:appointmentId",
  authMiddleware(["staff"]),
  appointmentController.getAppointmentById
);
router.patch(
  "/:appointmentId/cancel",
  authMiddleware(["user"]),
  appointmentController.cancelAppointment
);
router.patch(
  "/:appointmentId/approve",
  authMiddleware(["staff"]),
  appointmentController.approveAppointment
);
router.patch(
  "/:appointmentId/complete",
  authMiddleware(["stylist"]),
  appointmentController.completeAppointment
);
router.patch(
  "/:appointmentId/status",
  authMiddleware(["admin"]),
  appointmentController.updateAppointmentStatus
);
router.delete(
  "/:appointmentId",
  authMiddleware(["admin"]),
  appointmentController.deleteAppointment
);

module.exports = router;
