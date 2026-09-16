# Workforce Platform — Supabase PostgreSQL & Deployment Guide

This guide walks you through connecting your Supabase PostgreSQL database, applying the schema, seeding initial demo accounts, and deploying both the backend and frontend to production for free.

---

## Part 1: Setup Supabase PostgreSQL

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Click **"New project"**.
3. Choose a name (e.g. `workforce-platform`), choose a region close to your users, and set a strong **Database Password** (remember this password!).
4. Wait 1–2 minutes for Supabase to provision your PostgreSQL database.

### 2. Copy Your Connection Strings
1. In your Supabase project dashboard, navigate to **Project Settings** (gear icon at bottom left) -> **Database**.
2. Scroll down to the **Connection string** section.
3. Select **URI** (or **Node.js**):
   - **Transaction Pooler (Port 6543)** — Used for application runtime & queries:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **Session / Direct Connection (Port 5432)** — Used for schema migrations:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```
   *(Replace `[YOUR-PASSWORD]` with the actual database password you set).*

### 3. Apply the Database Schema

You have two easy options:

#### Option A: Run `schema.sql` in Supabase SQL Editor (Fastest & Zero Setup)
1. Open your Supabase Dashboard and click **SQL Editor** in the left sidebar.
2. Click **"New query"**.
3. Open [`backend/prisma/schema.sql`](backend/prisma/schema.sql), copy all its contents, and paste into the Supabase SQL Editor.
4. Click **"Run"**.
5. Go to the **Table Editor** on the left menu — you will see all 10 tables created:
   - `users`, `worker_profiles`, `services`, `worker_service_offers`, `availabilities`, `bookings`, `payments`, `reviews`, `disputes`, `notifications`.

#### Option B: Push using Prisma CLI
1. In `backend/.env`, set your Supabase connection strings:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```
2. In your terminal, run:
   ```bash
   cd backend
   npm run db:push
   ```

### 4. Seed the Database with Demo Data
Once the tables exist, populate the demo services, admin account, customer, and 6 verified workers:

```bash
cd backend
npm run seed
```

You will see:
```
Connecting to PostgreSQL database...
Clearing existing data...
Seeding services...
Seeding admin...
Seeding customer...
Seeding workers...
Database seeded successfully with PostgreSQL/Supabase!
```

---

## Part 2: Deploy Backend to Render (Free Web Service)

1. Push your project repository to GitHub.
2. Sign up / log in to [Render](https://render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `workforce-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. Add **Environment Variables** (under "Environment Variables" section):
   - `DATABASE_URL`: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`
   - `DIRECT_URL`: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`
   - `JWT_SECRET`: *(Generate any random string, e.g. 32+ characters)*
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `*` *(or your Vercel frontend URL once deployed)*
   - `NODE_ENV`: `production`
7. Click **Create Web Service**.
8. After deployment completes, copy your backend URL (e.g., `https://workforce-backend.onrender.com`).
9. Test the health endpoint in your browser: `https://workforce-backend.onrender.com/api/health`
   - You should see: `{"status":"ok","database":"connected (Supabase PostgreSQL)","service":"workforce-backend"}`.

---

## Part 3: Deploy Frontend to Vercel (Free Hosting)

1. Sign up / log in to [Vercel](https://vercel.com/).
2. Click **"Add New..."** -> **"Project"** and import your GitHub repository.
3. In the project setup screen:
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" and select `frontend`
4. Expand **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://workforce-backend.onrender.com/api` *(Your Render backend URL followed by `/api`)*
5. Click **Deploy**.
6. Vercel will build and deploy your React app. Client-side routing is handled automatically via `frontend/vercel.json`.
7. Once finished, open your live URL!

---

## Part 4: Demo Credentials

Once seeded, you can log in with:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@workforce.app` | `admin123` |
| **Customer** | `customer@workforce.app` | `customer123` |
| **Worker (Electrician)** | `karim.electrician@workforce.app` | `worker123` |
| **Worker (Plumber)** | `jahangir.plumber@workforce.app` | `worker123` |
| **Worker (Painter)** | `nasrin.painter@workforce.app` | `worker123` |
| **Worker (Gardener)** | `salma.gardener@workforce.app` | `worker123` |
| **Worker (Carpenter)** | `rafiq.carpenter@workforce.app` | `worker123` |
| **Worker (Cleaner)** | `moushumi.cleaner@workforce.app` | `worker123` |

---

## Part 5: Running Locally

### Backend
```bash
cd backend
# Make sure .env has your Supabase DATABASE_URL
npm install
npx prisma generate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.
