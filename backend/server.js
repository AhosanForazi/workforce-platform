const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const prisma = require('./config/prisma');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL && process.env.CLIENT_URL !== '*'
    ? process.env.CLIENT_URL.split(',').map(s => s.trim())
    : true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Workforce Management System API',
    status: 'active',
    healthCheck: '/api/health',
    version: '1.0.0',
  });
});

// Health check with database connectivity info
const healthHandler = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      database: 'connected (Supabase PostgreSQL)',
      service: 'workforce-backend',
    });
  } catch (err) {
    res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      error: err.message,
    });
  }
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// API route mappings (supports both /api/<resource> and /<resource> fallback)
const routeList = [
  ['auth', require('./routes/auth')],
  ['users', require('./routes/users')],
  ['services', require('./routes/services')],
  ['workers', require('./routes/workers')],
  ['bookings', require('./routes/bookings')],
  ['payments', require('./routes/payments')],
  ['reviews', require('./routes/reviews')],
  ['disputes', require('./routes/disputes')],
  ['notifications', require('./routes/notifications')],
];

routeList.forEach(([resource, router]) => {
  app.use(`/api/${resource}`, router);
  app.use(`/${resource}`, router);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL database connected via Prisma (Supabase)');
  } catch (err) {
    console.warn(`Database connection warning: ${err.message}`);
    console.warn('Ensure your DATABASE_URL in .env is configured with your Supabase credentials.');
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
