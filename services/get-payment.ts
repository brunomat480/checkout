import { cookies } from 'next/headers';
import { api } from '@/lib/api';

export interface PaymentResponse {
	success: boolean;
	payment: Payment;
}

export interface Payment {
	id: number;
	orderId: number;
	userId: number;
	paymentMethod: string;
	paymentStatus: string;
	amount: number;
	installments?: number;
	createdAt: string;
	updatedAt: string;
	expiresAt?: string;
	paidAt?: string;
	refundedAt?: string;
	externalId?: string;
	failureReason?: string;
	order: {
		id: number;
		orderNumber: string;
		status: string;
		totalAmount: number;
		createdAt: string;
	};
	user?: {
		id: number;
		name: string;
		email: string;
	};
	pix?: {
		code: string;
		qrCode: string;
		qrCodeImage: string;
	};
	bankSlip?: {
		code: string;
		url: string;
		barcodeImage: string;
	};
	creditCard?: {
		lastFour: string;
		brand: string;
		installments: number;
	};
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
