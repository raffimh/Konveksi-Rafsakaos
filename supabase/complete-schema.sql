-- ==========================================
-- Complete Database Schema for RafsakaosV2
-- ==========================================

-- Create tables
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone,
  email text,
  display_name text,
  role text CHECK (role IN ('admin', 'customer')) DEFAULT 'customer' NOT NULL,
  avatar_url text DEFAULT 'https://github.com/shadcn.png'
);

CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone,
  customer_id uuid REFERENCES public.profiles(id) NOT NULL,
  status text CHECK (status IN ('menunggu_pembayaran', 'diproses', 'produksi', 'selesai')) DEFAULT 'menunggu_pembayaran' NOT NULL,
  quantity integer CHECK (quantity >= 24) NOT NULL,
  design_url text NOT NULL,
  design_description text,
  material text NOT NULL,
  total_amount integer NOT NULL,
  unique_code integer NOT NULL,
  estimated_completion_days integer,
  is_paid boolean DEFAULT false
);

CREATE TABLE public.materials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone,
  name text NOT NULL UNIQUE,
  description text,
  price_per_piece decimal(10,2) NOT NULL,
  image_url text
);

CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  type text CHECK (type IN ('order_status', 'payment', 'system')) NOT NULL
);

-- Create indexes
CREATE INDEX orders_customer_id_idx ON public.orders(customer_id);
CREATE INDEX orders_status_idx ON public.orders(status);
CREATE INDEX notifications_user_id_idx ON public.notifications(user_id);

-- ==========================================
-- Triggers and Functions
-- ==========================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  email_prefix text;
BEGIN
  -- Extract username from email for display_name
  email_prefix := split_part(new.email, '@', 1);
  
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    role
  )
  VALUES (
    new.id,
    new.email,
    email_prefix,
    'https://github.com/shadcn.png',
    'customer'
  );
  RETURN new;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to create notification on order status change
CREATE OR REPLACE FUNCTION handle_order_status_change()
RETURNS trigger AS $$
DECLARE
  customer_id uuid;
  order_id text;
  new_status text;
BEGIN
  -- Get customer ID and format status
  customer_id := NEW.customer_id;
  order_id := substring(NEW.id::text from 1 for 8);
  new_status := case NEW.status
    when 'menunggu_pembayaran' then 'Menunggu Pembayaran'
    when 'diproses' then 'Diproses'
    when 'produksi' then 'Dalam Produksi'
    when 'selesai' then 'Selesai'
    else NEW.status
  end;

  -- Insert notification for customer
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type
  )
  VALUES (
    customer_id,
    'Status Pesanan Diperbarui',
    format('Order #%s telah diperbarui menjadi %s', order_id, new_status),
    'order_status'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_order_status_change ON orders;

-- Create trigger for order status changes
CREATE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_order_status_change();

-- ==========================================
-- Storage Setup
-- ==========================================

-- Create designs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('designs', 'designs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for orders
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Customers can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = customer_id);

CREATE POLICY "Admin can update any order"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- RLS Policies for materials
CREATE POLICY "Everyone can view materials"
  ON materials FOR SELECT
  USING (true);

CREATE POLICY "Admin can modify materials"
  ON materials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- Storage Policies
-- ==========================================

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own designs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Admins have full access to designs" ON storage.objects;

-- Create storage policies for designs bucket
CREATE POLICY "Anyone can view design files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'designs');

CREATE POLICY "Authenticated users can upload design files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'designs'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own designs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'designs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins have full access to designs"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'designs'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ==========================================
-- Sample Data
-- ==========================================

-- Insert sample materials
INSERT INTO public.materials (name, description, price_per_piece, image_url)
VALUES 
  ('Cotton Combed 24s', 'High quality cotton combed fabric, perfect for t-shirts', 55000, 'https://plus.unsplash.com/premium_photo-1723402289679-a6df975abbe2?q=80&w=800&auto=format'),
  ('Cotton Combed 30s', 'Soft and breathable cotton combed fabric, ideal for t-shirts', 50000, 'https://plus.unsplash.com/premium_photo-1723834343669-f6f470ad4071?q=80&w=800&auto=format'),
  ('Denim', 'Heavy-duty denim fabric, ideal for jackets and jeans', 75000, 'https://images.unsplash.com/photo-1645859724073-d9bff094b1c7?q=80&w=800&auto=format'),
  ('Rayon', 'Lightweight and breathable rayon fabric', 65000, 'https://images.unsplash.com/photo-1591176134674-87e8f7c73ce9?q=80&w=800&auto=format'),
  ('Linen', 'Premium linen fabric with natural texture', 85000, 'https://images.unsplash.com/photo-1591625591034-75d303d2e1a4?q=80&w=800&auto=format')
ON CONFLICT (name) DO NOTHING;