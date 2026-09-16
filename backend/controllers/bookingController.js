const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { formatBooking } = require('../utils/formatters');

// @desc Create a booking (customer books a worker for a service)
// @route POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { worker_id, service_id, date_time, address, notes, estimatedCost } = req.body;
  const customerId = req.user.id || req.user._id;

  if (!worker_id || !service_id || !date_time) {
    res.status(400);
    throw new Error('worker_id, service_id and date_time are required');
  }

  const workerProfile = await prisma.workerProfile.findUnique({
    where: { id: worker_id },
  });
  if (!workerProfile) {
    res.status(404);
    throw new Error('Worker not found');
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      workerId: worker_id,
      serviceId: service_id,
      dateTime: new Date(date_time),
      address: address || '',
      notes: notes || '',
      estimatedCost: estimatedCost ? Number(estimatedCost) : 0,
      status: 'pending',
    },
    include: {
      service: true,
      customer: true,
      worker: { include: { user: true } },
    },
  });

  await prisma.notification.create({
    data: {
      userId: workerProfile.userId,
      type: 'booking_request',
      message: `New booking request from ${req.user.name} for ${new Date(date_time).toLocaleString()}`,
      link: `/bookings/${booking.id}`,
    },
  });

  res.status(201).json(formatBooking(booking));
});

// @desc Get bookings for logged-in user (as customer or worker)
// @route GET /api/bookings/my
const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  let bookings = [];

  if (req.user.role === 'worker') {
    const profile = await prisma.workerProfile.findUnique({
      where: { userId },
    });
    if (profile) {
      bookings = await prisma.booking.findMany({
        where: { workerId: profile.id },
        include: {
          customer: {
            select: { id: true, name: true, phone: true, location: true, avatar: true },
          },
          service: true,
          payment: true,
          review: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }
  } else {
    bookings = await prisma.booking.findMany({
      where: { customerId: userId },
      include: {
        worker: {
          include: {
            user: {
              select: { id: true, name: true, phone: true, location: true, avatar: true },
            },
          },
        },
        service: true,
        payment: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  res.json(bookings.map(formatBooking));
});

// @desc Update booking status (accept, start, complete, cancel)
// @route PUT /api/bookings/:id/status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, cancellation_reason } = req.body;
  const currentUserId = req.user.id || req.user._id;
  const validTransitions = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];

  if (!validTransitions.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: { worker: true },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const data = { status };
  if (status === 'accepted') data.acceptedAt = new Date();
  if (status === 'in_progress') data.startedAt = new Date();
  if (status === 'completed') {
    data.completedAt = new Date();
    await prisma.workerProfile.update({
      where: { id: booking.workerId },
      data: { completedJobs: { increment: 1 } },
    });
  }
  if (status === 'cancelled') {
    data.cancelledBy = currentUserId;
    data.cancellationReason = cancellation_reason || '';
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: req.params.id },
    data,
    include: {
      customer: true,
      worker: { include: { user: true } },
      service: true,
    },
  });

  // Notify the counterpart
  const notifyUserId =
    currentUserId === booking.customerId
      ? booking.worker?.userId
      : booking.customerId;

  if (notifyUserId) {
    await prisma.notification.create({
      data: {
        userId: notifyUserId,
        type: 'booking_update',
        message: `Booking status updated to "${status.replace('_', ' ')}"`,
        link: `/bookings/${booking.id}`,
      },
    });
  }

  res.json(formatBooking(updatedBooking));
});

module.exports = { createBooking, getMyBookings, updateBookingStatus };
