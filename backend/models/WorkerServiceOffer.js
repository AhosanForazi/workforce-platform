const mongoose = require('mongoose');

// worker_service_offers(worker_id FK, service_id FK, hourly_rate, fixed_price) composite PK
const workerServiceOfferSchema = new mongoose.Schema(
  {
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkerProfile', required: true },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    hourly_rate: { type: Number, default: null },
    fixed_price: { type: Number, default: null },
  },
  { timestamps: true }
);

workerServiceOfferSchema.index({ worker_id: 1, service_id: 1 }, { unique: true });

module.exports = mongoose.model('WorkerServiceOffer', workerServiceOfferSchema);
