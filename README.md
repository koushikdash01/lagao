# 🌱 Lagao - Plant Nursery E-Commerce & Management System

**Lagao** is a full-stack plant e-commerce and nursery management platform. It features an interactive **Customer Web Store** with GPS/map-based delivery distance calculation, secure **Razorpay Payment Gateway** integration (UPI, Cards, Net Banking) alongside **Cash on Delivery (COD)**, and a real-time **Admin Management Panel**.

---

## 📂 Project Structure

The monorepo is organized into three decoupled, high-performance packages:

```
lagao/
├── admin-api/        # Express + TypeScript backend API, database layer & Razorpay order processing
├── customer-web/     # Customer-facing storefront with Leaflet maps, catalog & Razorpay Checkout modal
├── admin-web/        # Admin dashboard for orders, plant inventory, coupons & live metrics
└── docs/             # Technical specifications & documentation
```

### 1. `admin-api`
**Backend REST API for Storefront & Administration**
* **Technology:** Node.js, Express, TypeScript, PostgreSQL (`pg`), `crypto` (HMAC SHA-256)
* **Features:**
  * Secure JWT authentication (Admin & Customer roles)
  * Razorpay Order creation (`/api/demo/orders/initiate-payment`)
  * Cryptographic HMAC-SHA256 signature verification for payments
  * Automated inventory allocation & stock sync on order placement
  * GPS coordinates & Haversine distance calculator for delivery charges
  * Coupon code validation (Percentage & Flat discounts)

### 2. `customer-web`
**High-Performance Customer Storefront**
* **Technology:** React 18, Vite, TypeScript, Tailwind CSS, Zustand
* **Features:**
  * Dynamic plant catalog with search, category filtering & price sorting
  * Cart & Wishlist with persistent local state & coupon application
  * Interactive **Leaflet Map Location Picker** (GPS detection + draggable pin)
  * Seamless **Razorpay Checkout Modal** (UPI, Credit/Debit Cards, Net Banking)
  * Contactless **Cash on Delivery (COD)** flow
  * Order confirmation with live status, tracking & distance metrics

### 3. `admin-web`
**Management Dashboard for Nursery Owners**
* **Technology:** React 18, Vite, TypeScript, Tailwind CSS
* **Features:**
  * Live revenue, order volume & active inventory statistics
  * Order fulfillment (Accept/Reject delivery, dispatch & status updates)
  * Plant catalogue CRUD (stock adjustments, pricing, categories)
  * Coupon management & customer review moderation

---

## 💳 Payment Gateway Integration (Razorpay & COD)

Lagao supports both online digital payments and cash on delivery:

### 1. Supported Payment Methods
* 📱 **UPI**: Instant 1-tap payment via Google Pay, PhonePe, Paytm, CRED, or QR Code.
* 💳 **Credit & Debit Cards**: Visa, MasterCard, RuPay, Maestro, and International cards.
* 🏦 **Net Banking & Wallets**: 50+ Indian banks (HDFC, SBI, ICICI, Axis, PNB, etc.).
* 💵 **Cash on Delivery (COD)**: Contactless doorstep payment with direct order placement.

### 2. End-to-End Payment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Store as Customer Web
    participant Backend as Express API
    participant Razorpay as Razorpay Gateway
    participant DB as PostgreSQL

    alt Online Payment (UPI, Card, Net Banking)
        Customer->>Store: Clicks "Pay with Razorpay"
        Store->>Backend: POST /api/demo/orders/initiate-payment
        Backend->>Razorpay: orders.create({ amount: paise, currency: "INR" })
        Razorpay-->>Backend: Returns razorpay_order_id
        Backend-->>Store: Returns { orderNumber, razorpayOrderId, amount, keyId }
        Store->>Razorpay: Opens Razorpay Checkout Modal
        Customer->>Razorpay: Completes payment
        Razorpay-->>Store: Returns { razorpay_payment_id, razorpay_signature }
        Store->>Backend: POST /api/demo/orders (with signature & payload)
        Backend->>Backend: Verifies HMAC SHA-256 signature
        Backend->>DB: Records order with status "paid" & updates inventory
        Backend-->>Store: Confirmed order with status "paid"
    else Cash on Delivery (COD)
        Customer->>Store: Selects COD & Clicks "Place Order"
        Store->>Backend: POST /api/demo/orders (paymentMethod: "cod")
        Backend->>DB: Records order with status "pending" & updates inventory
        Backend-->>Store: Confirmed order with status "pending"
    end
```

---

## ⚙️ Environment Variables

### Backend Configuration (`admin-api/.env`)

```env
PORT=4000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:5173

# Razorpay Payment Gateway Keys (Test or Live)
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourKeySecretHere
```

### Customer Frontend Configuration (`customer-web/.env`)

```env
VITE_API_URL=http://localhost:4000/api
VITE_RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
```

---

## 🚀 Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [PostgreSQL](https://www.postgresql.org/) (or Supabase connection string)

### 2. Installation

Clone the repository and install all dependencies:

```bash
git clone https://github.com/koushikdash01/lagao.git
cd lagao
npm install
npm --prefix admin-api install
npm --prefix customer-web install
npm --prefix admin-web install
```

### 3. Running Locally

Start all three applications in parallel with a single command:

```bash
npm run dev
```

* **Customer Storefront:** `http://localhost:5173`
* **Admin Dashboard:** `http://localhost:5173/admin` (or `http://localhost:5174`)
* **Admin REST API:** `http://localhost:4000`

---

## 🔒 Switching from Test Mode to Live Payments

When your Razorpay KYC is approved:
1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Toggle from **Test Mode** to **Live Mode**.
3. Go to **Settings > API Keys** and generate a **Live Key ID** (`rzp_live_...`) and **Live Key Secret**.
4. Replace the keys in `admin-api/.env` and `customer-web/.env`. No code modifications are needed!