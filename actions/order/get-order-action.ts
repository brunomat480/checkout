'use server';

import { HTTPError } from 'ky';
import { getOrder } from '@/services/get-order';
import type { Order } from '@/types/order';

export async function getOrderAction(): Promise<
	Order | { success: boolean; error: string }
> {
	try {
		const response = await getOrder();
		return response.order;
	} catch (error) {
		if (error instanceof HTTPError) {
			const errBody = await error.response.json();

			return {
				success: false,
				error: errBody?.error || 'Erro ao buscar itens.',
			};
		}

		return {
			success: false,
			error: 'Erro inesperado ao buscar itens.',
		};
	}
}
