'use client';

import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Text } from '@/components/text';

export function CheckoutSteps() {
	const path = usePathname();

	const steps = [
		{ pathName: '/resume', label: 'Produtos' },
		{ pathName: '/resume/payment', label: 'Pagamento' },
		{ pathName: '/resume/payment/success', label: 'Concluído' },
	];

	return (
		<div className="flex items-center md:gap-8 gap-6 max-w-2xl mx-auto mt-4">
			{steps.map((step) => {
				const isActive =
					step.pathName === '/resume/payment/success'
						? path.startsWith(step.pathName)
						: step.pathName === path;

				return (
					<div
						key={step.label}
						className="w-full"
					>
						<Text
							variant="small"
							className="font-medium"
						>
							{step.label}
						</Text>
						<div className="bg-muted-foreground w-full h-1 rounded-full">
							<div
								className={twMerge(
									'h-1 rounded-full bg-primary w-0 transition-all duration-500',
									isActive && 'w-full',
								)}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
