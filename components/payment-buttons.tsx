import { Barcode, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { PixIcon } from '@/assets/icons/pix';
import { Button } from '@/components/ui/button';

interface PaymentButtonsProps {
	paymentMethod: 'pix' | 'credit_card' | 'bank_slip' | undefined;
}

export function PaymentButtons({ paymentMethod }: PaymentButtonsProps) {
	return (
		<div className="flex items-center justify-center gap-4 flex-wrap lg:flex-nowrap">
			<Button
				asChild
				size="xl"
				variant={paymentMethod === 'pix' ? 'default' : 'outline'}
				disabled={paymentMethod === 'pix'}
				className="w-full lg:w-72 text-base font-medium hover:text-white group"
			>
				<Link
					href="/resume/payment?method=pix"
					scroll={false}
				>
					<PixIcon className="fill-foreground size-6 " />
					Pix
				</Link>
			</Button>

			<Button
				asChild
				size="xl"
				variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
				disabled={paymentMethod === 'credit_card'}
				className="w-full lg:w-72 text-base font-medium hover:text-white"
			>
				<Link
					href="/resume/payment?method=credit_card"
					scroll={false}
				>
					<CreditCard className="size-6" />
					Cartão de Crédito
				</Link>
			</Button>

			<Button
				asChild
				size="xl"
				variant={paymentMethod === 'bank_slip' ? 'default' : 'outline'}
				disabled={paymentMethod === 'bank_slip'}
				className="w-full lg:w-72 text-base font-medium hover:text-white"
			>
				<Link
					href="/resume/payment?method=bank_slip"
					scroll={false}
				>
					<Barcode className="size-6" />
					Boleto
				</Link>
			</Button>
		</div>
	);
}
