import { useContext } from 'react';
import { CheckoutContext } from '@/contexts/checkout-context';

export function useCheckout() {
	const context = useContext(CheckoutContext);
	if (!context) {
		throw new Error('useCheckout must be used within a CheckoutProvider');
	}
	return context;
}
