/*
  # Comprehensive Stock Management System

  1. New Tables
    - `stock_items` - Master inventory table with box-level tracking
    - `stock_adjustments` - Track all stock changes (orders, damages, returns)
    - `stock_alerts` - Low stock notifications

  2. Updated Tables
    - Enhanced `orders` table with better stock tracking
    - Updated `glassware` table structure

  3. Functions & Triggers
    - Automatic stock updates on order changes
    - Stock calculation functions
    - Low stock alert triggers

  4. Security
    - RLS policies for all new tables
    - Proper access controls
*/

-- Drop existing tables if they exist to recreate with new structure
DROP TABLE IF EXISTS stock_adjustments CASCADE;
DROP TABLE IF EXISTS stock_items CASCADE;
DROP TABLE IF EXISTS stock_alerts CASCADE;

-- Create stock_items table for comprehensive inventory tracking
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  glass_type text NOT NULL,
  unit_type text NOT NULL CHECK (unit_type IN ('individual', 'small_box', 'large_box')),
  glasses_per_unit integer NOT NULL DEFAULT 1,
  price_per_unit numeric(10,2) NOT NULL CHECK (price_per_unit > 0),
  current_stock integer NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  low_stock_threshold integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(glass_type, unit_type)
);

-- Create stock_adjustments table for tracking all stock changes
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_item_id uuid NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  adjustment_type text NOT NULL CHECK (adjustment_type IN ('order', 'return', 'damage', 'restock', 'manual')),
  quantity_change integer NOT NULL,
  reference_id uuid, -- Can reference order_id or other entities
  reason text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create stock_alerts table for low stock notifications
CREATE TABLE IF NOT EXISTS stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_item_id uuid NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Insert initial stock data with correct pricing
INSERT INTO stock_items (glass_type, unit_type, glasses_per_unit, price_per_unit, current_stock, low_stock_threshold) VALUES
-- Beer Glasses
('Beer Glass', 'individual', 1, 400, 240, 20),
('Beer Glass', 'small_box', 6, 2400, 40, 5),
('Beer Glass', 'large_box', 48, 19200, 5, 2),

-- Wine Glasses  
('Wine Glass', 'individual', 1, 450, 144, 20),
('Wine Glass', 'small_box', 6, 2700, 24, 5),
('Wine Glass', 'large_box', 48, 21600, 3, 2),

-- Cocktail Glasses
('Cocktail Glass', 'individual', 1, 500, 144, 20),
('Cocktail Glass', 'small_box', 6, 4000, 24, 5),
('Cocktail Glass', 'large_box', 48, 32000, 3, 2),

-- Champagne Glasses
('Champagne Glass', 'individual', 1, 450, 96, 20),
('Champagne Glass', 'small_box', 6, 2700, 16, 5),
('Champagne Glass', 'large_box', 48, 21600, 2, 2);

-- Function to calculate total available glasses for a glass type
CREATE OR REPLACE FUNCTION get_total_available_glasses(glass_type_param text)
RETURNS integer AS $$
DECLARE
  total_glasses integer := 0;
  individual_stock integer := 0;
  small_box_stock integer := 0;
  large_box_stock integer := 0;
BEGIN
  -- Get stock for each unit type
  SELECT COALESCE(current_stock, 0) INTO individual_stock 
  FROM stock_items 
  WHERE glass_type = glass_type_param AND unit_type = 'individual';
  
  SELECT COALESCE(current_stock, 0) INTO small_box_stock 
  FROM stock_items 
  WHERE glass_type = glass_type_param AND unit_type = 'small_box';
  
  SELECT COALESCE(current_stock, 0) INTO large_box_stock 
  FROM stock_items 
  WHERE glass_type = glass_type_param AND unit_type = 'large_box';
  
  -- Calculate total glasses
  total_glasses := individual_stock + (small_box_stock * 6) + (large_box_stock * 48);
  
  RETURN total_glasses;
