-- Workforce Platform PostgreSQL Schema for Supabase
-- Can be pasted directly into Supabase Dashboard -> SQL Editor

-- 1. Create ENUM types safely
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('customer', 'worker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "BookingStatus" AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'card', 'mobile_banking');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DisputeStatus" AS ENUM ('open', 'under_review', 'resolved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'customer',
    "location" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Worker Profiles
CREATE TABLE IF NOT EXISTS "worker_profiles" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "user_id" TEXT UNIQUE NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "service_type" TEXT NOT NULL,
    "experience" TEXT NOT NULL DEFAULT '0-1 years',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT NOT NULL DEFAULT '',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "skills" TEXT[] NOT NULL DEFAULT '{}',
    "completed_jobs" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Services
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "service_name" TEXT UNIQUE NOT NULL,
    "type" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'tool',
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Worker Service Offers
CREATE TABLE IF NOT EXISTS "worker_service_offers" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "worker_id" TEXT NOT NULL REFERENCES "worker_profiles"("id") ON DELETE CASCADE,
    "service_id" TEXT NOT NULL REFERENCES "services"("id") ON DELETE CASCADE,
    "hourly_rate" DOUBLE PRECISION,
    "fixed_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "worker_service_offers_unique" UNIQUE ("worker_id", "service_id")
);

-- 6. Availabilities
CREATE TABLE IF NOT EXISTS "availabilities" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "worker_id" TEXT NOT NULL REFERENCES "worker_profiles"("id") ON DELETE CASCADE,
    "day_of_week" "DayOfWeek" NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bookings
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "customer_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "worker_id" TEXT NOT NULL REFERENCES "worker_profiles"("id") ON DELETE CASCADE,
    "service_id" TEXT NOT NULL REFERENCES "services"("id") ON DELETE CASCADE,
    "date_time" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "address" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "estimated_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accepted_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_by" TEXT REFERENCES "users"("id") ON DELETE SET NULL,
    "cancellation_reason" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payments
CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "booking_id" TEXT UNIQUE NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "transaction_id" TEXT UNIQUE,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Reviews
CREATE TABLE IF NOT EXISTS "reviews" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "booking_id" TEXT UNIQUE NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "customer_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "worker_id" TEXT NOT NULL REFERENCES "worker_profiles"("id") ON DELETE CASCADE,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Disputes
CREATE TABLE IF NOT EXISTS "disputes" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "booking_id" TEXT NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "review_id" TEXT REFERENCES "reviews"("id") ON DELETE SET NULL,
    "raised_by" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "reason" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'open',
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "link" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
