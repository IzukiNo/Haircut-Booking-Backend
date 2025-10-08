const Review = require("../models/Review");
const Appointment = require("../models/Appointment");

const { Types } = require("mongoose");

async function submitReview(customerId, appointmentId, rating, comment = "") {
  try {
    if (!customerId || !appointmentId || !rating) {
      return {
        status: 400,
        message: "Missing Parameters",
        data: null,
      };
    }

    if (!Types.ObjectId.isValid(customerId)) {
      return {
        status: 400,
        message: "Invalid Customer ID",
        data: null,
      };
    }

    if (!Types.ObjectId.isValid(appointmentId)) {
      return {
        status: 400,
        message: "Invalid Appointment ID",
        data: null,
      };
    }

    if (rating < 1 || rating > 5) {
      return {
        status: 400,
        message: "Rating must be between 1 and 5",
        data: null,
      };
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return {
        status: 404,
        message: "Appointment not found",
        data: null,
      };
    }

    if (appointment.status !== "completed") {
      return {
        status: 400,
        message: "Only completed appointments can be reviewed",
        data: null,
      };
    }

    const existingReview = await Review.findOne({ customerId, appointmentId });
    if (existingReview) {
      return {
        status: 403,
        message: "You have already reviewed this appointment",
        data: null,
      };
    }

    const review = await Review.create({
      customerId,
      appointmentId,
      rating,
      comment,
    });

    await review.populate([
      { path: "customerId", select: "name email" },
      { path: "appointmentId", select: "date time status" },
    ]);

    return {
      status: 201,
      message: "Review submitted successfully",
      data: review,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to submit review: " + error.message,
      data: null,
    };
  }
}

async function getReviewsBy(type, id, page = 1, limit = 10, userRoles = []) {
  try {
    const canViewSpecific =
      type === "service" || type === "stylist" || type === "branch";
    const isUserAllowed =
      !canViewSpecific ||
      userRoles.includes("user") ||
      userRoles.includes("admin");

    if (!isUserAllowed) {
      return {
        status: 403,
        message: "Permission denied",
        data: null,
      };
    }

    let matchAppointment = {};
    if (type === "service")
      matchAppointment.serviceId = mongoose.Types.ObjectId(id);
    else if (type === "stylist")
      matchAppointment.stylistId = mongoose.Types.ObjectId(id);
    else if (type === "branch")
      matchAppointment.branchId = mongoose.Types.ObjectId(id);

    const aggregatePipeline = [
      {
        $lookup: {
          from: "appointments",
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointment",
        },
      },
      { $unwind: "$appointment" },
    ];

    if (type !== "all") {
      aggregatePipeline.push({ $match: matchAppointment });
    }

    aggregatePipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          customer: { username: 1, email: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    const reviews = await Review.aggregate(aggregatePipeline);

    const countPipeline = [...aggregatePipeline];
    countPipeline.push({ $count: "total" });
    const totalCountResult = await Review.aggregate(countPipeline);
    const totalCount = totalCountResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      message: "Reviews fetched successfully",
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
}

async function getRecentReviews(page = 1, limit = 10) {
  try {
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));

    const reviews = await Review.find()
      .populate("customerId", "name email")
      .populate("appointmentId", "date time status")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Review.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      message: "Recent reviews retrieved successfully",
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to get recent reviews: " + error.message,
      data: null,
    };
  }
}

async function deleteReview(reviewId) {
  try {
    if (!reviewId) {
      return {
        status: 400,
        message: "Missing reviewId parameter",
        data: null,
      };
    }

    if (!Types.ObjectId.isValid(reviewId)) {
      return {
        status: 400,
        message: "Invalid Review ID",
        data: null,
      };
    }

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return {
        status: 404,
        message: "Review not found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Review deleted successfully",
      data: review,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to delete review: " + error.message,
      data: null,
    };
  }
}

module.exports = {
  submitReview,
  getReviewsBy,
  getRecentReviews,
  deleteReview,
};
