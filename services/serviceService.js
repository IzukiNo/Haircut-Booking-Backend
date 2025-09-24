const Service = require("../models/Service");

async function createService(name, description, price, status) {}

async function getAllServices() {}

async function getServiceById(serviceId) {}

async function updateService(serviceId, name, description, price, status) {}

async function deleteService(serviceId) {}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
