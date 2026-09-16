const mongoose = require('mongoose');

// bookings(booking_id PK, customer_id FK, worker_id FK, service_id FK, date_time,
// status ENUM(pending, accepted, in_progress, completed, cancelled), accepted_at, started_at,
// completed_at, cancelled_by, cancellation_reason)
const bookingSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkerProfile', required: true },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    date_time: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    address: { type: String, default: '' },
    notes: { type: String, default: '' },
    estimatedCost: { type: Number, default: 0 },
    accepted_at: { type: Date, default: null },
    started_at: { type: Date, default: null },
    completed_at: { type: Date, default: null },
    cancelled_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    cancellation_reason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
