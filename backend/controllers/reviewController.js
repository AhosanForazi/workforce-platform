const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { formatReview } = require('../utils/formatters');

// @desc Create a review for a completed booking
// @route POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { booking_id, rating, comment } = req.body;
  const customerId = req.user.id || req.user._id;

  const booking = await prisma.booking.findUnique({
    where: { id: booking_id },
  });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.status !== 'completed') {
    res.status(400);
    throw new Error('You can only review completed bookings');
  }

  const existing = await prisma.review.findUnique({
    where: { bookingId: booking_id },
  });
  if (existing) {
    res.status(400);
    throw new Error('This booking has already been reviewed');
  }

  const ratingNum = Number(rating);
  const review = await prisma.review.create({
    data: {
      bookingId: booking_id,
      customerId,
      workerId: booking.workerId,
      rating: ratingNum,
      comment: comment || '',
    },
    include: {
      customer: { select: { id: true, name: true, avatar: true } },
    },
  });

  const profile = await prisma.workerProfile.findUnique({
    where: { id: booking.workerId },
  });
  if (profile) {
    const newCount = profile.ratingCount + 1;
    const newAvg = (profile.rating * profile.ratingCount + ratingNum) / newCount;
    await prisma.workerProfile.update({
      where: { id: profile.id },
      data: {
        rating: Math.round(newAvg * 100) / 100,
        ratingCount: newCount,
      },
    });
  }

  res.status(201).json(formatReview(review));
});

// @desc Get reviews for a worker
// @route GET /api/reviews/worker/:workerId
const getWorkerReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { workerId: req.params.workerId },
    include: {
      customer: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews.map(formatReview));
});

module.exports = { createReview, getWorkerReviews };
