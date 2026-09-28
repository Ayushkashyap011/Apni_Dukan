# 🗄️ APNI DUKAN — Database Schema & Data Models

## Relational Entity-Relationship Summary

```mermaid
erDiagram
    USER ||--o{ ADDRESS : has
    USER ||--o1 CART : owns
    USER ||--o1 WISHLIST : owns
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes

    CATEGORY ||--o{ SUBCATEGORY : contains
    CATEGORY ||--o{ PRODUCT : categorizes
    BRAND ||--o{ PRODUCT : manufactures
    PRODUCT ||--o{ PRODUCT_VARIANT : offers
    PRODUCT ||--o{ PRODUCT_IMAGE : displays
    PRODUCT ||--o{ REVIEW : receives

    CART ||--o{ CART_ITEM : contains
    WISHLIST ||--o{ WISHLIST_ITEM : contains
    ORDER ||--o{ ORDER_ITEM : contains
    ORDER ||--o1 PAYMENT_TRANSACTION : settles
```

---

## Model Field Specifications

### 1. `User` (`apps.accounts.models.User`)
- `id`: UUID (Primary Key)
- `email`: EmailField (Unique, Username Field)
- `role`: CharField (`CUSTOMER`, `ADMIN`, `STAFF`)
- `phone`: CharField
- `avatar`: ImageField
- `is_active`: BooleanField
- `created_at`, `updated_at`: DateTimeField

### 2. `Product` (`apps.products.models.Product`)
- `id`: UUID (Primary Key)
- `name`: CharField (Indexed)
- `slug`: SlugField (Unique, Indexed)
- `brand`: ForeignKey to `Brand`
- `category`: ForeignKey to `Category`
- `subcategory`: ForeignKey to `Subcategory`
- `price`: DecimalField (10, 2)
- `discount_price`: DecimalField (10, 2)
- `sku`: CharField (Unique, Indexed)
- `stock_quantity`: PositiveIntegerField
- `rating`: DecimalField (3, 2)
- `review_count`: PositiveIntegerField

### 3. `Order` (`apps.orders.models.Order`)
- `id`: UUID (Primary Key)
- `order_number`: CharField (Unique e.g. `AD-2026-XXXXX`)
- `user`: ForeignKey to `User`
- `status`: CharField (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
- `payment_status`: CharField (`PENDING`, `PAID`, `FAILED`)
- Address snapshots: `shipping_full_name`, `shipping_phone`, `shipping_address_line_1`, `shipping_city`, `shipping_state`, `shipping_postal_code`, `shipping_country`
- Totals: `subtotal`, `discount_amount`, `coupon_code`, `shipping_fee`, `tax_amount`, `grand_total`
