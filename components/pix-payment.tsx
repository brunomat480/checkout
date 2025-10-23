'use client';

import { Copy, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function PixPayment() {
	const [timeLeft, setTimeLeft] = useState(10 * 60);
	const totalTime = 10 * 60;
	const pixCode =
		'00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540599.905802BR5925NOME DO BENEFICIARIO6014BELO HORIZONTE62070503***63041D3D';

	useEffect(() => {
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
	}, []);

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	const progressValue = ((totalTime - timeLeft) / totalTime) * 100;

	function handleCopyToClipboard() {
		navigator.clipboard.writeText(pixCode);
	}

	return (
		<Card className="max-w-2xl mx-auto">
			<CardContent className="space-y-6">
				<div className="text-center space-y-2">
					<Text
						as="p"
						className="text-muted-foreground"
					>
						Abra o app com sua chave PIX cadastrada, escolha{' '}
						<span className="font-semibold text-foreground">Pagar com Pix</span>
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

				<Button
					onClick={handleCopyToClipboard}
					variant="secondary"
					size="lg"
					className="w-full max-w-xs mx-auto flex gap-2"
				>
					<Copy className="h-4 w-4" />
					Copiar código
				</Button>
			</CardContent>
		</Card>
	);
}
