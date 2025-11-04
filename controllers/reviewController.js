const reviewService = require("../services/reviewService");

async function submitReview(req, res) {
  try {
    const { appointmentId } = req.params;
    const { rating, comment } = req.body;

    const result = await reviewService.submitReview(
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
    const { type, id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const rating = req.query.rating ? parseInt(req.query.rating) : null;

    const result = await reviewService.getReviewsBy(
      type,
      id,
      page,
      limit,
      rating
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