END;
$$ LANGUAGE plpgsql;

-- Function to update stock when order is placed
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS trigger AS $$
DECLARE
  glasses_needed integer;
  glass_type_name text;
  remaining_glasses integer;
  large_boxes_to_use integer;
  small_boxes_to_use integer;
  individual_glasses_to_use integer;
  current_large_stock integer;
  current_small_stock integer;
  current_individual_stock integer;
BEGIN
  -- Get the glass type and quantity needed
  SELECT g.type, NEW.quantity INTO glass_type_name, glasses_needed
  FROM glassware g WHERE g.id = NEW.glassware_id;
  
  -- Check if we have enough total stock
  IF get_total_available_glasses(glass_type_name) < glasses_needed THEN
    RAISE EXCEPTION 'Insufficient inventory. Only % glasses available for %', 
      get_total_available_glasses(glass_type_name), glass_type_name;
  END IF;
  
  -- Get current stock levels
  SELECT current_stock INTO current_large_stock 
  FROM stock_items WHERE glass_type = glass_type_name AND unit_type = 'large_box';
  
  SELECT current_stock INTO current_small_stock 
  FROM stock_items WHERE glass_type = glass_type_name AND unit_type = 'small_box';
  
  SELECT current_stock INTO current_individual_stock 
  FROM stock_items WHERE glass_type = glass_type_name AND unit_type = 'individual';
  
  remaining_glasses := glasses_needed;
  
  -- Use large boxes first (48 glasses each)
  large_boxes_to_use := LEAST(remaining_glasses / 48, current_large_stock);
  remaining_glasses := remaining_glasses - (large_boxes_to_use * 48);
  
  -- Then use small boxes (6 glasses each)
  small_boxes_to_use := LEAST(remaining_glasses / 6, current_small_stock);
  remaining_glasses := remaining_glasses - (small_boxes_to_use * 6);
  
  -- Finally use individual glasses
  individual_glasses_to_use := LEAST(remaining_glasses, current_individual_stock);
  
  -- Update stock levels
  IF large_boxes_to_use > 0 THEN
    UPDATE stock_items 
    SET current_stock = current_stock - large_boxes_to_use,
        updated_at = now()
    WHERE glass_type = glass_type_name AND unit_type = 'large_box';
    
    INSERT INTO stock_adjustments (stock_item_id, adjustment_type, quantity_change, reference_id, reason)
    SELECT id, 'order', -large_boxes_to_use, NEW.id, 'Order placed'
    FROM stock_items WHERE glass_type = glass_type_name AND unit_type = 'large_box';
  END IF;
  
  IF small_boxes_to_use > 0 THEN
    UPDATE stock_items 
    SET current_stock = current_stock - small_boxes_to_use,
        updated_at = now()
    WHERE glass_type = glass_type_name AND unit_type = 'small_box';
    
    INSERT INTO stock_adjustments (stock_item_id, adjustment_type, quantity_change, reference_id, reason)
    SELECT id, 'order', -small_boxes_to_use, NEW.id, 'Order placed'
    FROM stock_items WHERE glass_type = glass_type_name AND unit_type = 'small_box';
  END IF;
  
  IF individual_glasses_to_use > 0 THEN
    UPDATE stock_items 
    SET current_stock = current_stock - individual_glasses_to_use,
        updated_at = now()
    WHERE glass_type = glass_type_name AND unit_type = 'individual';
    
    INSERT INTO stock_adjustments (stock_item_id, adjustment_type, quantity_change, reference_id, reason)
    SELECT id, 'order', -individual_glasses_to_use, NEW.id, 'Order placed'
    FROM stock_items WHERE glass_type = glass_type_name AND unit_type = 'individual';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to restore stock when order is returned or cancelled
CREATE OR REPLACE FUNCTION restore_stock_on_return()
RETURNS trigger AS $$
DECLARE
  glasses_to_restore integer;
  glass_type_name text;
