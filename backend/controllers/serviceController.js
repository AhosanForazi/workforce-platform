const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { formatService } = require('../utils/formatters');

// @desc Get all services
// @route GET /api/services
const getServices = asyncHandler(async (req, res) => {
  const services = await prisma.service.findMany({
    orderBy: { serviceName: 'asc' },
  });
  res.json(services.map(formatService));
});

// @desc Create a service (admin)
// @route POST /api/services
const createService = asyncHandler(async (req, res) => {
  const { service_name, type, icon, description } = req.body;

  if (!service_name || !type) {
    res.status(400);
    throw new Error('Service name and type are required');
  }

  const exists = await prisma.service.findUnique({
    where: { serviceName: service_name },
  });
  if (exists) {
    res.status(400);
    throw new Error('Service already exists');
  }

  const service = await prisma.service.create({
    data: {
      serviceName: service_name,
      type,
      icon: icon || 'tool',
      description: description || '',
    },
  });

  res.status(201).json(formatService(service));
});

module.exports = { getServices, createService };
