/*
  # Update Glass Rental Pricing Structure

  1. Pricing Updates
    - Beer Glasses: Individual 400 RWF, Small Box 2400 RWF, Large Box 19200 RWF
    - Wine Glasses: Individual 450 RWF, Small Box 2700 RWF, Large Box 21600 RWF  
    - Cocktail Glasses: Individual 500 RWF, Small Box 4000 RWF, Large Box 32000 RWF
    - Champagne Glasses: Individual 450 RWF, Small Box 2700 RWF, Large Box 21600 RWF

  2. Inventory Structure
    - Beer: 5 large boxes = 240 total glasses
    - Wine: 3 large boxes = 144 total glasses
    - Cocktail: 3 large boxes = 144 total glasses
    - Champagne: 2 large boxes = 96 total glasses
*/

-- Clear existing glassware data
DELETE FROM glassware;

-- Insert Beer Glasses inventory with correct pricing
INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
('Beer Glass', 'Premium beer glasses - Individual rental', 240, 400),
('Beer Glass Small Box', 'Beer glasses small box (6 glasses)', 40, 2400),
('Beer Glass Large Box', 'Beer glasses large box (48 glasses = 8 small boxes)', 5, 19200);

-- Insert Wine Glasses inventory with correct pricing
INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
('Wine Glass', 'Elegant wine glasses - Individual rental', 144, 450),
('Wine Glass Small Box', 'Wine glasses small box (6 glasses)', 24, 2700),
('Wine Glass Large Box', 'Wine glasses large box (48 glasses = 8 small boxes)', 3, 21600);

-- Insert Cocktail Glasses inventory with correct pricing
INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
('Cocktail Glass', 'Stylish cocktail glasses - Individual rental', 144, 500),
('Cocktail Glass Small Box', 'Cocktail glasses small box (6 glasses)', 24, 4000),
('Cocktail Glass Large Box', 'Cocktail glasses large box (48 glasses = 8 small boxes)', 3, 32000);

-- Insert Champagne Glasses inventory with correct pricing
INSERT INTO glassware (type, description, quantity_available, price_per_unit) VALUES
('Champagne Glass', 'Premium champagne flutes - Individual rental', 96, 450),
('Champagne Glass Small Box', 'Champagne glasses small box (6 glasses)', 16, 2700),
('Champagne Glass Large Box', 'Champagne glasses large box (48 glasses = 8 small boxes)', 2, 21600);