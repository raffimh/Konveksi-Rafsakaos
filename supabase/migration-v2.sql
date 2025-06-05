-- ==========================================
-- Migration Script for RafsakaosV2
-- Clean up and consolidate database schema
-- ==========================================

-- Drop existing triggers to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_order_status_change ON orders;

-- Drop existing functions to recreate them
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS handle_order_status_change();

-- Drop all existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own designs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Admins have full access to designs" ON storage.objects;

-- Fix total_amount column type in orders table if needed
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders'
        AND column_name = 'total_amount'
        AND data_type = 'numeric'
    ) THEN
        ALTER TABLE orders
        ALTER COLUMN total_amount TYPE integer
        USING total_amount::integer;
    END IF;
END $$;

-- Ensure designs bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('designs', 'designs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Now run the complete schema to set everything up properly
-- (The complete-schema.sql file should be executed after this migration)