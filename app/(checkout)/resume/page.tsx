import { CheckoutSteps } from '@/components/checkout-steps';
import { ProductCardResume } from '@/components/product-card-resume';

export default function PageResume() {
	return (
		<div>
			<CheckoutSteps step="pending" />

			<div className="mt-12">
				<div className="bg-card rounded-lg border border-border p-6 max-w-xl">
					<ProductCardResume />
					<ProductCardResume />
					<ProductCardResume />
				</div>
			</div>
		</div>
	);
}
