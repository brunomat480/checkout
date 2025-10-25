import { cookies } from 'next/headers';
import { api } from '@/lib/api';

interface CreateOrder {
	productId: number;
	quantity?: number;
}

export interface CreateOrderResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export async function createOrder({
	productId,
	quantity = 1,
}: CreateOrder): Promise<CreateOrderResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value || '';

	const response: CreateOrderResponse = await api
		.post('order', {
			headers: {
				authorization: `Bearer ${token}`,
			},
			json: {
				productId,
				quantity,
			},
		})
		.json();

	return response;
}
