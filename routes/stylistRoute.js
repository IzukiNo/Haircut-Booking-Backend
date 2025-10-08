const router = require("express").Router();
const stylistController = require("../controllers/stylistController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/",
  authMiddleware(["staff", "admin"]),
  stylistController.createStylist
);
router.get(
  "/:userId",
  authMiddleware(["user"]),
  stylistController.getStylistById
);
router.get("/", authMiddleware(["user"]), stylistController.getAllStylists);
router.patch(
  "/:userId",
  authMiddleware(["staff", "admin"]),
  stylistController.updateStylist
);
router.delete(
  "/:userId",
  authMiddleware(["staff", "admin"]),
  stylistController.deleteStylist
);

module.exports = router;
