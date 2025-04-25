# Supabase Setup for CampusMart

This directory contains the necessary files to set up your Supabase project for CampusMart.

## Setup Instructions

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)

2. Get your project URL and anon key from the project settings and add them to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Set up the database tables by running the SQL in `migrations/20240101000000_create_tables.sql` in the Supabase SQL editor.

4. Set up the storage buckets by running the SQL in `storage/buckets.sql` in the Supabase SQL editor.

5. Configure Google OAuth:
   - Go to the Authentication settings in your Supabase dashboard
   - Enable Google provider
   - Create a Google OAuth client ID and secret in the [Google Cloud Console](https://console.cloud.google.com/)
   - Add the redirect URL from Supabase to your Google OAuth configuration
   - Add your Google client ID and secret to Supabase

## Database Schema

### Users Table
- `id`: UUID (Primary Key, references auth.users)
- `name`: TEXT (Required)
- `email`: TEXT
- `avatar_url`: TEXT
- `location`: TEXT
- `phone`: TEXT
- `bio`: TEXT
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

### Listings Table
- `id`: UUID (Primary Key)
- `title`: TEXT (Required)
- `description`: TEXT (Required)
- `price`: DECIMAL (Required)
- `image_url`: TEXT
- `location`: TEXT (Required)
- `category`: TEXT (Required)
- `user_id`: UUID (Foreign Key to users.id)
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

## Storage Buckets

### Avatars Bucket
- For storing user profile images
- Public read access
- Write access restricted to authenticated users for their own files

### Listings Bucket
- For storing listing images
- Public read access
- Write access restricted to authenticated users for their own files
