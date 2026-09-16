const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { formatNotification } = require('../utils/formatters');

// @desc Get my notifications
// @route GET /api/notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id || req.user._id;
  const notifications = await prisma.notification.findMany({
    where: { userId: currentUserId },
    orderBy: { sentAt: 'desc' },
    take: 50,
  });
  res.json(notifications.map(formatNotification));
});

// @desc Mark notification as read
// @route PUT /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id || req.user._id;
  const notif = await prisma.notification.updateMany({
    where: {
      id: req.params.id,
      userId: currentUserId,
    },
    data: { isRead: true },
  });

  const updated = await prisma.notification.findUnique({
    where: { id: req.params.id },
  });
  res.json(formatNotification(updated));
});

// @desc Mark all as read
// @route PUT /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id || req.user._id;
  await prisma.notification.updateMany({
    where: {
      userId: currentUserId,
      isRead: false,
    },
    data: { isRead: true },
  });
  res.json({ success: true });
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
