const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      const { password, ...userWithoutPassword } = user;
      req.user = {
        ...userWithoutPassword,
        _id: user.id,
      };
      return next();
    } catch (err) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  res.status(401);
  throw new Error('Not authorized, no token');
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Role '${req.user ? req.user.role : 'guest'}' is not authorized for this action`);
  }
  next();
};

module.exports = { protect, authorize };
