# Lagao Customer Website Architecture

## Stack

- React + TypeScript
- Tailwind CSS
- Node.js + Express.js
- PostgreSQL
- REST APIs
- JWT authentication

## Folder Structure

```text
customer-web/
├── public/
│   └── manifest.webmanifest
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── ui.tsx
│   ├── data/
│   │   └── catalog.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── store.tsx
│   └── pages/
│       ├── Account.tsx
│       ├── Auth.tsx
│       ├── Cart.tsx
│       ├── Catalog.tsx
│       ├── Checkout.tsx
│       ├── Home.tsx
│       ├── PlantDetails.tsx
│       └── StaticPages.tsx
```

## Component Hierarchy

```text
App
└── StoreProvider
    └── Layout
        ├── Navbar
        ├── Mobile Menu
        ├── Routed Page
        └── Footer

Pages
├── Home
│   ├── Hero
│   ├── Featured Plants
│   ├── Best Sellers
│   ├── New Arrivals
│   ├── Trending Plants
│   ├── Categories
│   ├── Why Choose Us
│   ├── Testimonials
│   └── Newsletter
├── Catalog
│   ├── Search
│   ├── Filters
│   ├── Sort
│   ├── Pagination
│   └── PlantCard Grid
├── PlantDetails
│   ├── Image Carousel
│   ├── Product Info
│   ├── Care Instructions
│   ├── Quantity Selector
│   ├── Reviews
│   └── Similar Plants
├── Cart
├── Checkout
├── Wishlist
├── Orders
├── Profile
├── Notifications
└── Static Pages
```

## Customer API Endpoints

### Authentication

```text
POST /api/customer/auth/signup
POST /api/customer/auth/login
POST /api/customer/auth/forgot-password
POST /api/customer/auth/reset-password
POST /api/customer/auth/verify-email
GET  /api/customer/auth/me
```

### Public Storefront

```text
GET /api/storefront/homepage
GET /api/storefront/categories
GET /api/storefront/plants
GET /api/storefront/plants/:id
```

`GET /api/storefront/plants` supports:

- `search`
- `categoryId`
- `type`
- `availability`
- `minPrice`
- `maxPrice`
- `sort=newest|price-low|price-high|popularity|rating`
- `page`
- `limit`

### Protected Shopping APIs

Require:

```http
Authorization: Bearer <customer-jwt>
```

```text
GET    /api/shop/cart
POST   /api/shop/cart
PATCH  /api/shop/cart/:plantId

GET    /api/shop/wishlist
POST   /api/shop/wishlist
DELETE /api/shop/wishlist/:plantId

GET    /api/shop/addresses
POST   /api/shop/checkout
GET    /api/shop/orders
POST   /api/shop/reviews
GET    /api/shop/notifications
```

## Database Schema

Customer schema extension:

```text
admin-api/db/customer-schema.sql
```

Tables:

- `users`
- `user_addresses`
- `cart_items`
- `wishlist_items`
- `customer_orders`
- `customer_order_items`
- `payments`
- `notifications`
- `recently_viewed_plants`
- `plant_care_reminders`

Shared storefront/admin tables:

- `plants`
- `categories`
- `plant_images`
- `coupons`
- `reviews`
- `banners`

## Production Notes

- Replace mock catalog data in `customer-web/src/data/catalog.ts` with API calls from `/api/storefront`.
- Add React Query or another server-state library before heavy production use.
- Move JWTs to secure httpOnly cookies for production.
- Add payment provider integration for UPI, card, and net banking.
- Add object storage for review images and product images.
- Add debounced search hooks, error boundaries, toast provider, and skeleton states globally.
- Use generated image sizes or a CDN for product image optimization.
- Add sitemap, Open Graph metadata, and canonical URLs for SEO.
- Register a service worker to complete PWA offline/install behavior.
