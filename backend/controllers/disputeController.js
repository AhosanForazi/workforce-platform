const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { formatDispute } = require('../utils/formatters');

// @desc Raise a dispute on a booking
// @route POST /api/disputes
const createDispute = asyncHandler(async (req, res) => {
  const { booking_id, review_id, reason } = req.body;
  const currentUserId = req.user.id || req.user._id;

  if (!booking_id || !reason) {
    res.status(400);
    throw new Error('booking_id and reason are required');
  }

  const dispute = await prisma.dispute.create({
    data: {
      bookingId: booking_id,
      reviewId: review_id || null,
      raisedBy: currentUserId,
      reason,
      status: 'open',
    },
    include: {
      booking: true,
      user: true,
    },
  });

  res.status(201).json(formatDispute(dispute));
});

// @desc Get my disputes
// @route GET /api/disputes/my
const getMyDisputes = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id || req.user._id;
  const disputes = await prisma.dispute.findMany({
    where: { raisedBy: currentUserId },
    include: {
      booking: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(disputes.map(formatDispute));
});

// @desc Update dispute status (admin)
// @route PUT /api/disputes/:id
const updateDispute = asyncHandler(async (req, res) => {
  const dispute = await prisma.dispute.findUnique({
    where: { id: req.params.id },
  });
  if (!dispute) {
    res.status(404);
    throw new Error('Dispute not found');
  }

  const data = {};
  if (req.body.status) {
    data.status = req.body.status;
    if (['resolved', 'rejected'].includes(req.body.status)) {
      data.resolvedAt = new Date();
    }
  }

  const updated = await prisma.dispute.update({
    where: { id: req.params.id },
    data,
    include: {
      booking: true,
      user: true,
    },
  });

  res.json(formatDispute(updated));
});

module.exports = { createDispute, getMyDisputes, updateDispute };
