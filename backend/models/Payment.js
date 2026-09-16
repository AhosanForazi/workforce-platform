const mongoose = require('mongoose');

// payments(payment_id PK, booking_id FK UNIQUE, amount CHECK>=0, method ENUM(cash,card,mobile_banking),
// status ENUM(pending,paid,failed,refunded), transaction_id UNIQUE, paid_at)
const paymentSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['cash', 'card', 'mobile_banking'], required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transaction_id: { type: String, unique: true, sparse: true },
    paid_at: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
