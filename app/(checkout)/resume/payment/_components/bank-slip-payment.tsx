'use client';

import { HTTPError } from 'ky';
import { Barcode, Copy, LoaderCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createPaymentAction } from '@/actions/payments/create-payment-action';
import { payOrderAction } from '@/actions/payments/pay-order-action';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCheckout } from '@/hooks/use-checkout';
import { delay } from '@/utils/delay';

export function BankSlipPayment() {
	const router = useRouter();

	const { order, refreshOrder } = useCheckout();

	const [boletoCode, setBoletoCode] = useState<string | undefined>('');
	const [boletoGenerated, setBoletoGenerated] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [isPayingPending, startPayingTransition] = useTransition();

	async function handleCreatePayment() {
		startTransition(async () => {
			await delay();
			if (!order?.id) {
				toast.error('Pedido não encontrado', {
					position: 'top-right',
				});
				return;
			}

			try {
				const response = await createPaymentAction({
					orderId: order?.id,
					type: 'bank_slip',
				});

				if (response?.payment) {
					setBoletoCode(response?.payment?.bank_slip_code);
					setBoletoGenerated(true);
					toast.success('Boleto gerado com sucesso!', {
						position: 'top-right',
					});

					return;
				}

				if (!response.success) {
					toast.error(response.error, {
						position: 'top-right',
					});
				}
			} catch (error) {
				if (error instanceof HTTPError) {
					toast.error(error.message, {
						position: 'top-right',
					});
				} else {
					toast.error('Erro ao gerar boleto, tente novamente!', {
						position: 'top-right',
					});
				}
			}
		});
	}

	function handleCopyToClipboard() {
		if (!boletoCode) return;
		navigator.clipboard.writeText(boletoCode);
		toast.success('Código copiado!', {
			position: 'top-right',
		});
	}

	async function handlePay() {
		startPayingTransition(async () => {
			await delay();
			if (!order?.id) {
				toast.error('Pedido não encontrado', {
					position: 'top-right',
				});
				return;
			}

			try {
				const responsepayOrder = await payOrderAction({ orderId: order?.id });

				if (!responsepayOrder.success) {
					toast.error('Erro ao tentar realizar o pagamento', {
						position: 'top-right',
					});
					return;
				}

				await refreshOrder();

				toast.success('Pagamento realizado com sucesso!', {
					position: 'top-right',
				});

				router.push(`/resume/payment/success/${responsepayOrder.payment?.id}`);
			} catch (error) {
				if (error instanceof HTTPError) {
					toast.error(error.message, {
						position: 'top-right',
					});
				} else {
					toast.error('Erro ao tentar realizar o pagamento', {
						position: 'top-right',
					});
				}
			}
		});
	}

	return (
		<Card className="max-w-2xl mx-auto">
			<CardContent className="space-y-6">
				{!boletoGenerated ? (
					<div className="text-center space-y-6 py-8">
						<div className="space-y-2">
							<Text
								as="h3"
								variant="title"
							>
								Gerar Boleto Bancário
							</Text>
							<Text
								as="p"
								variant="description"
							>
								Clique no botão abaixo para gerar o boleto do seu pedido
							</Text>
						</div>

						<Button
							onClick={handleCreatePayment}
							disabled={isPending}
							size="lg"
							className="w-full max-w-xs mx-auto flex gap-2"
						>
							{isPending ? (
								<LoaderCircle className="animate-spin" />
							) : (
								<>
									<Barcode className="h-5 w-5" />
									Gerar Boleto
								</>
							)}
						</Button>
					</div>
				) : (
					<>
						<div className="text-center space-y-2">
							<Text
								as="p"
								variant="description"
							>
								Abra o app do seu banco, escolha <strong>Pagar Boleto</strong>
							</Text>
							<Text
								as="p"
								variant="description"
							>
								e escaneie o código de barras ou copie e cole o código.
							</Text>
						</div>

						<div className="bg-primary rounded-lg p-8 flex items-center justify-center mx-auto">
							<Barcode className="size-32 text-primary-foreground" />
						</div>

						<div className="text-center">
							<Text
								as="p"
								variant="small"
							>
								Você tem <strong>3 dias</strong> para pagar
							</Text>
						</div>

						<div className="flex flex-col gap-3">
							<Button
								onClick={handleCopyToClipboard}
								variant="secondary"
								size="lg"
								className="w-full max-w-xs mx-auto flex gap-2"
							>
								<Copy className="h-4 w-4" />
								Copiar código
							</Button>

							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={handlePay}
											disabled={isPayingPending}
											variant="outline"
											size="lg"
											className="w-full max-w-xs mx-auto flex gap-2"
										>
											{isPayingPending ? (
												<>
													<LoaderCircle className="h-4 w-4 animate-spin" />
													Processando...
												</>
											) : (
												<>
													<Zap className="h-4 w-4" />
													Simular Pagamento
												</>
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Simula a confirmação do pagamento do boleto</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
