const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { formatUser } = require('../utils/formatters');

// @desc Update own profile
// @route PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;

  const data = {};
  if (req.body.name !== undefined) data.name = req.body.name;
  if (req.body.phone !== undefined) data.phone = req.body.phone;
  if (req.body.location !== undefined) data.location = req.body.location;
  if (req.body.avatar !== undefined) data.avatar = req.body.avatar;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(req.body.password, salt);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  });

  res.json(formatUser(updated));
});

// @desc Get all users (admin)
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(users.map(formatUser));
});

module.exports = { updateMe, getUsers };
