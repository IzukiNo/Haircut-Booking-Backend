const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post(
  "/:appointmentId",
  authMiddleware(["user"]),
  reviewController.submitReview
);
router.get(
  "/:type/:id",
  authMiddleware(["admin"]),
  reviewController.getReviewsBy
);
router.get(
  "/recent",
  authMiddleware(["staff", "admin"]),
  reviewController.getRecentReviews
);
router.delete(
  "/:appointmentId",
  authMiddleware(["admin"]),
  reviewController.deleteReview
);

module.exports = router;
