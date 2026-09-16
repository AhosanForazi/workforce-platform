const mongoose = require('mongoose');

// notifications(notification_id PK, user_id FK, type, message, is_read DEFAULT false, sent_at)
const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    sent_at: { type: Date, default: Date.now },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
