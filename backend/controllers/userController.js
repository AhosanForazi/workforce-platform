const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { formatUser } = require('../utils/formatters');
const { deleteAvatarFile } = require('../middleware/uploadMiddleware');

// @desc Update own profile
// @route PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;

  const data = {};
  if (req.body.name !== undefined) data.name = req.body.name;
  if (req.body.phone !== undefined) data.phone = req.body.phone;
  if (req.body.location !== undefined) data.location = req.body.location;
  if (req.body.avatar !== undefined) {
    data.avatar = req.body.avatar;
    const current = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });
    if (current?.avatar && current.avatar !== req.body.avatar) {
      deleteAvatarFile(current.avatar);
    }
  }
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

// @desc Upload or update user avatar
// @route POST /api/users/me/avatar
const uploadUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;

  let newAvatarUrl = '';
  if (req.file) {
    newAvatarUrl = `/uploads/avatars/${req.file.filename}`;
  } else if (req.body.avatar_url || req.body.avatar || req.body.profileImage || req.body.image) {
    newAvatarUrl = (req.body.avatar_url || req.body.avatar || req.body.profileImage || req.body.image).trim();
  }

  if (!newAvatarUrl) {
    res.status(400);
    throw new Error('Please provide an image file or image URL');
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });

  if (currentUser?.avatar && currentUser.avatar !== newAvatarUrl) {
    deleteAvatarFile(currentUser.avatar);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: newAvatarUrl },
  });

  res.json({
    success: true,
    message: 'Profile image updated successfully',
    avatar: updatedUser.avatar,
    profileImage: updatedUser.avatar,
    user: formatUser(updatedUser),
  });
});

// @desc Delete / remove user avatar
// @route DELETE /api/users/me/avatar
const deleteUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });

  if (currentUser?.avatar) {
    deleteAvatarFile(currentUser.avatar);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: '' },
  });

  res.json({
    success: true,
    message: 'Profile image removed successfully',
    avatar: '',
    profileImage: '',
    user: formatUser(updatedUser),
  });
});

// @desc Get all users (admin)
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(users.map(formatUser));
});

module.exports = { updateMe, uploadUserAvatar, deleteUserAvatar, getUsers };
