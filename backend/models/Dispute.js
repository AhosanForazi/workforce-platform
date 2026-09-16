const mongoose = require('mongoose');

// disputes(dispute_id PK, booking_id FK, review_id FK nullable, raised_by, reason,
// status ENUM(open, under_review, resolved, rejected), created_at, resolved_at)
const disputeSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    review_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null },
    raised_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'under_review', 'resolved', 'rejected'], default: 'open' },
    resolved_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: true } }
);

module.exports = mongoose.model('Dispute', disputeSchema);
