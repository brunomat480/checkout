'use client';

import { CircleCheck, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCheckout } from '@/hooks/use-checkout';
import { formatPrice } from '@/utils/format-price';

export function ResumeCard() {
	const router = useRouter();
	const { order, loading } = useCheckout();

	const hasItems = order ? order?.items.length > 0 : false;

	function handleNavigation() {
		router.push('/resume/payment');
	}

	if (loading) {
		return (
			<Card className="sticky top-6 h-max animate-pulse">
				<CardHeader>
					<Skeleton className="h-6 w-40" />
				</CardHeader>

				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between text-sm">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-12" />
						</div>

						<div className="flex items-center justify-between text-sm">
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-4 w-10" />
						</div>

						<div className="flex items-center justify-between text-sm">
							<Skeleton className="h-4 w-14" />
							<Skeleton className="h-4 w-12" />
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<Skeleton className="h-5 w-12" />
							<Skeleton className="h-6 w-16" />
						</div>
					</div>

					<Skeleton className="w-full h-10 mt-6 rounded-md" />

					<div className="mt-6 space-y-2">
						<div className="flex items-start gap-2 text-xs">
							<Skeleton className="h-4 w-4 rounded-full mt-0.5" />
							<Skeleton className="h-3 w-32" />
						</div>
						<div className="flex items-start gap-2 text-xs">
							<Skeleton className="h-4 w-4 rounded-full mt-0.5" />
							<Skeleton className="h-3 w-28" />
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="sticky top-6 h-max">
			<CardHeader>
				<CardTitle>Resumo do Pedido</CardTitle>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-between text-sm">
						<Text variant="muted">Subtotal</Text>
						<Text>{formatPrice(order?.subtotal || 0)}</Text>
					</div>

					<div className="flex items-center justify-between text-sm">
						<Text variant="muted">Frete</Text>
						<Text>{formatPrice(order?.shipping || 0)}</Text>
					</div>

					<div className="flex items-center justify-between text-sm">
						<Text variant="muted">Desconto</Text>
						<Text className="text-green-600">
							- {formatPrice(order?.discount || 0)}
						</Text>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<Text variant="heading">Total</Text>
						<Text variant="subtitle">
							{formatPrice(order?.totalAmount || 0)}
						</Text>
					</div>
				</div>

				<Button
					className="w-full mt-6"
					size="lg"
					onClick={handleNavigation}
					disabled={!hasItems || loading}
				>
					Finalizar Compra
				</Button>

				<div className="mt-6 space-y-2">
					<div className="flex items-start gap-2">
						<CircleCheck className="size-4 text-muted-foreground" />
						<Text variant="muted">Frete grátis acima de R$ 200</Text>
					</div>
					<div className="flex items-start gap-2">
						<Lock className="size-4 text-muted-foreground" />
						<Text variant="muted">Compra 100% segura</Text>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
