import { cookies } from 'next/headers';
import { api } from '@/lib/api';

interface DeleteOrder {
	itemId: number;
	quantity?: number;
}

export interface DeleteOrderResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export async function deleteItemOrder({
	itemId,
	quantity = 0,
}: DeleteOrder): Promise<DeleteOrderResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value || '';

	const searchParams: Record<string, string> = {
		itemId: itemId.toString(),
	};

	if (quantity > 0) {
		searchParams.quantity = quantity.toString();
	}

	const response: DeleteOrderResponse = await api
		.delete('order', {
			headers: {
				authorization: `Bearer ${token}`,
			},
			searchParams: searchParams,
		})
		.json();

	return response;
}
