const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { formatWorkerProfile, formatWorkerOffer } = require('../utils/formatters');

// @desc Search / browse workers with filters (location, service, rating, price, keyword)
// @route GET /api/workers?service=&location=&minRating=&q=
const getWorkers = asyncHandler(async (req, res) => {
  const { service, location, minRating, q } = req.query;

  const where = {};
  if (minRating) {
    where.rating = { gte: Number(minRating) };
  }
  if (service) {
    where.serviceType = { contains: service, mode: 'insensitive' };
  }

  let profiles = await prisma.workerProfile.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          avatar: true,
          role: true,
        },
      },
      offers: {
        include: {
          service: true,
        },
      },
    },
    orderBy: { rating: 'desc' },
  });

  if (location) {
    const locLower = location.toLowerCase();
    profiles = profiles.filter((p) => (p.user?.location || '').toLowerCase().includes(locLower));
  }

  if (q) {
    const qLower = q.toLowerCase();
    profiles = profiles.filter(
      (p) =>
        (p.user?.name || '').toLowerCase().includes(qLower) ||
        (p.serviceType || '').toLowerCase().includes(qLower) ||
        (p.bio || '').toLowerCase().includes(qLower)
    );
  }

  res.json(profiles.map(formatWorkerProfile));
});

// @desc Get single worker profile detail
// @route GET /api/workers/:id
const getWorkerById = asyncHandler(async (req, res) => {
  const profile = await prisma.workerProfile.findUnique({
    where: { id: req.params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          avatar: true,
          role: true,
        },
      },
      offers: {
        include: {
          service: true,
        },
      },
      availabilities: true,
    },
  });

  if (!profile) {
    res.status(404);
    throw new Error('Worker profile not found');
  }

  const formattedProfile = formatWorkerProfile(profile);
  res.json({
    profile: formattedProfile,
    offers: formattedProfile.offers || [],
    availability: formattedProfile.availability || [],
  });
});

// @desc Update own worker profile
// @route PUT /api/workers/me
const updateMyWorkerProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    res.status(404);
    throw new Error('Worker profile not found');
  }

  const data = {};
  if (req.body.service_type !== undefined) data.serviceType = req.body.service_type;
  if (req.body.experience !== undefined) data.experience = req.body.experience;
  if (req.body.bio !== undefined) data.bio = req.body.bio;
  if (req.body.skills !== undefined) data.skills = req.body.skills;

  const updated = await prisma.workerProfile.update({
    where: { id: profile.id },
    data,
    include: {
      user: true,
      offers: { include: { service: true } },
    },
  });

  res.json(formatWorkerProfile(updated));
});

// @desc Add/Update a service offer (hourly_rate / fixed_price) for logged-in worker
// @route POST /api/workers/me/offers
const upsertServiceOffer = asyncHandler(async (req, res) => {
  const { service_id, hourly_rate, fixed_price } = req.body;
  const userId = req.user.id || req.user._id;

  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  if (!profile) {
    res.status(404);
    throw new Error('Worker profile not found');
  }

  const service = await prisma.service.findUnique({
    where: { id: service_id },
  });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const offer = await prisma.workerServiceOffer.upsert({
    where: {
      workerId_serviceId: {
        workerId: profile.id,
        serviceId: service.id,
      },
    },
    update: {
      hourlyRate: hourly_rate ? Number(hourly_rate) : null,
      fixedPrice: fixed_price ? Number(fixed_price) : null,
    },
    create: {
      workerId: profile.id,
      serviceId: service.id,
      hourlyRate: hourly_rate ? Number(hourly_rate) : null,
      fixedPrice: fixed_price ? Number(fixed_price) : null,
    },
    include: {
      service: true,
    },
  });

  res.status(201).json(formatWorkerOffer(offer));
});

// @desc Set availability slots for logged-in worker
// @route POST /api/workers/me/availability
const addAvailability = asyncHandler(async (req, res) => {
  const { day_of_week, start_time, end_time } = req.body;
  const userId = req.user.id || req.user._id;

  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  if (!profile) {
    res.status(404);
    throw new Error('Worker profile not found');
  }

  if (start_time && end_time && end_time <= start_time) {
    res.status(400);
    throw new Error('end_time must be after start_time');
  }

  const slot = await prisma.availability.create({
    data: {
      workerId: profile.id,
      dayOfWeek: day_of_week,
      startTime: start_time,
      endTime: end_time,
    },
  });

  res.status(201).json({
    ...slot,
    _id: slot.id,
    day_of_week: slot.dayOfWeek,
    start_time: slot.startTime,
    end_time: slot.endTime,
  });
});

module.exports = {
  getWorkers,
  getWorkerById,
  updateMyWorkerProfile,
  upsertServiceOffer,
  addAvailability,
};
