import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BankSlipPayment } from '@/components/bank-slip-payment';
import { CheckoutSteps } from '@/components/checkout-steps';
import { CreditCardPayment } from '@/components/credit-card-payment';
import { PaymentButtons } from '@/components/payment-buttons';
import { PixPayment } from '@/components/pix-payment';

export const metadata: Metadata = {
	title: 'Pagamento',
};

interface PaymentSearchParams {
	method?: 'pix' | 'credit_card' | 'bank_slip';
	[key: string]: string | string[] | undefined;
}

export default async function PaymentPage({
	searchParams,
}: {
	searchParams: Promise<PaymentSearchParams>;
}) {
	const { method } = await searchParams;

	if (!method) {
		redirect('/resume/payment?method=pix');
	}

	return (
		<div className="min-h-screen pb-4">
			<CheckoutSteps step="processing" />

			<div className="mt-14">
				<PaymentButtons paymentMethod={method} />
			</div>

			<div className="mt-10">
				{method === 'pix' && <PixPayment />}
				{method === 'credit_card' && <CreditCardPayment />}
				{method === 'bank_slip' && <BankSlipPayment />}
			</div>
		</div>
	);
}
