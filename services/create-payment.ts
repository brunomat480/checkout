import { cookies } from 'next/headers';
import { api } from '@/lib/api';

interface CreatePayment {
	orderId: number;
	type: 'pix' | 'bank_slip' | 'credit_card';
	card?: {
		credit_card: string;
		name: string;
		month: string;
		year: string;
		cvv: string;
		installments: number;
	};
}

export interface CreatePaymentResponse {
	success: boolean;
	payment?: {
		id: number;
		type: string;
		status: string;
		amount: number;
		pix_code?: string;
		qr_code?: string;
		qr_code_image?: string;
		bank_slip_code?: string;
		bank_slip_url?: string;
		barcode_image?: string;
		card_last_four?: string;
		card_brand?: string;
		installments?: number;
		paid_at?: string;
		transaction_id?: string;
		expires_at?: string;
		expires_in?: string;
		created_at: string;
	};
	message?: string;
	error?: string;
}

export async function createPayment({
	orderId,
	type,
	card,
}: CreatePayment): Promise<CreatePaymentResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value || '';

	let body: {
		orderId: number;
		type: 'pix' | 'bank_slip' | 'credit_card';
		card?: {
			credit_card: string;
			name: string;
			month: string;
			year: string;
			cvv: string;
			installments: number;
		};
	};

	if (type === 'credit_card') {
		if (!card) {
			throw new Error(
				'Dados do cartão são obrigatórios para pagamento com cartão',
			);
		}
		body = {
			orderId,
			type,
			card,
		};
	} else {
		body = {
			orderId,
			type,
		};
	}

	const response: CreatePaymentResponse = await api
		.post('payments', {
			headers: {
				authorization: `Bearer ${token}`,
			},
			json: body,
		})
		.json();
	console.log('SERVICE', response);
	return response;
}
