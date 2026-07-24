create extension if not exists "pgcrypto";

create type customer_order_status as enum ('placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled');
create type customer_payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type customer_payment_method as enum ('upi', 'card', 'net_banking', 'cod');
create type notification_type as enum ('order_update', 'delivery', 'promotion', 'price_drop', 'care_reminder');

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  password_hash text not null,
  email_verified_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  label text not null default 'Home',
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  plant_id uuid not null references plants(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plant_id)
);

create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  plant_id uuid not null references plants(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, plant_id)
);

create table customer_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references users(id) on delete set null,
  shipping_address_id uuid references user_addresses(id) on delete set null,
  shipping_address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  distance_meters integer,
  subtotal numeric(10,2) not null default 0,
  tax_amount numeric(10,2) not null default 0,
  delivery_charge numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null default 0,
  payment_method customer_payment_method not null,
  payment_status customer_payment_status not null default 'pending',
  status customer_order_status not null default 'placed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customer_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references customer_orders(id) on delete cascade,
  plant_id uuid references plants(id) on delete set null,
  plant_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references customer_orders(id) on delete cascade,
  provider text,
  method customer_payment_method not null,
  amount numeric(10,2) not null,
  status customer_payment_status not null default 'pending',
  transaction_reference text,
  created_at timestamptz not null default now()
);

alter table reviews add column if not exists user_id uuid references users(id) on delete cascade;
alter table reviews alter column customer_id drop not null;

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table recently_viewed_plants (
  user_id uuid not null references users(id) on delete cascade,
  plant_id uuid not null references plants(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (user_id, plant_id)
);

create table plant_care_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  plant_id uuid not null references plants(id) on delete cascade,
  title text not null,
  remind_at timestamptz not null,
  cadence_days integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_cart_items_user on cart_items(user_id);
create index idx_wishlist_items_user on wishlist_items(user_id);
create index idx_customer_orders_user on customer_orders(user_id, created_at desc);
create index idx_notifications_user on notifications(user_id, created_at desc);
