/*
  # Update Glass Rental Inventory Structure

  1. New Tables
    - Updates `glassware` table with proper inventory structure
    - Adds pricing tiers for individual glasses, small boxes, and large boxes
    - Sets up proper stock levels based on Rwanda inventory

  2. Inventory Structure
    - Beer Glasses: 5 large boxes = 240 total glasses
    - Wine Glasses: 3 large boxes = 144 total glasses  
    - Cocktail Glasses: 3 large boxes = 144 total glasses
    - Champagne Glasses: 2 large boxes = 96 total glasses

  3. Pricing Structure
    - Individual glass pricing
    - Small box pricing (6 glasses)
    - Large box pricing (48 glasses = 8 small boxes)
*/

-- Clear existing glassware data
DELETE FROM glassware;

-- Insert Beer Glasses inventory
INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
('Beer Glass', 'Premium beer glasses - Individual rental', 240, 400),
('Beer Glass Small Box', 'Beer glasses small box (6 glasses)', 40, 2400),
('Beer Glass Large Box', 'Beer glasses large box (48 glasses = 8 small boxes)', 5, 19200);

-- Insert Wine Glasses inventory  
INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
('Wine Glass', 'Elegant wine glasses - Individual rental', 144, 450),
('Wine Glass Small Box', 'Wine glasses small box (6 glasses)', 24, 2700),
('Wine Glass Large Box', 'Wine glasses large box (48 glasses = 8 small boxes)', 3, 21600);

-- Insert Cocktail Glasses inventory
INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
('Cocktail Glass', 'Stylish cocktail glasses - Individual rental', 144, 500),
('Cocktail Glass Small Box', 'Cocktail glasses small box (6 glasses)', 24, 3000),
('Cocktail Glass Large Box', 'Cocktail glasses large box (48 glasses = 8 small boxes)', 3, 24000);

-- Insert Champagne Glasses inventory
INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
('Champagne Glass', 'Premium champagne flutes - Individual rental', 96, 450),
('Champagne Glass Small Box', 'Champagne glasses small box (6 glasses)', 16, 2700),
('Champagne Glass Large Box', 'Champagne glasses large box (48 glasses = 8 small boxes)', 2, 21600);