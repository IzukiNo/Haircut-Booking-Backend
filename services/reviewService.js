const Review = require("../models/Review");
const Appointment = require("../models/Appointment");

async function submitReview(customerId, appointmentId, rating, comment = "") {}

async function getReviewsBy(type, id, page = 1, limit = 10, role = []) {}

async function getRecentReviews(page = 1, limit = 10) {}

async function deleteReview(reviewId) {}

module.exports = {
  submitReview,
  getReviewsBy,
  getRecentReviews,
  deleteReview,
};
