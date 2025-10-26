import { HTTPError } from 'ky';
import { Calendar, CheckCircle, CreditCard, Package } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckoutSteps } from '@/components/checkout-steps';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPayment, type Payment } from '@/services/get-payment';
import { delay } from '@/utils/delay';
import { formatPrice } from '@/utils/format-price';

export const metadata: Metadata = {
	title: 'Pagamento realizado',
};

export default async function SuccessPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	let payment: Payment | null = null;
	try {
		await delay();
		const paymentResponse = await getPayment(id);
		payment = paymentResponse;
	} catch (error) {
		if (error instanceof HTTPError) {
			if (error.response.status === 404) {
				notFound();
			}
			payment = null;
		}
		payment = null;
	}

	const dateFormatter = new Intl.DateTimeFormat('pt-BR');

	return (
		<main className="min-h-screen bg-background p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				<CheckoutSteps step="paid" />

				<div className="flex justify-center">
					<Card className="max-w-2xl w-full">
						<CardHeader className="text-center pb-6">
							<div className="flex justify-center mb-4">
								<div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
									<CheckCircle className="h-16 w-16 text-green-600 dark:text-green-500" />
								</div>
							</div>
							<Text
								as="h1"
								variant="xl"
								className="text-balance"
							>
								Pagamento confirmado!
							</Text>
							<Text
								as="p"
								className="mt-2"
							>
								Seu pedido foi recebido e está sendo processado
							</Text>
						</CardHeader>

						<CardContent className="space-y-6">
							<div className="bg-muted/50 rounded-lg p-6 space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Package className="h-5 w-5 text-muted-foreground" />
										<Text variant="sm">Número do pedido</Text>
									</div>
									<span className="font-semibold">{payment?.id}</span>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Calendar className="h-5 w-5 text-muted-foreground" />
										<Text variant="sm">Data do pedido</Text>
									</div>
									<span className="font-semibold">
										{payment?.createdAt
											? dateFormatter.format(new Date(payment.createdAt))
											: 'Data não disponível'}
									</span>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<CreditCard className="h-5 w-5 text-muted-foreground" />
										<Text variant="sm">Método de pagamento</Text>
									</div>
									<Text>{payment?.paymentMethod}</Text>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<Text variant="sm">Total pago</Text>
									<Text
										variant="xl"
										className="text-primary"
									>
										{formatPrice(payment?.amount || 0)}
									</Text>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 pt-4">
								<Button
									asChild
									variant="outline"
									className="flex-1 bg-transparent"
									size="lg"
								>
									<Link href="/">Voltar para início</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
