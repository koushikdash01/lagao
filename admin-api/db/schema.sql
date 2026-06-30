create extension if not exists "pgcrypto";

create type plant_type as enum ('indoor', 'outdoor');
create type plant_status as enum ('available', 'out_of_stock');
create type category_status as enum ('active', 'inactive');
create type order_status as enum ('placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type discount_type as enum ('flat', 'percentage');
create type review_status as enum ('pending', 'approved', 'hidden');
create type inventory_change_type as enum ('restock', 'sale', 'adjustment', 'return');

create table admins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  image_url text,
  status category_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scientific_name text,
  category_id uuid references categories(id) on delete set null,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  discount_price numeric(10,2) check (discount_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  type plant_type not null,
  sunlight_requirement text not null,
  watering_frequency text not null,
  pot_size text not null,
  is_featured boolean not null default false,
  status plant_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table plant_images (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table inventory (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  change_type inventory_change_type not null,
  quantity integer not null,
  note text,
  created_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  label text default 'Home',
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  shipping_address_id uuid references addresses(id) on delete set null,
  subtotal numeric(10,2) not null default 0,
  tax_amount numeric(10,2) not null default 0,
  shipping_amount numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null default 0,
  payment_status payment_status not null default 'pending',
  status order_status not null default 'placed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  plant_id uuid references plants(id) on delete set null,
  plant_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null
);

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type discount_type not null,
  discount_value numeric(10,2) not null check (discount_value > 0),
  expiry_date date not null,
  minimum_order_amount numeric(10,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  reply text,
  status review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_plants_category on plants(category_id);
create index idx_plants_search on plants using gin (to_tsvector('english', name || ' ' || coalesce(scientific_name, '')));
create index idx_orders_status on orders(status);
create index idx_orders_created_at on orders(created_at desc);
create index idx_inventory_plant on inventory(plant_id, created_at desc);
create index idx_reviews_status on reviews(status);

insert into categories (name, description, status) values
  ('Indoor Plants', 'Plants suited for homes, offices, and shaded spaces.', 'active'),
  ('Outdoor Plants', 'Hardier plants for balconies, patios, and gardens.', 'active'),
  ('Flowering Plants', 'Blooming plants for seasonal color.', 'active'),
  ('Succulents', 'Water-wise plants with sculptural leaves.', 'active'),
  ('Air Purifying Plants', 'Plants known for improving indoor air quality.', 'active'),
  ('Pots & Accessories', 'Planters, soil, tools, and care accessories.', 'active')
on conflict (name) do nothing;

-- Create the first admin with a bcrypt hash from your setup script or SQL client.
-- Example password hashing command:
-- node -e "console.log(require('bcryptjs').hashSync('ChangeMe123!', 12))"
