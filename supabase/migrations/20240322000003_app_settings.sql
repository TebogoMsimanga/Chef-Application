-- Create app_settings table for dynamic configuration values
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (key, value, description) VALUES
  ('delivery_fee', 50.00, 'Standard delivery fee in Rands'),
  ('discount', 15.00, 'Default discount amount in Rands')
ON CONFLICT (key) DO NOTHING;

-- Allow public read access to settings (for authenticated users)
CREATE POLICY "Anyone can view app settings" ON app_settings
  FOR SELECT TO authenticated USING (true);

-- Allow only authenticated users to update settings (for admin use)
CREATE POLICY "Authenticated users can update app settings" ON app_settings
  FOR UPDATE TO authenticated USING (true);

