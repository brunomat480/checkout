'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function GoBackButton() {
	const router = useRouter();

	function handleGoback() {
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
