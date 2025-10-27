import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BankSlipPayment } from '@/app/(checkout)/resume/payment/_components/bank-slip-payment';
import { CreditCardPayment } from '@/app/(checkout)/resume/payment/_components/credit-card-payment';
import { PaymentButtons } from '@/app/(checkout)/resume/payment/_components/payment-buttons';
import { PixPayment } from '@/app/(checkout)/resume/payment/_components/pix-payment';

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
