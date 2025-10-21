import type { ReactNode } from 'react';
import { Header } from '@/components/header';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			<div>{children}</div>
		</>
	);
}
