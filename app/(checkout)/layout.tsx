import type { ReactNode } from 'react';
import { CheckoutSteps } from '@/app/(checkout)/_components/checkout-steps';
import { GoBackButton } from '@/components/go-back-button';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
	return (
		<div className="container mx-auto pt-10">
			<GoBackButton />
			<CheckoutSteps />

			{children}
		</div>
	);
}
