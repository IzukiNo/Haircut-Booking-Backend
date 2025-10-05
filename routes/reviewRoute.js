const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/", authMiddleware(["user"]), reviewController.submitReview);
router.get("/:id", authMiddleware(["user"]), reviewController.getReviewsBy);
router.get(
  "/recent",
  authMiddleware(["staff", "admin"]),
  reviewController.getRecentReviews
);
router.delete("/:id", authMiddleware(["admin"]), reviewController.deleteReview);
