const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Prisma Unique Constraint Violation (P2002)
  if (err.code === 'P2002') {
    statusCode = 400;
    const target = Array.isArray(err.meta?.target)
      ? err.meta.target.join(', ')
      : String(err.meta?.target || '');
    if (target.includes('phone')) {
      message = 'An account with this phone number already exists. Please use a different phone number or sign in.';
    } else if (target.includes('email')) {
      message = 'An account with this email address already exists. Please sign in.';
    } else {
      message = `Unique constraint failed on: ${target || 'field'}. This value is already in use.`;
    }
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
