-- Add missing RLS policy for orders creation
create policy "Customers can create own orders"
  on orders for insert
  with check (auth.uid() = customer_id);

-- Add policy for updating orders
create policy "Customers can update own orders"
  on orders for update
  using (auth.uid() = customer_id);

-- Add policy for admin to update any order
create policy "Admins can update any order"
  on orders for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Add storage policies for designs bucket
-- Skip bucket creation since it exists

-- Allow any authenticated user to upload files to their own folder
create policy "Users can upload design files"
  on storage.objects for insert
  with check (
    bucket_id = 'designs' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view their own design files
create policy "Users can view own designs"
  on storage.objects for select
  using (
    bucket_id = 'designs' AND
    auth.role() = 'authenticated' AND
    (
      -- Users can view their own designs
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      -- Admin can view all designs
      exists (
        select 1 from profiles
        where id = auth.uid()
        and role = 'admin'
      )
    )
  );

-- Fix data type for total_amount in orders table
alter table orders 
alter column total_amount type integer
using total_amount::integer;