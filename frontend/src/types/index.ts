export type Role = 'CUSTOMER' | 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: Role;
  avatar?: string;
  date_of_birth?: string;
  created_at: string;
}

export interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: Subcategory[];
  product_count?: number;
}

export interface Subcategory {
  id: string;
  category: string;
  category_name?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface ProductImage {
  id: string;
  image: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  size?: string;
  color?: string;
  price?: string;
  discount_price?: string;
  effective_price: string;
  stock_quantity: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: Brand;
  category: string | Category;
  category_name?: string;
  subcategory?: Subcategory;
  short_description?: string;
  description: string;
  price: string;
  discount_price?: string;
  effective_price: string;
  discount_percentage: number;
  sku: string;
  stock_quantity: number;
  in_stock: boolean;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  primary_image?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  product_id?: string;
  variant?: ProductVariant;
  variant_id?: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  created_at: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_items: number;
  subtotal: string;
  shipping_fee: number;
  grand_total: number;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  created_at: string;
}

export interface Wishlist {
  id: string;
  items: WishlistItem[];
  total_items: number;
}

export interface Coupon {
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: string;
  discount_amount?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'UPI' | 'NETBANKING' | 'COD' | 'MOCK';

export interface OrderItem {
  id: string;
  product?: string;
  product_name: string;
  variant_name?: string;
  product_sku: string;
  unit_price: string;
  quantity: number;
  total_price: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_address_line_1: string;
  shipping_address_line_2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: string;
  discount_amount: string;
  coupon_code?: string;
  shipping_fee: string;
  tax_amount: string;
  grand_total: string;
  items: OrderItem[];
  created_at: string;
}

export interface Review {
  id: string;
  product: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface AnalyticsData {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  total_customers: number;
  total_products: number;
  low_stock_alerts: Array<{ id: string; name: string; sku: string; stock_quantity: number }>;
  recent_orders: Array<{ id: string; order_number: string; shipping_full_name: string; grand_total: string; status: OrderStatus; created_at: string }>;
  top_products: Array<{ product_name: string; total_sold: number; total_revenue: string }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total_pages: number;
  current_page: number;
  next?: string;
  previous?: string;
  results: T[];
}
