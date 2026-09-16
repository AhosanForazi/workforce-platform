const mongoose = require('mongoose');

// reviews(review_id PK, booking_id FK UNIQUE, customer_id FK, worker_id FK,
// rating CHECK 1-5, comment)
const reviewSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkerProfile', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
