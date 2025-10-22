import type { ReactNode } from 'react';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
	return <div className="container mx-auto pt-10">{children}</div>;
}
