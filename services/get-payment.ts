import { cookies } from 'next/headers';
import { api } from '@/lib/api';
import type { Payment } from '@/types/payment';

export interface PaymentResponse {
	success: boolean;
	payment: Payment;
}

export async function getPayment(paymentId: string): Promise<Payment> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value || '';

	const response: PaymentResponse = await api
		.get(`payments/${paymentId}`, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.json();

	return response.payment;
}
