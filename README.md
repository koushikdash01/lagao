# 🌱 Lagao - Plant Nursery Management System

**Lagao** is a comprehensive web application designed for plant nurseries to manage inventory, track orders, and engage with customers. The platform features a dual-interface system with a secure **Admin Panel** for management and a modern **Customer Website** for browsing and purchasing.

## 📂 Project Structure

The repository is organized into three main packages:

### 1. `admin-api`
**Backend API for Administrators and Storefront**

*   **Technology:** TypeScript, Node.js, Express, PostgreSQL (via Drizzle ORM)
*   **Key Features:**
    *   Secure authentication for Admins and Customers
    *   CRUD operations for Plants, Categories, and Shop
    *   Order management and tracking
    *   Dashboard analytics
    *   Pagination utilities

### 2. `admin-web`
**Web Interface for Nursery Management**

*   **Technology:** TypeScript, React, Vite, Tailwind CSS
*   **Key Features:**
    *   Responsive dashboard layout
    *   Management of plant inventory
    *   Order and customer management
    *   Authentication flows
    *   Modern UI components

### 3. `customer-web`
**E-commerce Store for Customers**

*   **Technology:** TypeScript, React, Vite, Tailwind CSS, Zustand
*   **Key Features:**
    *   Browse plant catalog
    *   Add to cart and checkout
    *   User account management
    *   Order history
    *   Static pages (About, Contact, FAQ)

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [PostgreSQL](https://www.postgresql.org/) (or Docker for easy setup)
*   Basic knowledge of TypeScript, React, and Node.js