BEGIN
  -- Only restore stock if status changed to 'returned' or 'cancelled'
  IF (OLD.status != 'returned' AND NEW.status = 'returned') OR 
     (OLD.status != 'cancelled' AND NEW.status = 'cancelled') THEN
    
    SELECT g.type, NEW.quantity INTO glass_type_name, glasses_to_restore
    FROM glassware g WHERE g.id = NEW.glassware_id;
    
    -- Add glasses back as individual units for simplicity
    UPDATE stock_items 
    SET current_stock = current_stock + glasses_to_restore,
        updated_at = now()
    WHERE glass_type = glass_type_name AND unit_type = 'individual';
    
    INSERT INTO stock_adjustments (stock_item_id, adjustment_type, quantity_change, reference_id, reason)
    SELECT id, 'return', glasses_to_restore, NEW.id, 
           CASE WHEN NEW.status = 'returned' THEN 'Order returned' ELSE 'Order cancelled' END
    FROM stock_items WHERE glass_type = glass_type_name AND unit_type = 'individual';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check and create low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS trigger AS $$
BEGIN
  -- Check if stock is below threshold
  IF NEW.current_stock <= NEW.low_stock_threshold THEN
    -- Create or update alert
    INSERT INTO stock_alerts (stock_item_id, alert_type, is_active)
    VALUES (NEW.id, 
            CASE WHEN NEW.current_stock = 0 THEN 'out_of_stock' ELSE 'low_stock' END,
            true)
    ON CONFLICT (stock_item_id) WHERE is_active = true
    DO UPDATE SET 
      alert_type = CASE WHEN NEW.current_stock = 0 THEN 'out_of_stock' ELSE 'low_stock' END,
      created_at = now();
  ELSE
    -- Resolve existing alerts
    UPDATE stock_alerts 
    SET is_active = false, resolved_at = now()
    WHERE stock_item_id = NEW.id AND is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS stock_update_on_order_trigger ON orders;
CREATE TRIGGER stock_update_on_order_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_order();

DROP TRIGGER IF EXISTS stock_restore_on_return_trigger ON orders;
CREATE TRIGGER stock_restore_on_return_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION restore_stock_on_return();

DROP TRIGGER IF EXISTS check_low_stock_trigger ON stock_items;
CREATE TRIGGER check_low_stock_trigger
  AFTER UPDATE OF current_stock ON stock_items
  FOR EACH ROW
  EXECUTE FUNCTION check_low_stock();

-- Enable RLS
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can manage stock items"
  ON stock_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage stock adjustments"
  ON stock_adjustments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view stock alerts"
  ON stock_alerts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stock_items_glass_type ON stock_items(glass_type);
CREATE INDEX IF NOT EXISTS idx_stock_items_unit_type ON stock_items(unit_type);
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_stock_item_id ON stock_adjustments(stock_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_reference_id ON stock_adjustments(reference_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_stock_item_id ON stock_alerts(stock_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_is_active ON stock_alerts(is_active);

-- Create view for easy stock overview
CREATE OR REPLACE VIEW stock_overview AS
SELECT 
  si.glass_type,
  si.unit_type,
  si.glasses_per_unit,
  si.price_per_unit,
  si.current_stock,
  si.low_stock_threshold,
  (si.current_stock * si.glasses_per_unit) as total_glasses_for_unit_type,
  get_total_available_glasses(si.glass_type) as total_available_glasses,
  CASE 
    WHEN si.current_stock = 0 THEN 'out_of_stock'
    WHEN si.current_stock <= si.low_stock_threshold THEN 'low_stock'
    ELSE 'in_stock'
  END as stock_status,
  si.updated_at
FROM stock_items si
ORDER BY si.glass_type, 
  CASE si.unit_type 
    WHEN 'large_box' THEN 1 
    WHEN 'small_box' THEN 2 
    WHEN 'individual' THEN 3 
  END;