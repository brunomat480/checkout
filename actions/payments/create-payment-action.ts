'use server';

import { HTTPError } from 'ky';
import {
	type CreatePaymentResponse,
	createPayment,
} from '@/services/create-payment';

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

export async function createPaymentAction({
	orderId,
	type,
	card,
}: CreatePayment): Promise<CreatePaymentResponse> {
	try {
		const response = await createPayment({
			orderId,
			type,
			card,
		});

		return response;
	} catch (error) {
		if (error instanceof HTTPError) {
			const errBody = await error.response.json();

			return {
				success: false,
				error: errBody?.error || 'Ocorreu um erro, tente novamente!',
			};
		}

		return {
			success: false,
			error: 'Ocorreu um erro, tente novamente!',
		};
	}
}
