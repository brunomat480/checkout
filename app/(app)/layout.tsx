import type { ReactNode } from 'react';
import { Header } from '@/components/header';

export default function AppLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			<div>{children}</div>
		</>
	);
}
