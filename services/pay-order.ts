import { cookies } from 'next/headers';
import { api } from '@/lib/api';

export interface PayOrderResponse {
	success: boolean;
	message?: string;
	order?: {
		id: number;
		orderNumber: string;
		status: string;
		totalAmount: number;
		updatedAt: string;
	};
	payment?: {
		id: number;
		status: string;
		amount: number;
		paidAt: string;
		paymentMethod: string;
	};
	error?: string;
}

export async function payOrder(orderId: number): Promise<PayOrderResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value || '';

	const response: PayOrderResponse = await api
		.put(`payments/${orderId}`, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.json();

	return response;
}
