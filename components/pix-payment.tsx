'use client';

import { HTTPError } from 'ky';
import { Copy, LoaderCircle, QrCode, Zap } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createPaymentAction } from '@/actions/payments/create-payment-action';
import { payOrderAction } from '@/actions/payments/pay-order-action';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCheckout } from '@/hooks/use-checkout';

export function PixPayment() {
	const { order } = useCheckout();

	const [timeLeft, setTimeLeft] = useState(10 * 60);
	const [pixCode, setPixCode] = useState<string | undefined>('');
	const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [isPayingPending, startPayingTransition] = useTransition();

	const totalTime = 10 * 60;

	useEffect(() => {
		if (!qrCodeGenerated) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 0) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [qrCodeGenerated]);

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	const progressValue = ((totalTime - timeLeft) / totalTime) * 100;

	async function handleCreatePayment() {
		startTransition(async () => {
			if (!order?.id) {
				toast.error('Pedido não encontrado', {
					position: 'top-right',
				});
				return;
			}

			try {
				const response = await createPaymentAction({
					orderId: order?.id,
					type: 'pix',
				});

				if (response?.payment) {
					setPixCode(response?.payment?.qr_code_image);
					setQrCodeGenerated(true);
					setTimeLeft(10 * 60);
					toast.success('QR Code gerado com sucesso!', {
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
					toast.error('Erro ao gerar QR Code', {
						position: 'top-right',
					});
				}
			}
		});
	}

	function handleCopyToClipboard() {
		if (!pixCode) return;
		navigator.clipboard.writeText(pixCode);
		toast.success('Código copiado!', {
			position: 'top-right',
		});
	}

	async function handlePay() {
		startPayingTransition(async () => {
			if (!order?.id) {
				toast.error('Pedido não encontrado', {
					position: 'top-right',
				});
				return;
			}

			try {
				const responsepayOrder = await payOrderAction({ orderId: order?.id });

				console.log(responsepayOrder);

				if (responsepayOrder.success) {
					toast.success('Pagamento realizado com sucesso!', {
						position: 'top-right',
					});

					return;
				}

				if (!responsepayOrder.success) {
					toast.error('Erro ao tentar realizar o pagamento', {
						position: 'top-right',
					});
				}
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
				{!qrCodeGenerated ? (
					<div className="text-center space-y-6 py-8">
						<div className="space-y-2">
							<Text
								as="h3"
								className="text-xl font-semibold"
							>
								Gerar QR Code PIX
							</Text>
							<Text
								as="p"
								className="text-muted-foreground"
							>
								Clique no botão abaixo para gerar o código PIX do seu pedido
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
									<QrCode className="h-5 w-5" />
									Gerar QR Code
								</>
							)}
						</Button>
					</div>
				) : (
					<>
						<div className="text-center space-y-2">
							<Text
								as="p"
								className="text-muted-foreground"
							>
								Abra o app com sua chave PIX cadastrada, escolha{' '}
								<span className="font-semibold text-foreground">
									Pagar com Pix
								</span>
							</Text>
							<Text
								as="p"
								className="text-muted-foreground"
							>
								e escaneie o QR Code ou copie e cole o código.
							</Text>
						</div>

						<div className="bg-primary rounded-full size-40 flex items-center justify-center mx-auto">
							<QrCode className="size-28 text-white" />
						</div>

						<div className="space-y-2">
							<Progress
								value={progressValue}
								className="h-2"
							/>
							<Text
								as="p"
								variant="sm"
								className="text-center text-muted-foreground"
							>
								Você tem{' '}
								<span className="font-semibold text-foreground">
									{formatTime(timeLeft)}
								</span>{' '}
								para pagar
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
										<p>Simula a confirmação do pagamento PIX</p>
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
