const mongoose = require('mongoose');

// services(service_id PK, service_name UNIQUE, type)
const serviceSchema = new mongoose.Schema(
  {
    service_name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true, trim: true },
    icon: { type: String, default: 'tool' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
