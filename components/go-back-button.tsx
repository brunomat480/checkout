'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function GoBackButton() {
	const path = usePathname();
	const router = useRouter();

	if (path.startsWith('/resume/payment/success/')) {
		return null;
	}

	function handleGoback() {
		if (path === '/resume/payment') {
			router.push('/resume');
			return;
		}

		if (path === '/resume') {
			router.push('/');
			return;
		}

		router.back();
	}

	return (
		<Button
			variant="ghost"
			onClick={handleGoback}
		>
			<ChevronLeft />
			Voltar
		</Button>
	);
}
