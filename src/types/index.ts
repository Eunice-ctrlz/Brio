/** Product categories exposed by the API (slug form). */
export type CategorySlug = 'skin-care' | 'bath-body';

export interface Category {
  slug: CategorySlug;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: CategorySlug;
  /** Current price in the store currency. */
  price: number;
  /** Original price when the item is discounted. */
  compareAtPrice: number | null;
  image: string;
  /** 0 – 5, may be fractional. */
  rating: number;
  reviewCount: number;
  /** Units available. 0 = out of stock. */
  stock: number;
  isFeatured: boolean;
  isDeal: boolean;
  badge: string | null;
}

/** A line in the cart. Product fields are snapshotted so the cart renders offline. */
export interface CartItem {
  productId: number;
  name: string;
  category: CategorySlug;
  price: number;
  image: string;
  quantity: number;
  /** Stock ceiling captured when the item was added. */
  maxQuantity: number;
}

export type OrderStatus = 'processing' | 'completed' | 'cancelled';

export interface OrderLine {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  /** ISO 8601 timestamp. */
  createdAt: string;
  status: OrderStatus;
  items: OrderLine[];
  total: number;
}

export interface Address {
  id: number;
  label: string;
  recipient: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  /** ISO 8601 timestamp. */
  memberSince: string;
  addresses: Address[];
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
}

/** Envelope returned by every endpoint of the PHP API. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  /** Field-level validation errors (HTTP 422). */
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface ProductQuery {
  category?: CategorySlug | 'all';
  search?: string;
  featured?: boolean;
  deal?: boolean;
  limit?: number;
}

export interface CheckoutPayload {
  items: Array<{ productId: number; quantity: number }>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  customer: Customer;
  token?: string;
}


