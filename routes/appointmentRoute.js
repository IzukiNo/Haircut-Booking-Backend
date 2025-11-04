const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post(
  "/",
  authMiddleware(["user"]),
  appointmentController.createAppointment
);
router.post(
  "/force",
  authMiddleware(["staff", "admin"]),
  appointmentController.forceCreateAppointment
);
router.get(
  "/me",
  authMiddleware(["user"]),
  appointmentController.getAppointmentsByUser
);
router.get(
  "/",
  authMiddleware(["stylist", "staff", "admin"]),
  appointmentController.getAllAppointments
);
router.get(
  "/:appointmentId",
  authMiddleware(["staff", "admin"]),
  appointmentController.getAppointmentById
);
router.patch(
  "/:appointmentId/cancel",
  authMiddleware(["user"]),
  appointmentController.cancelAppointment
);
router.patch(
  "/:appointmentId/approve",
  authMiddleware(["staff", "admin"]),
  appointmentController.approveAppointment
);
router.patch(
  "/:appointmentId/complete",
  authMiddleware(["stylist", "admin"]),
  appointmentController.completeAppointment
);
router.patch(
  "/:appointmentId/status",
  authMiddleware(["admin"]),
  appointmentController.updateAppointmentStatus
);
router.patch(
  "/:appointmentId/services",
  authMiddleware(["stylist", "staff", "admin"]),
  appointmentController.updateAppointmentServices
);
router.delete(
  "/:appointmentId",
  authMiddleware(["admin"]),
  appointmentController.deleteAppointment
);

module.exports = router;
