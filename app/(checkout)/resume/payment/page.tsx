import { BankSlipPayment } from '@/components/bank-slip-payment';
import { CreditCardPayment } from '@/components/credit-card-payment';
import { PaymentButtons } from '@/components/payment-buttons';
import { PixPayment } from '@/components/pix-payment';

export default function PaymentPage() {
	return (
		<div>
			<PaymentButtons paymentMethod="pix" />

			<div className="mt-10">
				{/* <PixPayment /> */}
				{/* <BankSlipPayment /> */}
				<CreditCardPayment />
			</div>
		</div>
	);
}
