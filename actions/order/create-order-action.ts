'use server';

import { HTTPError } from 'ky';
import { createOrder } from '@/services/create-order';

interface CreateOrder {
	productId: number;
	quantity?: number;
}

interface CreateOrderResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export async function createOrderAction({
	productId,
	quantity,
}: CreateOrder): Promise<CreateOrderResponse> {
	try {
		const response = await createOrder({
			productId,
			quantity,
		});

		return {
			success: true,
			message: response.message,
		};
	} catch (error) {
		if (error instanceof HTTPError) {
			const errBody = await error.response.json();

			return {
				success: false,
				error: errBody?.error || 'Erro ao adicionar item.',
			};
		}

		return {
			success: false,
			error: 'Erro inesperado ao adicionar item.',
		};
	}
}
