'use client';

import { createContext, useEffect, useState, useTransition } from 'react';
import { getOrderAction } from '@/actions/order/get-order-action';
import type { Order } from '@/services/get-order';
import { delay } from '@/utils/delay';

type CheckoutContextType = {
	order: Order | null;
	totalItens: number;
	loading: boolean;
};

export const CheckoutContext = createContext({} as CheckoutContextType);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, startTransition] = useTransition();

	const totalItens =
		order?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

	useEffect(() => {
		async function fecthOrder() {
			startTransition(async () => {
				await delay();
				const orderResponse = await getOrderAction();

				if ('success' in orderResponse && orderResponse.success === false) {
					setOrder(null);
				} else {
					setOrder(orderResponse as Order);
				}
			});
		}

		fecthOrder();
	}, []);

	return (
		<CheckoutContext.Provider value={{ order, totalItens, loading }}>
			{children}
		</CheckoutContext.Provider>
	);
}
