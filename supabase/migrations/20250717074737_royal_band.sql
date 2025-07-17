/*
  # Glass Rental Management System Database Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, unique, not null)
      - `phone` (text, not null)
      - `event_date` (date, not null)
      - `event_location` (text, not null)
      - `event_type` (text, not null)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

    - `glassware`
      - `id` (uuid, primary key)
      - `type` (text, not null)
      - `description` (text, not null)
      - `quantity_available` (integer, not null, default 0)
      - `price_per_unit` (decimal, not null)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

    - `orders`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers)
      - `glassware_id` (uuid, foreign key to glassware)
      - `quantity` (integer, not null)
      - `order_date` (date, not null)
      - `delivery_date` (date, not null)
      - `status` (enum: pending, confirmed, delivered, returned, cancelled)
      - `total_amount` (decimal, not null)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage all data
    - Add policies for read access to support reporting

  3. Indexes
    - Add indexes on foreign keys for better performance
    - Add indexes on frequently queried columns (email, status, dates)

  4. Triggers
    - Add updated_at triggers for automatic timestamp updates
    - Add inventory management triggers for order processing
*/

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered', 'returned', 'cancelled');

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  event_date date NOT NULL,
  event_location text NOT NULL,
  event_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create glassware table
CREATE TABLE IF NOT EXISTS glassware (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  description text NOT NULL,
  quantity_available integer NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
  price_per_unit decimal(10,2) NOT NULL CHECK (price_per_unit > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  glassware_id uuid NOT NULL REFERENCES glassware(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  order_date date NOT NULL,
  delivery_date date NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_event_date ON customers(event_date);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_glassware_id ON orders(glassware_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE glassware ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can manage customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage glassware"
  ON glassware
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_glassware_updated_at
  BEFORE UPDATE ON glassware
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO customers (name, email, phone, event_date, event_location, event_type) VALUES
  ('Sarah Johnson', 'sarah.johnson@email.com', '+1 (555) 123-4567', '2024-02-14', 'Grand Hotel Ballroom', 'Wedding'),
  ('Michael Corporation', 'events@michael-corp.com', '+1 (555) 987-6543', '2024-02-20', 'Corporate Center', 'Corporate Event'),
  ('Emma Davis', 'emma.davis@email.com', '+1 (555) 456-7890', '2024-03-15', 'Garden Venue', 'Birthday Party'),
  ('Robert Wilson', 'robert.wilson@email.com', '+1 (555) 321-0987', '2024-03-22', 'Community Hall', 'Anniversary');

INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
  ('Wine Glass', 'Elegant crystal wine glasses perfect for formal events', 150, 2.50),
  ('Champagne Flute', 'Premium champagne flutes for celebrations', 100, 3.00),
  ('Cocktail Glass', 'Stylish cocktail glasses for mixology events', 75, 2.75),
  ('Beer Mug', 'Classic beer mugs for casual gatherings', 80, 2.00),
  ('Whiskey Glass', 'Premium whiskey glasses for sophisticated events', 60, 3.50),
  ('Martini Glass', 'Elegant martini glasses for upscale occasions', 50, 3.25);

-- Create a view for order details with customer and glassware information
CREATE OR REPLACE VIEW order_details AS
SELECT 
  o.id,
  o.customer_id,
  c.name as customer_name,
  c.email as customer_email,
  c.event_type,
  c.event_date as customer_event_date,
  o.glassware_id,
  g.type as glassware_type,
  g.description as glassware_description,
  g.price_per_unit,
  o.quantity,
  o.order_date,
  o.delivery_date,
  o.status,
  o.total_amount,
  o.created_at,
  o.updated_at
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN glassware g ON o.glassware_id = g.id;

-- Grant access to the view
GRANT SELECT ON order_details TO authenticated;

-- Create function to check inventory before order creation
CREATE OR REPLACE FUNCTION check_inventory_before_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if there's enough inventory
  IF (SELECT quantity_available FROM glassware WHERE id = NEW.glassware_id) < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient inventory. Available: %, Requested: %', 
      (SELECT quantity_available FROM glassware WHERE id = NEW.glassware_id), 
      NEW.quantity;
  END IF;
  
  -- Calculate total amount
  NEW.total_amount = NEW.quantity * (SELECT price_per_unit FROM glassware WHERE id = NEW.glassware_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check inventory before order creation
CREATE TRIGGER check_inventory_before_order_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION check_inventory_before_order();

-- Create function to update inventory when order status changes
CREATE OR REPLACE FUNCTION update_inventory_on_order_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a new order (INSERT) and status is confirmed, reduce inventory
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE glassware 
    SET quantity_available = quantity_available - NEW.quantity 
    WHERE id = NEW.glassware_id;
    
  -- If order status changed from confirmed to cancelled/returned, restore inventory
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'returned') THEN
    UPDATE glassware 
    SET quantity_available = quantity_available + OLD.quantity 
    WHERE id = OLD.glassware_id;
    
  -- If order status changed from other status to confirmed, reduce inventory
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
    UPDATE glassware 
    SET quantity_available = quantity_available - NEW.quantity 
    WHERE id = NEW.glassware_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update inventory on order changes
CREATE TRIGGER update_inventory_on_order_change_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_on_order_change();

-- Create function to restore inventory when order is deleted
CREATE OR REPLACE FUNCTION restore_inventory_on_order_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- If the deleted order was confirmed, restore the inventory
  IF OLD.status = 'confirmed' THEN
    UPDATE glassware 
    SET quantity_available = quantity_available + OLD.quantity 
    WHERE id = OLD.glassware_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to restore inventory when order is deleted
CREATE TRIGGER restore_inventory_on_order_delete_trigger
  AFTER DELETE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION restore_inventory_on_order_delete();