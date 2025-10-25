'use server';

import { HTTPError } from 'ky';
import { deleteItemOrder } from '@/services/delete-item-order';

interface DeleteItemOrder {
	itemId: number;
	quantity?: number;
}

interface DeleteItemOrderResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export async function deleteItemOrderAction({
	itemId,
	quantity,
}: DeleteItemOrder): Promise<DeleteItemOrderResponse> {
	try {
		const response = await deleteItemOrder({
			itemId,
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
				error: errBody?.error || 'Erro ao deletar item.',
			};
		}

		return {
			success: false,
			error: 'Erro inesperado ao deletar item.',
		};
	}
}
