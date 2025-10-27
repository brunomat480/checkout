'use client';

import { Barcode, CreditCard, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Text } from '@/components/text';

interface PaymentButtonsProps {
	paymentMethod: 'pix' | 'credit_card' | 'bank_slip';
}

export function PaymentButtons({ paymentMethod = 'pix' }: PaymentButtonsProps) {
	const paymentMethods = [
		{
			method: 'pix',
			label: 'Pix',
			icon: QrCode,
		},
		{
			method: 'credit_card',
			label: 'Cartão de Crédito',
			icon: CreditCard,
		},
		{
			method: 'bank_slip',
			label: 'Boleto',
			icon: Barcode,
		},
	];

	return (
		<div className="flex items-center justify-center gap-4 flex-wrap lg:flex-nowrap">
			{paymentMethods.map((method) => {
				const isActive = paymentMethod === method.method;

				return (
					<Link
						key={method.method}
						href={`/resume/payment?method=${method.method}`}
						scroll={false}
						className={`
              relative flex items-center justify-center gap-3 w-full lg:w-72 px-6 py-4 text-base font-medium rounded-md border-2 transition-all duration-300 hover:shadow-lg group overflow-hidden
              ${
								isActive
									? 'bg-primary text-white border-transparent shadow-md'
									: 'bg-transparent text-gray-700 border-gray-200 hover:border-primary hover:shadow-md'
							}
              ${isActive ? 'cursor-default' : 'cursor-pointer'}
            `}
					>
						{isActive && <div className="absolute inset-0 bg-primary " />}

						<div
							className={`
              relative transition-all duration-300 group-hover:scale-110
              ${isActive ? 'text-white scale-110' : 'text-gray-600 group-hover:text-primary'}
            `}
						>
							<method.icon className="text-foreground w-6 h-6" />

							{isActive && (
								<div className="absolute inset-0 w-6 h-6 bg-primary rounded-full animate-ping opacity-20" />
							)}
						</div>

						<Text className="relative">{method.label}</Text>

						{isActive && (
							<div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
								<div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
							</div>
						)}
					</Link>
				);
			})}
		</div>
	);
}
