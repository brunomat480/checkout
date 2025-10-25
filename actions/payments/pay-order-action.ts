'use server';

import { HTTPError } from 'ky';
import { type PayOrderResponse, payOrder } from '@/services/pay-order';

interface PayOrderAction {
	orderId: number;
}

export async function payOrderAction({
	orderId,
}: PayOrderAction): Promise<PayOrderResponse> {
	try {
		const response = await payOrder(orderId);

		return response;
	} catch (error) {
		if (error instanceof HTTPError) {
			const errBody = await error.response.json();

			return {
				success: false,
				error:
					errBody?.error ||
					'Ocorreu um erro ao processar o pagamento, tente novamente!',
			};
		}

		return {
			success: false,
			error: 'Ocorreu um erro ao processar o pagamento, tente novamente!',
		};
	}
}
