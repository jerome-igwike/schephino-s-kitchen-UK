-- Initial Database Schema for Schephino's Kitchen
-- Run this migration to set up the database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  dietary TEXT[],
  price_range_label TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  seasonal BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  items TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  uba_ref TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Order Items Table (normalized order items)
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id VARCHAR NOT NULL,
  menu_item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Payment Info Table
CREATE TABLE IF NOT EXISTS payment_info (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'gbp',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  label TEXT,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  permissions TEXT[] NOT NULL DEFAULT ARRAY['orders:read', 'orders:update', 'menu:read', 'menu:write'],
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Dispatch Audit Log Table
CREATE TABLE IF NOT EXISTS dispatch_audit (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  admin_id VARCHAR NOT NULL REFERENCES users(id),
  uba_ref TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tracking Sequence Table (for generating unique tracking IDs)
CREATE TABLE IF NOT EXISTS tracking_sequence (
  id VARCHAR PRIMARY KEY DEFAULT 'default',
  date TEXT NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for payment_info
DROP TRIGGER IF EXISTS update_payment_info_updated_at ON payment_info;
CREATE TRIGGER update_payment_info_updated_at
  BEFORE UPDATE ON payment_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Supabase RLS Policies (Row Level Security)
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_audit ENABLE ROW LEVEL SECURITY;

-- Public read access for menu items
CREATE POLICY "Menu items are viewable by everyone" 
  ON menu_items FOR SELECT 
  USING (true);

-- Admin-only write access for menu items
CREATE POLICY "Menu items are insertable by admins only" 
  ON menu_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Menu items are updatable by admins only" 
  ON menu_items FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Menu items are deletable by admins only" 
  ON menu_items FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Orders policies: users can read their own orders, admins can read all
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (
    customer_email = auth.email() OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Anyone can create orders (guest checkout)
CREATE POLICY "Anyone can create orders" 
  ON orders FOR INSERT 
  WITH CHECK (true);

-- Only admins can update orders
CREATE POLICY "Only admins can update orders" 
  ON orders FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Only admins can access admin_users table
CREATE POLICY "Only admins can access admin_users" 
  ON admin_users FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Only admins can access dispatch_audit
CREATE POLICY "Only admins can access dispatch_audit" 
  ON dispatch_audit FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );
