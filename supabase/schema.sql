-- Create tables
create table public.profiles (
  id uuid references auth.users primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  display_name text,
  role text check (role in ('admin', 'customer')) default 'customer' not null,
  avatar_url text default 'https://github.com/shadcn.png'
);

create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  customer_id uuid references public.profiles(id) not null,
  status text check (status in ('menunggu_pembayaran', 'diproses', 'produksi', 'selesai')) default 'menunggu_pembayaran' not null,
  quantity integer check (quantity >= 24) not null,
  design_url text not null,
  design_description text,
  material text not null,
  total_amount decimal(10,2) not null,
  unique_code integer not null,
  estimated_completion_days integer,
  is_paid boolean default false
);

create table public.materials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  name text not null unique,
  description text,
  price_per_piece decimal(10,2) not null,
  image_url text
);

create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  type text check (type in ('order_status', 'payment', 'system')) not null
);

-- Create indexes
create index orders_customer_id_idx on public.orders(customer_id);
create index orders_status_idx on public.orders(status);
create index notifications_user_id_idx on public.notifications(user_id);

-- Create profile trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  email_prefix text;
begin
  -- Extract everything before @ in email
  email_prefix := split_part(new.email, '@', 1);
  
  insert into public.profiles (
    id,
    display_name,
    avatar_url,
    role
  )
  values (
    new.id,
    email_prefix,
    'https://github.com/shadcn.png',
    'customer'
  );
  return new;
end;
$$;

-- Drop existing trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table profiles enable row level security;
alter table orders enable row level security;
alter table materials enable row level security;
alter table notifications enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- RLS Policies for orders
create policy "Customers can view own orders"
  on orders for select
  using (auth.uid() = customer_id);

create policy "Admin can view all orders"
  on orders for select
  using (
    auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );

create policy "Admin can update orders"
  on orders for update
  using (
    auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );

-- RLS Policies for materials
create policy "Everyone can view materials"
  on materials for select
  using (true);

create policy "Admin can modify materials"
  on materials for all
  using (
    auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );

-- RLS Policies for notifications
create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- Insert some sample materials
insert into public.materials (name, description, price_per_piece)
values 
  ('Cotton Combed 24s', 'High quality cotton combed fabric, perfect for t-shirts', 55000),
  ('Cotton Combed 30s', 'Soft and breathable cotton combed fabric, ideal for t-shirts',50000),
  ('Denim', 'Heavy-duty denim fabric, ideal for jackets and jeans', 75000),
  ('Rayon', 'Lightweight and breathable rayon fabric', 65000),
  ('Linen', 'Premium linen fabric with natural texture', 85000);