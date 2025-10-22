import { Barcode, CreditCard } from 'lucide-react';
import { PixIcon } from '@/assets/icons/pix';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';

interface PaymentButtonsProps {
	paymentMethod: 'pix' | 'credit-card' | 'bank-slip';
}

export function PaymentButtons({ paymentMethod }: PaymentButtonsProps) {
	return (
		<div className="flex items-center justify-center gap-4 flex-wrap lg:flex-nowrap">
			<Button
				size="xl"
				variant={paymentMethod === 'pix' ? 'default' : 'outline'}
				disabled={paymentMethod === 'pix'}
				className="w-full lg:w-72"
			>
				<PixIcon className="fill-foreground size-6" />
				<Text>Pix</Text>
			</Button>

			<Button
				size="xl"
				variant={paymentMethod === 'credit-card' ? 'default' : 'outline'}
				disabled={paymentMethod === 'credit-card'}
				className="w-full lg:w-72 "
			>
				<CreditCard className="size-6" />
				<Text>Cartão de Crédito</Text>
			</Button>

			<Button
				size="xl"
				variant={paymentMethod === 'bank-slip' ? 'default' : 'outline'}
				disabled={paymentMethod === 'bank-slip'}
				className="w-full lg:w-72 "
			>
				<Barcode className="size-6" />
				<Text>Boleto</Text>
			</Button>
		</div>
	);
}
