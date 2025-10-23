import type { ReactNode } from 'react';
import { GoBackButton } from '@/components/go-back-button';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
	return (
		<div className="container mx-auto pt-10">
			<GoBackButton />
			{children}
		</div>
	);
}
