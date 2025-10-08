const Service = require("../models/Service");

const { Types } = require("mongoose");

async function createService(name, description, price, status = true) {
  try {
    if (price < 0) {
      return {
        status: 400,
        message: "Invalid input parameters",
      };
    }
    const service = new Service({ name, description, price, status });
    const saved = await service.save();
    return {
      status: 201,
      message: "Service created successfully",
      data: saved,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error creating service",
      data: err.message,
    };
  }
}

async function getAllServices() {
  try {
    const services = await Service.find();
    return {
      status: 200,
      message: "Services fetched successfully",
      data: services,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error fetching services",
      data: err.message,
    };
  }
}

async function getServiceById(serviceId) {
  try {
    if (!Types.ObjectId.isValid(serviceId)) {
      return { status: 400, message: "Invalid Service ID", data: null };
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return { status: 404, message: "Service not found", data: null };
    }
    return {
      status: 200,
      message: "Service fetched successfully",
      data: service,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error fetching service",
      data: err.message,
    };
  }
}

async function updateService(serviceId, data) {
  try {
    if (!Types.ObjectId.isValid(serviceId)) {
      return { status: 400, message: "Invalid Service ID", data: null };
    }
    const updated = await Service.findByIdAndUpdate(
      serviceId,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return { status: 404, message: "Service not found", data: null };
    }
    return {
      status: 200,
      message: "Service updated successfully",
      data: updated,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error updating service",
      data: err.message,
    };
  }
}

async function deleteService(serviceId) {
  try {
    if (!Types.ObjectId.isValid(serviceId)) {
      return { status: 400, message: "Invalid Service ID", data: null };
    }
    const deleted = await Service.findByIdAndDelete(serviceId);
    if (!deleted) {
      return { status: 404, message: "Service not found", data: null };
    }
    return {
      status: 200,
      message: "Service deleted successfully",
      data: deleted,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error deleting service",
      data: err.message,
    };
  }
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
