// import { CheckoutSteps } from '@/components/checkout-steps';
// import { ProductCardResume } from '@/components/product-card-resume';

// export default function PageResume() {
// 	return (
// 		<div>
// 			<CheckoutSteps step="pending" />

// 			<div className="mt-12">
// 				<div className="bg-card rounded-lg border border-border p-6 max-w-xl">
// 					<ProductCardResume />
// 					<ProductCardResume />
// 					<ProductCardResume />
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

import { CircleCheck, Lock } from 'lucide-react';
import { CheckoutSteps } from '@/components/checkout-steps';
import { ProductCardResume } from '@/components/product-card-resume';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Home() {
	return (
		<main className="min-h-screen bg-background p-8">
			<div className="max-w-7xl mx-auto">
				<CheckoutSteps step="pending" />

				<Text
					as="h1"
					variant="xl"
					className="font-bold mb-4 mt-12 "
				>
					Seus Itens
				</Text>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="rounded-lg border border-border p-6">
							<ProductCardResume />
							<ProductCardResume />
							<ProductCardResume />
						</div>
					</div>

					<Card className="sticky top-6 h-max">
						<CardHeader>
							<CardTitle>Resumo do Pedido</CardTitle>
						</CardHeader>

						<CardContent>
							<div className="space-y-4">
								{/* Subtotal */}
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Subtotal</span>
									<span className="font-medium text-foreground">R$ 599,40</span>
								</div>

								{/* Frete */}
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Frete</span>
									<span className="font-medium text-foreground">R$ 15,00</span>
								</div>

								{/* Desconto */}
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Desconto</span>
									<span className="font-medium text-green-600">- R$ 30,00</span>
								</div>

								<Separator />

								{/* Total */}
								<div className="flex items-center justify-between">
									<span className="text-base font-bold text-foreground">
										Total
									</span>
									<span className="text-xl font-bold text-foreground">
										R$ 584,40
									</span>
								</div>
							</div>

							{/* Botão de Finalizar */}
							<Button
								className="w-full mt-6"
								size="lg"
							>
								Finalizar Compra
							</Button>

							{/* Informações Adicionais */}
							<div className="mt-6 space-y-2">
								<div className="flex items-start gap-2 text-xs text-muted-foreground">
									<CircleCheck className="size-4" />
									<span>Frete grátis acima de R$ 200</span>
								</div>
								<div className="flex items-start gap-2 text-xs text-muted-foreground">
									<Lock className="size-4" />
									<span>Compra 100% segura</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
