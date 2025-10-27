'use client';

import {
	createContext,
	useCallback,
	useEffect,
	useState,
	useTransition,
} from 'react';
import { createOrderAction } from '@/actions/order/create-order-action';
import { deleteItemOrderAction } from '@/actions/order/delete-item-order-action';
import { getOrderAction } from '@/actions/order/get-order-action';
import type { CreateOrderResponse } from '@/services/create-order';
import type { DeleteOrderResponse } from '@/services/delete-item-order';
import type { Order } from '@/types/order';
import { delay } from '@/utils/delay';

interface CheckoutContextType {
	order: Order | null;
	totalItens: number;
	loading: boolean;
	initialLoading: boolean;
	addProductOrder: (
		productId: number,
		quantity?: number,
	) => Promise<CreateOrderResponse>;
	deleteItemOrder: (value: {
		itemId: number;
		quantity?: number;
	}) => Promise<DeleteOrderResponse>;
	refreshOrder: () => Promise<void>;
}

export const CheckoutContext = createContext({} as CheckoutContextType);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, startTransition] = useTransition();
	const [initialLoading, setInitialLoading] = useState(true);

	const totalItens =
		order?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

	const refreshOrder = useCallback(async () => {
		startTransition(async () => {
			await delay();
			const orderResponse = await getOrderAction();

			if ('success' in orderResponse && orderResponse.success === false) {
				setOrder(null);
			} else {
				setOrder(orderResponse as Order);
			}

			if (initialLoading) {
				setInitialLoading(false);
			}
		});
	}, [initialLoading]);

	useEffect(() => {
		refreshOrder();
	}, [refreshOrder]);

	async function addProductOrder(
		productId: number,
		quantity: number = 1,
	): Promise<CreateOrderResponse> {
		const createOrderResponse = await createOrderAction({
			productId,
			quantity,
		});

		if (createOrderResponse.success) {
			await refreshOrder();
		}

		return createOrderResponse;
	}

	async function deleteItemOrder({
		itemId,
		quantity,
	}: {
		itemId: number;
		quantity?: number;
	}): Promise<DeleteOrderResponse> {
		const deleteItemOrderResponse = await deleteItemOrderAction({
			itemId,
			quantity,
		});

		if (deleteItemOrderResponse.success) {
			await refreshOrder();
		}

		return deleteItemOrderResponse;
	}

	return (
		<CheckoutContext.Provider
			value={{
				order,
				totalItens,
				loading,
				initialLoading,
				addProductOrder,
				deleteItemOrder,
				refreshOrder,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	);
}
