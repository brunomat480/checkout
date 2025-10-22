import { Text } from '@/components/text';

interface CheckoutStepsProps {
	step: 'pending' | 'processing' | 'paid';
}

export function CheckoutSteps({ step = 'paid' }: CheckoutStepsProps) {
	return (
		<div className="flex items-center md:gap-8 gap-6 max-w-2xl mx-auto">
			<div className="w-full">
				<Text
					variant="sm"
					className="font-medium"
				>
					Carrinho
				</Text>
				<div className="bg-foreground w-full h-1 rounded-full">
					<div
						className={`h-1 rounded-full bg-primary ${step === 'pending' ? 'w-full' : 'w-0'}`}
					/>
				</div>
			</div>

			<div className="w-full">
				<Text
					variant="sm"
					className="font-medium"
				>
					Pagamento
				</Text>
				<div className="bg-foreground w-full h-1 rounded-full">
					<div
						className={`h-1 rounded-full bg-primary ${step === 'processing' ? 'w-full' : 'w-0'}`}
					/>
				</div>
			</div>

			<div className="w-full">
				<Text
					variant="sm"
					className="font-medium"
				>
					Finalização
				</Text>
				<div className="bg-foreground w-full h-1 rounded-full">
					<div
						className={`h-1 rounded-full bg-primary ${step === 'paid' ? 'w-full' : 'w-0'}`}
					/>
				</div>
			</div>
		</div>
	);
}
