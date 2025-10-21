import type { ReactNode } from 'react';
import { Header } from '@/components/header';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div>
			<Header />
			<div className="container mx-auto">{children}</div>
		</div>
	);
}
