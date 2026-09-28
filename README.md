# 🛍️ APNI DUKAN — Production-Grade Full-Stack E-Commerce Platform

APNI DUKAN is a complete, scalable, production-grade e-commerce platform built from scratch. It features a Django REST Framework backend with PostgreSQL/SQLite, JWT auth, Role-Based Access Control, transactional inventory management, coupon engine, mock payment gateway integration, and OpenAPI Swagger documentation. The frontend is built with React, TypeScript, Vite, React Router, Zustand, React Query, and TailwindCSS with a mobile-first, high-aesthetic modern fashion UI.

---

## 🌟 Key Features

- **JWT Authentication & RBAC**: Access & Refresh token rotation, custom claims, and granular roles (`CUSTOMER`, `ADMIN`, `STAFF`).
- **Product Catalog & Variants**: Multi-size (S, M, L, XL, 30, 32, 34), multi-color variant matrix with dedicated SKUs, stock levels, and pricing.
- **Search, Multi-Filter & Sort**: Full-text search, category/subcategory filtering, brand selection, price range filters, and sorting (Price Low/High, Newest, Top Rated).
- **Shopping Cart & Wishlist**: Real-time stock validation, drawer preview, quantity updates, and wishlist toggle with seamless move-to-cart.
- **Coupon Validation Engine**: Percentage & Fixed discounts (`WELCOME10`, `FASHION500`), min order amounts, max discounts, and per-user limits.
- **Transactional Checkout**: Concurrency-safe atomic checkout (`db.transaction.atomic()`), address snapshotting, inventory deduction, and mock payment gateway processing.
- **Verified Purchaser Reviews**: Product rating aggregation (1–5 stars) restricted to verified buyers.
- **Admin Portal**: Executive business analytics (Revenue ₹, Total Orders, Customer Count, Low Stock Alerts, Order Fulfillment Workflow).

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript (Strict Mode)
- **Routing**: React Router v6
- **State & Data Fetching**: Zustand + TanStack React Query v5
- **Styling**: TailwindCSS + Glassmorphic UI Design
- **HTTP Client**: Axios with automatic JWT bearer injection & transparent token auto-refresh interceptors

### Backend
- **Framework**: Python 3.11 + Django 5 + Django REST Framework
- **Auth**: SimpleJWT (Access/Refresh Tokens, Token Blacklisting)
- **Database**: PostgreSQL / SQLite (zero-dependency local setup)
- **Documentation**: OpenAPI 3.0 via `drf-spectacular` (Swagger UI at `/api/docs/`)
- **Testing**: Pytest + `pytest-django`

---

## 📁 Repository Structure

```text
apni-dukan/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/             # Settings, URLs, WSGI
│   ├── apps/               # 12 Modular Domain Apps (accounts, products, cart, orders, etc.)
│   ├── scripts/            # Seed data script (seed_data.py)
│   └── tests/              # Pytest test suite (test_api.py)
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/     # Navbar, Footer, CartDrawer, ProductCard, SkeletonLoader
│       ├── features/       # Modular features
│       ├── layouts/        # MainLayout, AuthLayout, AdminLayout
│       ├── pages/          # Home, Shop, ProductDetail, Cart, Checkout, Orders, Admin
│       ├── services/       # Centralized Axios API client & domain services
│       ├── store/          # Zustand stores (authStore, cartStore, wishlistStore)
│       └── types/          # TypeScript domain interfaces
├── docs/                   # Architecture, API reference, Database schema, Deployment guides
├── docker/                 # Production Dockerfiles
├── docker-compose.yml       # Multi-container orchestration
└── README.md
```

---

## ⚡ Quickstart Guide

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python scripts/seed_data.py
python manage.py runserver
```
Backend API will run at `http://localhost:8000/api/v1/`.  
Swagger UI documentation will be available at `http://localhost:8000/api/docs/`.

### 2. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Storefront will be running at `http://localhost:5173/`.

### 3. Demo Credentials
- **Admin Account**: `admin@apnidukan.com` / `Admin@123`
- **Customer Account**: `customer@apnidukan.com` / `Customer@123`
- **Sample Coupons**: `WELCOME10` (10% off), `FASHION500` (₹500 off on ₹1,999)

---

## 🧪 Testing

Run backend unit tests:
```bash
cd backend
pytest
```

Run frontend build verification:
```bash
cd frontend
npm run build
```

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```
- Storefront: `http://localhost/`
- API Backend: `http://localhost:8000/api/v1/`
