-- Create or replace the trigger function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
declare
  email_prefix text;
begin
  -- Extract username from email for display_name
  email_prefix := split_part(new.email, '@', 1);
  
  insert into public.profiles (
    id,
    email, -- Add email field
    display_name,
    avatar_url,
    role
  )
  values (
    new.id,
    new.email, -- Copy email from auth.users
    email_prefix,
    'https://github.com/shadcn.png',
    'customer'
  );
  return new;
end;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- Notification System Triggers
-- ==========================================

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

  -- Insert notification for customer with type
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