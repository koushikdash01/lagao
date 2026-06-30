# Lagao Admin Panel Architecture

## Overview

The admin panel is a full-stack scaffold added beside the existing static storefront.

```text
admin-api/   Express.js + TypeScript + PostgreSQL API
admin-web/   React + TypeScript + Tailwind CSS admin dashboard
docs/        Architecture and integration notes
```

## Local Development

1. Copy API environment variables:

```bash
cp admin-api/.env.example admin-api/.env
```

2. Create a PostgreSQL database and run:

```bash
psql "$DATABASE_URL" -f admin-api/db/schema.sql
```

3. Install dependencies:

```bash
npm install
npm --prefix admin-api install
npm --prefix admin-web install
```

4. Start both apps:

```bash
npm run dev
```

The API runs on `http://localhost:4000` and the admin web app runs on `http://localhost:5173`.

## API Structure

All admin routes except login require:

```http
Authorization: Bearer <jwt>
```

### Auth

```text
POST /api/auth/login
GET  /api/auth/me
```

### Dashboard

```text
GET /api/dashboard
```

Returns totals for orders, revenue, customers, plants, pending orders, delivered orders, low stock plants, recent orders, and revenue chart data.

### Plants

```text
GET    /api/plants?search=&categoryId=&sortBy=price|stock|date&page=1&limit=20
POST   /api/plants
PUT    /api/plants/:id
DELETE /api/plants/:id
PATCH  /api/plants/bulk
DELETE /api/plants/bulk
```

Plant fields include name, scientific name, category, description, price, discount price, stock quantity, images, indoor/outdoor type, sunlight requirement, watering frequency, pot size, featured flag, and status.

### Categories

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Inventory

```text
GET  /api/inventory
POST /api/inventory/restock
GET  /api/inventory/:plantId/history
```

### Orders

```text
GET   /api/orders?search=&status=&page=1&limit=20
PATCH /api/orders/:id/status
POST  /api/orders/:id/cancel
GET   /api/orders/export.csv
```

Order flow: `placed -> confirmed -> packed -> shipped -> delivered`.

### Customers

```text
GET /api/customers?search=&page=1&limit=20
GET /api/customers/:id
```

### Coupons, Reviews, Banners

```text
GET    /api/coupons
POST   /api/coupons
PUT    /api/coupons/:id
DELETE /api/coupons/:id

GET    /api/reviews
POST   /api/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id

GET    /api/banners
POST   /api/banners
PUT    /api/banners/:id
DELETE /api/banners/:id
```

## Database Tables

The schema lives in `admin-api/db/schema.sql`.

Tables:

- `admins`
- `categories`
- `plants`
- `plant_images`
- `inventory`
- `customers`
- `addresses`
- `orders`
- `order_items`
- `coupons`
- `reviews`
- `banners`

Important relationships:

- `plants.category_id -> categories.id`
- `plant_images.plant_id -> plants.id`
- `inventory.plant_id -> plants.id`
- `addresses.customer_id -> customers.id`
- `orders.customer_id -> customers.id`
- `orders.shipping_address_id -> addresses.id`
- `order_items.order_id -> orders.id`
- `order_items.plant_id -> plants.id`
- `reviews.plant_id -> plants.id`
- `reviews.customer_id -> customers.id`

## Admin Web Component Architecture

```text
admin-web/src/
├── App.tsx                    Route protection and app shell
├── main.tsx                   React entry point
├── styles.css                 Tailwind entry and base styles
├── components/
│   ├── Layout.tsx             Sidebar, navbar, dark mode, mobile nav
│   └── ui.tsx                 PageHeader, Card, Button, DataTable, StatusPill
├── data/
│   └── mockData.ts            Temporary dashboard and table data
├── lib/
│   └── api.ts                 Fetch helper with JWT header
└── pages/
    ├── Login.tsx
    ├── Dashboard.tsx
    └── ManagementPages.tsx
```

## Production Notes

- Replace the demo login flow in `admin-web/src/pages/Login.tsx` with `POST /api/auth/login`.
- Store JWTs in secure httpOnly cookies if this moves beyond MVP.
- Add migrations with a tool such as Prisma, Drizzle, node-pg-migrate, or Knex before production.
- Add object storage for image uploads. The current API accepts image URLs.
- Add audit logging for destructive admin actions.
- Add integration tests around auth, plant CRUD, order status transitions, and inventory restock.
