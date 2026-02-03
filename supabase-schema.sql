-- Zuco Motors Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create all tables

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'dealer', 'sales_agent')),
  phone TEXT,
  employee_id TEXT,
  commission_rate DECIMAL(5,4),
  profile JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ============================================
-- VEHICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  trim TEXT,
  body_style TEXT,
  condition TEXT CHECK (condition IN ('New', 'Certified Pre-Owned', 'Used')),
  mileage INTEGER DEFAULT 0,
  exterior_color TEXT,
  interior_color TEXT,
  specs JSONB DEFAULT '{}',
  pricing JSONB NOT NULL,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Pending')),
  location TEXT,
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  accidents INTEGER DEFAULT 0,
  owners INTEGER DEFAULT 0,
  assigned_agent TEXT,
  added_date TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_id TEXT,
  type TEXT,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  message TEXT,
  offer JSONB,
  communications JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_id TEXT,
  pricing JSONB NOT NULL,
  commission JSONB,
  status TEXT DEFAULT 'pending',
  completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENT ALLOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS agent_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  agent_name TEXT,
  claimed_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'returned')),
  expires_at TIMESTAMPTZ,
  notes TEXT,
  allocated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEST DRIVES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS test_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  agent_id TEXT,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT,
  buyer_phone TEXT,
  scheduled_date DATE,
  scheduled_time TEXT,
  end_time TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENT SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS agent_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  allocation_id UUID REFERENCES agent_allocations(id) ON DELETE SET NULL,
  sale_price DECIMAL(12,2) NOT NULL,
  company_margin DECIMAL(12,2),
  agent_profit DECIMAL(12,2),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  sale_date DATE,
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIEWING BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS viewing_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  agent_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  booking_date DATE,
  booking_time TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUOTE REQUESTS TABLE (Sell Your Car)
-- ============================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_type TEXT CHECK (quote_type IN ('instant', 'agent', 'inspection')),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate TEXT,
  fuel TEXT,
  mileage INTEGER,
  condition TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  notes TEXT,
  images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENT APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS agent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience TEXT,
  location TEXT,
  motivation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FINANCING APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS financing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  employment_status TEXT,
  monthly_income DECIMAL(12,2),
  loan_term INTEGER,
  down_payment DECIMAL(12,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE REALTIME FOR KEY TABLES
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;
ALTER PUBLICATION supabase_realtime ADD TABLE quote_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_allocations;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_sales;
ALTER PUBLICATION supabase_realtime ADD TABLE test_drives;
ALTER PUBLICATION supabase_realtime ADD TABLE viewing_bookings;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_added_date ON vehicles(added_date DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_agent_id ON inquiries(agent_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_agent_allocations_agent_id ON agent_allocations(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_allocations_vehicle_id ON agent_allocations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_agent_sales_agent_id ON agent_sales(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_sales_status ON agent_sales(status);

-- ============================================
-- SEED INITIAL DEALER USERS
-- ============================================
INSERT INTO users (email, password, name, first_name, last_name, role, employee_id, commission_rate) VALUES
  ('zucomotorsnz@gmail.com', 'ZucoPapichulo877!', 'Zuco Motors', 'Zuco', 'Motors', 'dealer', 'ZM-001', 0.05),
  ('cjrutherford1407@gmail.com', 'Poppy2624', 'CJ Rutherford', 'CJ', 'Rutherford', 'dealer', 'ZM-002', 0.03),
  ('meleisealucaa@gmail.com', 'Third6300!!!', 'Luca Meleisea', 'Luca', 'Meleisea', 'dealer', 'ZM-003', 0.03)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- DISABLE ROW LEVEL SECURITY (for development)
-- ============================================
-- This allows all operations without authentication
-- In production, you would enable RLS and add proper policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_allocations DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE viewing_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE financing_applications DISABLE ROW LEVEL SECURITY;
