const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { formatPayment } = require('../utils/formatters');

// @desc Create/record a payment for a booking
// @route POST /api/payments
const createPayment = asyncHandler(async (req, res) => {
  const { booking_id, amount, method } = req.body;

  const booking = await prisma.booking.findUnique({
    where: { id: booking_id },
  });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const existing = await prisma.payment.findUnique({
    where: { bookingId: booking_id },
  });
  if (existing) {
    res.status(400);
    throw new Error('Payment already recorded for this booking');
  }

  const transaction_id = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking_id,
      amount: Number(amount),
      method,
      status: 'paid',
      transactionId: transaction_id,
      paidAt: new Date(),
    },
  });

  res.status(201).json(formatPayment(payment));
});

// @desc Get payment by booking
// @route GET /api/payments/booking/:bookingId
const getPaymentByBooking = asyncHandler(async (req, res) => {
  const payment = await prisma.payment.findUnique({
    where: { bookingId: req.params.bookingId },
  });
  res.json(formatPayment(payment));
});

module.exports = { createPayment, getPaymentByBooking };
