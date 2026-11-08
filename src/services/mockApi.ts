import type { ApiResponse, Customer, Order, PaginationMeta } from '@/types';
import type { ApiClient } from './api';
import { ApiError } from './errors';
import { mockCustomer, mockOrders, mockProducts } from './mockData';

const LATENCY_MS = 350;

/** Resolves after a short delay, but rejects immediately if the caller aborts. */
function delay(signal?: AbortSignal): Promise<void> {
    const aborted = () => new ApiError('Request cancelled.', { kind: 'aborted' });
    return new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(aborted());
        const timer = setTimeout(resolve, LATENCY_MS);
        signal?.addEventListener(
            'abort',
            () => {
                clearTimeout(timer);
                reject(aborted());
            },
            { once: true },
        );
    });
}

/** Wraps data in the same envelope the PHP API returns. */
const ok = <T>(data: T, meta?: PaginationMeta): ApiResponse<T> => ({ success: true, data, meta });

// Kept in memory so a checkout shows up in the account page's order history.
let orders: Order[] = [...mockOrders];
let currentCustomer: Customer = { ...mockCustomer };

export const mockApi: ApiClient = {
    getProducts: async (query = {}, signal) => {
        await delay(signal);
        const term = query.search?.trim().toLowerCase();

        let list = mockProducts.filter(
            (p) =>
                (!query.category || query.category === 'all' || p.category === query.category) &&
                (!query.featured || p.isFeatured) &&
                (!query.deal || p.isDeal) &&
                (!term || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(term)),
        );
        if (query.limit) list = list.slice(0, query.limit);

        return ok(list, { page: 1, perPage: list.length, total: list.length });
    },

    getProduct: async (id, signal) => {
        await delay(signal);
        const product = mockProducts.find((p) => p.id === id);
        if (!product) throw new ApiError('Product not found.', { status: 404 });
        return ok(product);
    },

    getProfile: async (signal) => {
        await delay(signal);
        return ok(currentCustomer);
    },

    getOrders: async (signal) => {
        await delay(signal);
        return ok(orders);
    },

    login: async (payload, signal) => {
        await delay(signal);
        if (!payload.email || !payload.password) {
            throw new ApiError('Email and password are required.', { status: 422 });
        }
        if (payload.password.length < 4) {
            throw new ApiError('Invalid email or password.', { status: 401 });
        }
        // If email matches current customer, use it, otherwise customize profile name from email
        if (payload.email.toLowerCase() !== currentCustomer.email.toLowerCase()) {
            const namePart = payload.email.split('@')[0] || 'User';
            currentCustomer = {
                ...currentCustomer,
                id: 1002,
                firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
                lastName: '',
                email: payload.email,
            };
        }
        return ok({ customer: currentCustomer, token: 'mock-auth-token-123' });
    },

    register: async (payload, signal) => {
        await delay(signal);
        if (!payload.email || !payload.password || !payload.firstName) {
            throw new ApiError('Please complete all required fields.', { status: 422 });
        }
        if (payload.password.length < 6) {
            throw new ApiError('Password must be at least 6 characters long.', { status: 422 });
        }
        const newCustomer: Customer = {
            id: Date.now(),
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
            email: payload.email.trim().toLowerCase(),
            phone: payload.phone?.trim() || null,
            memberSince: new Date().toISOString(),
            addresses: [],
        };
        currentCustomer = newCustomer;
        return ok({ customer: newCustomer, token: 'mock-auth-token-' + Date.now() });
    },

    logout: async (signal) => {
        await delay(signal);
        return ok(undefined as unknown as void);
    },

    checkout: async (payload, signal) => {
        await delay(signal);
        if (payload.items.length === 0) {
            throw new ApiError('Your cart is empty.', { status: 422 });
        }

        // Re-check price and stock on the "server": never trust prices sent by the client.
        const items = payload.items.map(({ productId, quantity }) => {
            const product = mockProducts.find((p) => p.id === productId);
            if (!product) {
                throw new ApiError(`Product #${productId} is no longer available.`, { status: 422 });
            }
            if (product.stock < quantity) {
                throw new ApiError(`Only ${product.stock} of “${product.name}” left in stock.`, {
                    status: 409,
                });
            }
            return { productId, name: product.name, quantity, unitPrice: product.price };
        });

        const id = Math.max(...orders.map((o) => o.id)) + 1;
        const order: Order = {
            id,
            orderNumber: `BRIO-${id}`,
            createdAt: new Date().toISOString(),
            status: 'processing',
            items,
            total: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
        };
        orders = [order, ...orders];
        return ok(order);
    },
};