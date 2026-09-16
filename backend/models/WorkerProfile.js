const mongoose = require('mongoose');

// worker_profiles(worker_id PK, user_id FK UNIQUE, service_type, experience, rating CHECK 0-5)
const workerProfileSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    service_type: { type: String, required: true },
    experience: { type: String, default: '0-1 years' },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    skills: [{ type: String }],
    completedJobs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
