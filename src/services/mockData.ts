import type { Customer, Order, Product } from '@/types';

/**
 * Demo data used when VITE_USE_MOCK=true so the storefront runs without the PHP backend.
 * Shapes mirror the real API payloads exactly.
 * Product photos live in /public/products and are served from /products/...
 */

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Papaya Extract Body & Hands Lotion',
    slug: 'papaya-extract-body-hands-lotion',
    description:
      'Brightening, moisturizing body & hands lotion with papaya extract and vitamin E for smooth, soft and radiant skin. 250 ml.',
    category: 'bath-body',
    price: 1450,
    compareAtPrice: 1800,
    image: '/products/body_lotion.jpeg',
    rating: 4.8,
    reviewCount: 126,
    stock: 40,
    isFeatured: true,
    isDeal: true,
    badge: 'Best seller',
  },
  {
    id: 2,
    name: 'Cucumber & Aloe Vera Face Cream SPF 30',
    slug: 'cucumber-aloe-vera-face-cream-spf-30',
    description: 'Hydrating, brightening and anti-aging organic face cream with SPF 30. 50 ml.',
    category: 'skin-care',
    price: 2200,
    compareAtPrice: 2800,
    image: '/products/face_cream.jpeg',
    rating: 4.7,
    reviewCount: 98,
    stock: 8,
    isFeatured: true,
    isDeal: true,
    badge: '20% off',
  },
  {
    id: 3,
    name: 'Organic Shower Gel, Cucumber & Aloe Vera',
    slug: 'organic-shower-gel-cucumber-aloe-vera',
    description:
      'Cleanses, hydrates and refreshes. Gentle cleansing and deep hydration for all skin types. 300 ml.',
    category: 'bath-body',
    price: 1150,
    compareAtPrice: 1400,
    image: '/products/showergel.jpeg',
    rating: 4.6,
    reviewCount: 74,
    stock: 55,
    isFeatured: true,
    isDeal: true,
    badge: 'Popular',
  },
  {
    id: 4,
    name: 'Vitamin C & E Serum',
    slug: 'vitamin-c-e-serum',
    description:
      'Brightening, hydrating and anti-aging serum that brightens skin tone, nourishes and fights free radicals. 30 ml.',
    category: 'skin-care',
    price: 2650,
    compareAtPrice: 3200,
    image: '/products/serum.jpeg',
    rating: 4.9,
    reviewCount: 212,
    stock: 24,
    isFeatured: true,
    isDeal: true,
    badge: 'New',
  },
];

export const mockCustomer: Customer = {
  id: 1001,
  firstName: 'Amani',
  lastName: 'Kariuki',
  email: 'amani.kariuki@example.com',
  phone: '+254 700 123 456',
  memberSince: '2024-03-14T09:00:00Z',
  addresses: [
    {
      id: 1,
      label: 'Home',
      recipient: 'Amani Kariuki',
      line1: '14 Mwanzi Road',
      line2: 'Apt 3B',
      city: 'Nairobi',
      region: 'Nairobi County',
      postalCode: '00100',
      country: 'Kenya',
      isDefault: true,
    },
    {
      id: 2,
      label: 'Office',
      recipient: 'Amani Kariuki',
      line1: 'Westlands Business Park',
      line2: 'Floor 5',
      city: 'Nairobi',
      region: 'Nairobi County',
      postalCode: '00800',
      country: 'Kenya',
      isDefault: false,
    },
  ],
};

export const mockOrders: Order[] = [
  {
    id: 5003,
    orderNumber: 'BRIO-5003',
    createdAt: '2026-10-28T10:12:00Z',
    status: 'processing',
    total: 4850,
    items: [
      { productId: 4, name: 'Vitamin C & E Serum', quantity: 1, unitPrice: 2650 },
      { productId: 2, name: 'Cucumber & Aloe Vera Face Cream SPF 30', quantity: 1, unitPrice: 2200 },
    ],
  },
  {
    id: 4921,
    orderNumber: 'BRIO-4921',
    createdAt: '2026-09-17T15:40:00Z',
    status: 'completed',
    total: 3750,
    items: [
      { productId: 3, name: 'Organic Shower Gel, Cucumber & Aloe Vera', quantity: 2, unitPrice: 1150 },
      { productId: 1, name: 'Papaya Extract Body & Hands Lotion', quantity: 1, unitPrice: 1450 },
    ],
  },
  {
    id: 4807,
    orderNumber: 'BRIO-4807',
    createdAt: '2026-08-02T08:05:00Z',
    status: 'cancelled',
    total: 2200,
    items: [
      { productId: 2, name: 'Cucumber & Aloe Vera Face Cream SPF 30', quantity: 1, unitPrice: 2200 },
    ],
  },
  {
    id: 4650,
    orderNumber: 'BRIO-4650',
    createdAt: '2026-06-21T12:30:00Z',
    status: 'completed',
    total: 5550,
    items: [
      { productId: 4, name: 'Vitamin C & E Serum', quantity: 1, unitPrice: 2650 },
      { productId: 1, name: 'Papaya Extract Body & Hands Lotion', quantity: 2, unitPrice: 1450 },
    ],
  },
];
