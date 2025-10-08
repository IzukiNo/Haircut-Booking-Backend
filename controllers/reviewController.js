const reviewService = require("../services/reviewService");

async function submitReview(req, res) {
  try {
    const userId = req.user._id;
    const { appointmentId } = req.params;
    const { rating, comment } = req.body;

    const result = await reviewService.submitReview(
      userId,
      appointmentId,
      rating,
      comment
    );

    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function getReviewsBy(req, res) {
  try {
    const { id } = req.params;
    const type = req.query.type || "all";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userRoles = req.user ? req.user.roles : [];
    const result = await reviewService.getReviewsBy(
      type,
      id,
      page,
      limit,
      userRoles
    );
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function getRecentReviews(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await reviewService.getRecentReviews(page, limit);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    const result = await reviewService.deleteReview(id);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
}

module.exports = {
  submitReview,
  getReviewsBy,
  getRecentReviews,
  deleteReview,
};
