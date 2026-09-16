# WorkForce — On-Demand Workforce Management System

A full-stack local worker hiring platform, built from the project's ER diagram (data model)
and concept deck (features, positioning, copy). Customers find, book, and review verified
local workers (electricians, plumbers, painters, carpenters, gardeners, cleaners). Workers
list their services, set availability, and manage incoming jobs.

## Stack
- **Database:** PostgreSQL (Hosted on **Supabase**) with **Prisma ORM**
- **Backend:** Node.js, Express, Prisma Client, JWT auth, bcryptjs
- **Frontend:** React 18 (Vite), Tailwind CSS, Framer Motion, React Router, Axios, react-hot-toast

## Data model
Matches the ER diagram exactly: `users`, `worker_profiles`, `availabilities`, `services`,
`worker_service_offers`, `bookings`, `payments`, `reviews`, `disputes`, `notifications` —
with relational foreign keys, cascade deletes, composite unique keys, and PostgreSQL enums
(`BookingStatus`, `PaymentMethod`, `PaymentStatus`, `DisputeStatus`, `UserRole`, `DayOfWeek`).

## Project structure
```
workforce-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    Prisma PostgreSQL schema (Supabase)
│   │   └── schema.sql       Direct SQL for Supabase SQL Editor
│   ├── config/              Prisma client singleton
│   ├── controllers/         Express controllers (Prisma queries)
│   ├── routes/              Express API routes
│   ├── middleware/          JWT auth & role guards
│   ├── utils/               Token helper, response formatters, seed script
│   └── server.js
├── frontend/                React 18 (Vite)
│   ├── src/                 Components, pages, context, API client
│   └── vercel.json          SPA client routing configuration
├── DEPLOYMENT.md            Complete Supabase + Render + Vercel deployment guide
└── render.yaml              Backend deployment specification for Render
```

## Getting started

### 1. Database (Supabase PostgreSQL)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** -> **Database** and copy your **URI Connection strings**:
   - Connection Pooler (port 6543) -> `DATABASE_URL`
   - Direct connection (port 5432) -> `DIRECT_URL`
3. In `backend/.env`, set both connection strings (see `backend/.env.example`).
4. Apply the schema & seed demo data:
   ```bash
   cd backend
   npm run db:push     # OR paste backend/prisma/schema.sql into Supabase SQL Editor
   npm run seed        # seeds demo services, admin, customer, and 6 verified workers
   ```

### 2. Backend
```bash
cd backend
npm install
npm run dev           # starts on http://localhost:5000
```
Visit `http://localhost:5000/api/health` to verify database connection.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev           # starts on http://localhost:5173
```
Open `http://localhost:5173`.

### 4. Production Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for full step-by-step instructions to deploy:
- **Database:** Supabase
- **Backend API:** Render or Railway
- **Frontend App:** Vercel

**Demo accounts created by the seed script:**
| Role | Email | Password |
|---|---|---|
| Admin | `admin@workforce.app` | `admin123` |
| Customer | `customer@workforce.app` | `customer123` |
| Worker (Electrician) | `karim.electrician@workforce.app` | `worker123` |
| Worker (Plumber) | `jahangir.plumber@workforce.app` | `worker123` |
| Worker (Painter) | `nasrin.painter@workforce.app` | `worker123` |
| Worker (Gardener) | `salma.gardener@workforce.app` | `worker123` |
| Worker (Carpenter) | `rafiq.carpenter@workforce.app` | `worker123` |
| Worker (Cleaner) | `moushumi.cleaner@workforce.app` | `worker123` |
