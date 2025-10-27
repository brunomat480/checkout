import { cookies } from 'next/headers';
import { api } from '@/lib/api';
import type { Order } from '@/types/order';

export interface OrderResponse {
	success: boolean;
	order: Order;
	message: string;
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
