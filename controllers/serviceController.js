const serviceService = require("../services/serviceService");

async function createService(req, res) {
  try {
    const { name, description, price, status } = req.body;

    if (!name || price == null) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }

    const result = await serviceService.createService(
      name,
      description,
      price,
      status
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

async function getAllServices(req, res) {
  try {
    const { page, limit } = req.query;
    const result = await serviceService.getAllServices(page, limit);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

async function getServiceById(req, res) {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }

    const result = await serviceService.getServiceById(serviceId);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

async function updateService(req, res) {
  try {
    const { serviceId } = req.params;

    if (!serviceId || !req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }

    const result = await serviceService.updateService(serviceId, req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

async function deleteService(req, res) {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res
        .status(400)
        .json({ status: 400, message: "Tham số đầu vào không hợp lệ" });
    }

    const result = await serviceService.deleteService(serviceId);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
