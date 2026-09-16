const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const generateToken = require('../utils/generateToken');
const { formatUser, formatWorkerProfile } = require('../utils/formatters');

// @desc Register new user (customer or worker)
// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, location, service_type } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : null,
      password: hashedPassword,
      role: role === 'worker' ? 'worker' : 'customer',
      location: location ? location.trim() : '',
    },
  });

  if (user.role === 'worker') {
    await prisma.workerProfile.create({
      data: {
        userId: user.id,
        serviceType: service_type || 'General',
        experience: '0-1 years',
      },
    });
  }

  await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'welcome',
      message: `Welcome to WorkForce, ${user.name.split(' ')[0]}! Your account is ready.`,
    },
  });

  res.status(201).json({
    _id: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    token: generateToken(user.id),
  });
});

// @desc Login user
// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || '').toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      avatar: user.avatar,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc Get logged-in user profile
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let workerProfile = null;
  if (user.role === 'worker') {
    workerProfile = await prisma.workerProfile.findUnique({
      where: { userId: user.id },
      include: {
        offers: { include: { service: true } },
        availabilities: true,
      },
    });
  }

  res.json({
    user: formatUser(user),
    workerProfile: formatWorkerProfile(workerProfile),
  });
});

module.exports = { registerUser, loginUser, getMe };
