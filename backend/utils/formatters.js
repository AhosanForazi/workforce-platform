// Formats Prisma model outputs to preserve 100% backward compatibility
// with the existing React frontend expectations (_id, populated relational objects)

const formatUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return {
    ...rest,
    _id: user.id,
  };
};

const formatService = (service) => {
  if (!service) return null;
  return {
    ...service,
    _id: service.id,
  };
};

const formatWorkerOffer = (offer) => {
  if (!offer) return null;
  return {
    ...offer,
    _id: offer.id,
    service_id: offer.service ? formatService(offer.service) : offer.serviceId,
  };
};

const formatWorkerProfile = (profile) => {
  if (!profile) return null;
  const formatted = {
    ...profile,
    _id: profile.id,
    service_type: profile.serviceType,
    ratingCount: profile.ratingCount,
    isVerified: profile.isVerified,
    completedJobs: profile.completedJobs,
    user_id: profile.user ? formatUser(profile.user) : profile.userId,
  };

  if (profile.offers) {
    formatted.offers = profile.offers.map(formatWorkerOffer);
  }
  if (profile.availabilities) {
    formatted.availability = profile.availabilities.map((a) => ({
      ...a,
      _id: a.id,
      day_of_week: a.dayOfWeek,
      start_time: a.startTime,
      end_time: a.endTime,
    }));
  }
  return formatted;
};

const formatBooking = (booking) => {
  if (!booking) return null;
  return {
    ...booking,
    _id: booking.id,
    date_time: booking.dateTime,
    estimatedCost: booking.estimatedCost,
    accepted_at: booking.acceptedAt,
    started_at: booking.startedAt,
    completed_at: booking.completedAt,
    cancelled_by: booking.cancelledBy,
    cancellation_reason: booking.cancellationReason,
    customer_id: booking.customer ? formatUser(booking.customer) : booking.customerId,
    worker_id: booking.worker ? formatWorkerProfile(booking.worker) : booking.workerId,
    service_id: booking.service ? formatService(booking.service) : booking.serviceId,
    payment: booking.payment ? formatPayment(booking.payment) : undefined,
    review: booking.review ? formatReview(booking.review) : undefined,
  };
};

const formatPayment = (payment) => {
  if (!payment) return null;
  return {
    ...payment,
    _id: payment.id,
    booking_id: payment.bookingId,
    transaction_id: payment.transactionId,
    paid_at: payment.paidAt,
  };
};

const formatReview = (review) => {
  if (!review) return null;
  return {
    ...review,
    _id: review.id,
    booking_id: review.bookingId,
    customer_id: review.customer ? formatUser(review.customer) : review.customerId,
    worker_id: review.worker ? formatWorkerProfile(review.worker) : review.workerId,
  };
};

const formatDispute = (dispute) => {
  if (!dispute) return null;
  return {
    ...dispute,
    _id: dispute.id,
    booking_id: dispute.booking ? formatBooking(dispute.booking) : dispute.bookingId,
    review_id: dispute.reviewId,
    raised_by: dispute.user ? formatUser(dispute.user) : dispute.raisedBy,
    resolved_at: dispute.resolvedAt,
  };
};

const formatNotification = (notification) => {
  if (!notification) return null;
  return {
    ...notification,
    _id: notification.id,
    user_id: notification.userId,
    is_read: notification.isRead,
    sent_at: notification.sentAt,
  };
};

module.exports = {
  formatUser,
  formatService,
  formatWorkerOffer,
  formatWorkerProfile,
  formatBooking,
  formatPayment,
  formatReview,
  formatDispute,
  formatNotification,
};
