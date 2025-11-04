const transactionService = require("../services/transactionService");

async function createTransaction(req, res) {
  try {
    const result = await transactionService.createTransaction(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error while creating transaction",
      error: error.message,
    });
  }
}

async function getTransactionById(req, res) {
  try {
    const { id } = req.params;
    const result = await transactionService.getTransactionById(id);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error while fetching transaction",
      error: error.message,
    });
  }
}

async function getAllTransactions(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentMethod,
      cashierId,
    } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (cashierId) filter.cashierId = cashierId;

    const result = await transactionService.getAllTransactions({
      page,
      limit,
      filter,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error while fetching transactions",
      error: error.message,
    });
  }
}

async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const result = await transactionService.updateTransaction(id, req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error while updating transaction",
      error: error.message,
    });
  }
}

async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const result = await transactionService.deleteTransaction(id);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error while deleting transaction",
      error: error.message,
    });
  }
}

module.exports = {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
};
