'use client';

import { Barcode, Copy } from 'lucide-react';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function BankSlipPayment() {
	const boletoCode = '34191.79001 01043.510047 91020.150008 1 96610000014500';

	function handleCopyToClipboard() {
		navigator.clipboard.writeText(boletoCode);
	}

	return (
		<Card className="max-w-2xl mx-auto">
			<CardContent className="space-y-6">
				<div className="text-center space-y-2">
					<Text
						as="p"
						className="text-muted-foreground"
					>
						Abra o app do seu banco, escolha{' '}
						<span className="font-semibold text-foreground">Pagar Boleto</span>
					</Text>
					<Text
						as="p"
						className="text-muted-foreground"
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
						variant="sm"
						className="text-muted-foreground"
					>
						Você tem{' '}
						<span className="font-semibold text-foreground">3 dias</span> para
						pagar
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
