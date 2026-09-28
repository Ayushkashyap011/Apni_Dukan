# 📡 APNI DUKAN — REST API Documentation

Interactive Swagger UI documentation is available at:
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **OpenAPI 3.0 Schema**: `http://localhost:8000/api/schema/`

---

## Centralized API Endpoint Reference

### 1. Authentication & Profile (`/api/v1/auth/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/v1/auth/register/` | Register new user account | No |
| POST | `/api/v1/auth/login/` | Obtain Access & Refresh JWT | No |
| POST | `/api/v1/auth/refresh/` | Refresh JWT Access Token | No |
| POST | `/api/v1/auth/logout/` | Blacklist refresh token & logout | Yes |
| GET/PATCH | `/api/v1/auth/profile/` | Fetch or update user profile | Yes |
| POST | `/api/v1/auth/change-password/` | Change account password | Yes |
| GET/POST | `/api/v1/addresses/` | List or create shipping addresses | Yes |

### 2. Product Catalog (`/api/v1/products/` & `/api/v1/categories/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/v1/categories/` | List categories & subcategories | No |
| GET | `/api/v1/brands/` | List active product brands | No |
| GET | `/api/v1/products/` | List products with filters & pagination | No |
| GET | `/api/v1/products/:slug/` | Get product details, gallery, and variants | No |

### 3. Cart & Wishlist (`/api/v1/cart/` & `/api/v1/wishlist/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/v1/cart/` | Fetch current user cart | Yes |
| POST | `/api/v1/cart/items/` | Add item to cart with variant & quantity | Yes |
| PATCH | `/api/v1/cart/items/:id/` | Update item quantity | Yes |
| DELETE | `/api/v1/cart/items/:id/remove/` | Remove item from cart | Yes |
| POST | `/api/v1/wishlist/toggle/` | Toggle item in wishlist | Yes |
| POST | `/api/v1/wishlist/move-to-cart/` | Move wishlist item directly to cart | Yes |

### 4. Coupons, Orders & Reviews (`/api/v1/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/v1/coupons/validate/` | Validate coupon code & subtotal | Yes |
| POST | `/api/v1/orders/checkout/` | Transactional checkout order creation | Yes |
| GET | `/api/v1/orders/` | List user order history | Yes |
| GET | `/api/v1/orders/:id/` | Retrieve order invoice & tracking | Yes |
| GET/POST | `/api/v1/reviews/` | List reviews or submit product review | Public / Yes |

### 5. Admin Portal (`/api/v1/admin/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/v1/admin/analytics/` | Dashboard business performance metrics | Admin/Staff |
| PATCH | `/api/v1/orders/:id/update-status/` | Update order fulfillment status | Admin/Staff |
