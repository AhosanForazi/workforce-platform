const mongoose = require('mongoose');

// availabilities(availability_id PK, worker_id FK, day_of_week, start_time, end_time CHECK end>start)
const availabilitySchema = new mongoose.Schema(
  {
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkerProfile', required: true },
    day_of_week: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    start_time: { type: String, required: true }, // "09:00"
    end_time: { type: String, required: true }, // "17:00"
  },
  { timestamps: true }
);

availabilitySchema.pre('validate', function (next) {
  if (this.start_time && this.end_time && this.end_time <= this.start_time) {
    return next(new Error('end_time must be after start_time'));
  }
  next();
});

module.exports = mongoose.model('Availability', availabilitySchema);
