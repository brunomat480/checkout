// 'use client';

// import { createContext, useEffect, useState, useTransition } from 'react';
// import { createOrderAction } from '@/actions/order/create-order-action';
// import { deleteItemOrderAction } from '@/actions/order/delete-item-order-action';
// import { getOrderAction } from '@/actions/order/get-order-action';
// import type { CreateOrderResponse } from '@/services/create-order';
// import type { DeleteOrderResponse } from '@/services/delete-item-order';
// import type { Order } from '@/services/get-order';
// import { delay } from '@/utils/delay';

// type CheckoutContextType = {
// 	order: Order | null;
// 	totalItens: number;
// 	loading: boolean;
// 	addProductOrder: (
// 		productId: number,
// 		quantity?: number,
// 	) => Promise<CreateOrderResponse>;
// 	deleteItemOrder: (value: {
// 		itemId: number;
// 		quantity?: number;
// 	}) => Promise<DeleteOrderResponse>;
// };

// export const CheckoutContext = createContext({} as CheckoutContextType);

// export function CheckoutProvider({ children }: { children: React.ReactNode }) {
// 	const [order, setOrder] = useState<Order | null>(null);
// 	const [loading, startTransition] = useTransition();

// 	const totalItens =
// 		order?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

// 	useEffect(() => {
// 		async function fecthOrder() {
// 			startTransition(async () => {
// 				await delay();
// 				const orderResponse = await getOrderAction();

// 				if ('success' in orderResponse && orderResponse.success === false) {
// 					setOrder(null);
// 				} else {
// 					setOrder(orderResponse as Order);
// 				}
// 			});
// 		}

// 		fecthOrder();
// 	}, []);

// 	async function addProductOrder(
// 		productId: number,
// 		quantity: number = 1,
// 	): Promise<CreateOrderResponse> {
// 		const createOrderResponse = await createOrderAction({
// 			productId,
// 			quantity,
// 		});

// 		return createOrderResponse;
// 	}

// 	async function deleteItemOrder({
// 		itemId,
// 		quantity,
// 	}: {
// 		itemId: number;
// 		quantity?: number;
// 	}): Promise<DeleteOrderResponse> {
// 		const deleteItemOrderResponse = await deleteItemOrderAction({
// 			itemId,
// 			quantity,
// 		});

// 		return deleteItemOrderResponse;
// 	}

// 	return (
// 		<CheckoutContext.Provider
// 			value={{
// 				order,
// 				totalItens,
// 				loading,
// 				addProductOrder,
// 				deleteItemOrder,
// 			}}
// 		>
// 			{children}
// 		</CheckoutContext.Provider>
// 	);
// }

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
import type { Order } from '@/services/get-order';
import { delay } from '@/utils/delay';

type CheckoutContextType = {
	order: Order | null;
	totalItens: number;
	loading: boolean;
	addProductOrder: (
		productId: number,
		quantity?: number,
	) => Promise<CreateOrderResponse>;
	deleteItemOrder: (value: {
		itemId: number;
		quantity?: number;
	}) => Promise<DeleteOrderResponse>;
};

export const CheckoutContext = createContext({} as CheckoutContextType);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, startTransition] = useTransition();

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
		});
	}, []);

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
				addProductOrder,
				deleteItemOrder,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	);
}
