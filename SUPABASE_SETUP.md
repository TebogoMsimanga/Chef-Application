# Supabase Storage Setup Guide

This guide will help you set up the necessary Supabase storage bucket for menu item images.

## Prerequisites

- A Supabase project created
- Access to your Supabase dashboard
- Environment variables configured in your `.env` file

## Quick Setup (Recommended)

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `menu-images`
   - **Public bucket**: ✅ Enable (check this box)
   - **File size limit**: 5MB (or your preferred limit)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`

5. Click **Create bucket**

6. Apply the storage policies migration:
   - Go to **SQL Editor** in your Supabase Dashboard
   - Run the migration file: `supabase/migrations/20240322000002_storage_policies.sql`
   - Or copy and paste the SQL from that file

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Apply the migration that sets up storage policies
supabase db push
```

The migration will automatically set up all necessary policies.

## Step 2: Storage Policies

The migration file `20240322000002_storage_policies.sql` sets up the following policies:

### Policy 1: Public Read Access
Allows anyone to view images in the `menu-images` bucket.

### Policy 2: Public Upload Access
Allows anyone (including anonymous users) to upload images. This is important so users can add menu items without requiring authentication.

### Policy 3: Public Update Access
Allows anyone to update images.

### Policy 4: Public Delete Access
Allows anyone to delete images.

**Note**: These policies allow public access so that all users can manage menu items. If you want to restrict access, modify the policies accordingly.

### Manual Policy Setup (If not using migration)

If you prefer to set up policies manually:

1. Go to **Storage** → **Policies** → Select `menu-images` bucket
2. Click **New Policy**
3. Choose **For full customization**
4. Use the SQL from the migration file or the policies below:

```sql
-- Allow public read access
CREATE POLICY "Public read access for menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Allow public upload access (for all users)
CREATE POLICY "Public upload access for menu images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

-- Allow public update access
CREATE POLICY "Public update access for menu images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

-- Allow public delete access
CREATE POLICY "Public delete access for menu images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');
```

**Important**: These policies allow public access so that all users can add menu items. This is by design for the application.

## Step 3: Initialize Categories

The application will automatically create the following categories when you first use the CreateMenuItem component:

- **Breakfast** - Morning meals and breakfast items
- **Starters** - Appetizers and starters
- **Lunch** - Lunch meals and dishes
- **Supper** - Evening meals
- **Meals** - Main meals and dishes

These categories are created automatically when you open the CreateMenuItem screen for the first time.

## Step 4: Test the Setup

1. Open the CreateMenuItem component in your app
2. Try creating a menu item with an image
3. The image should upload to Supabase storage
4. Check the Storage section in your Supabase dashboard to verify the upload

## Troubleshooting

### Image Upload Fails

- **Check bucket exists**: Ensure the `menu-images` bucket is created
- **Check policies**: Verify storage policies are set correctly
- **Check permissions**: Ensure the bucket is set to public
- **Check file size**: Ensure the image is under the bucket's size limit

### Categories Not Appearing

- The `initializeCategories()` function runs automatically on component mount
- Check your Supabase database for the `categories` table
- Verify the categories were created successfully

### Storage Access Denied

- Ensure your Supabase anon key has the correct permissions
- Check that storage policies allow the operations you're trying to perform
- Verify the bucket name matches exactly: `menu-images`

## Environment Variables

Make sure your `.env` file contains:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Additional Notes

- Images are stored in the `menu-items/` folder within the bucket
- Each image gets a unique filename based on timestamp and random string
- If image upload fails, the app will offer to continue with a default placeholder image
- The storage bucket should be public for images to be accessible via public URLs

