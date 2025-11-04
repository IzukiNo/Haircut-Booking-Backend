const Transaction = require("../models/Transaction");
const Appointment = require("../models/Appointment");

const Service = require("../models/Service");
const User = require("../models/User");

const employeeHelper = require("../helpers/employeeHelper");

const { Types } = require("mongoose");

async function createTransaction(data) {
  try {
    const { appointmentId, cashierId, paymentMethod, note } = data;

    if (
      !Types.ObjectId.isValid(appointmentId) ||
      !Types.ObjectId.isValid(cashierId)
    ) {
      return { status: 400, message: "Invalid ObjectId format" };
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return { status: 404, message: "Appointment not found" };
    }

    if (appointment.transactionId) {
      const existingTransaction = await Transaction.findById(
        appointment.transactionId
      );
      if (existingTransaction) {
        return {
          status: 409,
          message: "Transaction already exists for this appointment",
          data: existingTransaction,
        };
      }
      appointment.transactionId = null;
      await appointment.save();
    }

    if (appointment.status !== "completed") {
      return {
        status: 400,
        message: "Appointment is not completed yet",
      };
    }

    const cashier = await employeeHelper.getEmployeeById("cashier", cashierId);
    if (!cashier) {
      return { status: 404, message: "Cashier not found" };
    }

    const user = await User.findById(appointment.customerId);
    if (!user) {
      return { status: 404, message: "Customer not found" };
    }

    const serviceIds = appointment.serviceId || [];
    const validIds = serviceIds.filter((id) => Types.ObjectId.isValid(id));

    const services = await Service.find(
      { _id: { $in: validIds }, status: true },
      "name price"
    );

    const amount = services.reduce((sum, s) => sum + (s.price || 0), 0);

    const serviceDetails = services.map((s) => ({
      name: s.name,
      price: s.price,
    }));

    const transaction = await Transaction.create({
      appointmentId,
      customerId: user._id,
      cashierId: cashier._id,
      details: {
        customerName: user.username,
        customerId: user._id,
        services: serviceDetails,
      },
      amount,
      paymentMethod,
      note,
    });

    appointment.transactionId = transaction._id;
    await appointment.save();

    return {
      status: 201,
      message: "Transaction created successfully",
      data: transaction,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to create transaction: " + error.message,
    };
  }
}

async function getTransactionById(id) {
  try {
    if (!Types.ObjectId.isValid(id))
      return { status: 400, message: "Invalid transaction ID" };

    const transaction = await Transaction.findById(id)
      .populate("appointmentId", "date time status")
      .populate("customerId", "username email phone")
      .populate("cashierId", "userId branchId");

    if (!transaction) return { status: 404, message: "Transaction not found" };

    return {
      status: 200,
      message: "Transaction fetched successfully",
      data: transaction,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to fetch transaction: " + error.message,
    };
  }
}

async function getAllTransactions({ page = 1, limit = 10, filter = {} } = {}) {
  try {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const totalCount = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const data = await Transaction.find(filter)
      .populate("appointmentId", "date time status")
      .populate("customerId", "username email phone")
      .populate("cashierId", "userId branchId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      status: 200,
      message: "Transactions fetched successfully",
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to fetch transactions: " + error.message,
    };
  }
}

async function updateTransaction(id, updateData) {
  try {
    if (!Types.ObjectId.isValid(id))
      return { status: 400, message: "Invalid transaction ID" };

    const transaction = await Transaction.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    const allowedStatuses = ["pending", "confirmed", "failed", "refunded"];
    if (updateData.status && !allowedStatuses.includes(updateData.status)) {
      return { status: 400, message: "Invalid transaction status" };
    }

    if (!transaction) return { status: 404, message: "Transaction not found" };
    if (updateData.status === "confirmed") {
      const appointment = await Appointment.findById(transaction.appointmentId);
      appointment.isPaid = true;
      await appointment.save();
    }

    return {
      status: 200,
      message: "Transaction updated successfully",
      data: transaction,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to update transaction: " + error.message,
    };
  }
}

async function deleteTransaction(id) {
  try {
    if (!Types.ObjectId.isValid(id))
      return { status: 400, message: "Invalid transaction ID" };

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) return { status: 404, message: "Transaction not found" };

    return {
      status: 200,
      message: "Transaction deleted successfully",
      data: transaction,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to delete transaction: " + error.message,
    };
  }
}

module.exports = {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
};
