-- Storage Policies for menu-images bucket
-- This migration sets up policies to allow all users to upload menu item images
-- Note: The bucket must be created manually via Supabase Dashboard or API first

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Public read access for menu images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access for menu images" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for menu images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for menu images" ON storage.objects;

-- Policy 1: Allow public read access to menu-images bucket
-- This allows anyone to view the images
CREATE POLICY "Public read access for menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Policy 2: Allow public upload access to menu-images bucket
-- This allows anyone (including anonymous users) to upload images
-- This is needed so users can add menu items without authentication
CREATE POLICY "Public upload access for menu images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

-- Policy 3: Allow public update access to menu-images bucket
-- This allows anyone to update images
CREATE POLICY "Public update access for menu images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

-- Policy 4: Allow public delete access to menu-images bucket
-- This allows anyone to delete images
CREATE POLICY "Public delete access for menu images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');

