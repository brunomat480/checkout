import { cookies } from 'next/headers';
import { api } from '@/lib/api';
import type { Product } from '@/types/products';

export interface OrderResponse {
	success: boolean;
	order: Order;
	message: string;
}

export interface Order {
	id: number;
	userId: number;
	status: string;
	totalAmount: number;
	subtotal: number;
	shipping: number;
	discount: number;
	orderNumber: string;
	createdAt: string;
	updatedAt: string;
	items: OrderItem[];
}

export interface OrderItem {
	id: number;
	orderId: number;
	productId: number;
	quantity: number;
	price: number;
	createdAt: string;
	updatedAt: string;
	product: Product;
}

export async function getOrder(): Promise<OrderResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value || '';

	const response: OrderResponse = await api
		.get('order', {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.json();

	return response;
}
