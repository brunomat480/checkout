'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ProductImage } from '@/components/product-image';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { useCheckout } from '@/hooks/use-checkout';
import { formatPrice } from '@/utils/format-price';

interface Product {
	id: number;
	name: string;
	image: string;
	description: string;
	quantity: number;
	price: number;
}

interface ProductCardOrderProps {
	product: Product;
	itemId: number;
	onUpdate?: () => void;
}

export function ProductCardOrder({
	product,
	itemId,
	onUpdate,
}: ProductCardOrderProps) {
	const { addProductOrder, deleteItemOrder } = useCheckout();
	const [isPending, startTransition] = useTransition();
	const [isRemoving, setIsRemoving] = useState(false);

	async function handleIncrement() {
		startTransition(async () => {
			try {
				const response = await addProductOrder(product.id, 1);

				if (!response.success) {
					toast.error(response?.error || 'Erro ao atualizar quantidade', {
						position: 'top-right',
					});
					return;
				}

				onUpdate?.();
			} catch {
				toast.error('Erro ao atualizar quantidade', {
					position: 'top-right',
				});
			}
		});
	}

	async function handleDecrement() {
		if (product.quantity <= 1) return;

		startTransition(async () => {
			try {
				const response = await deleteItemOrder({ itemId, quantity: 1 });

				if (!response.success) {
					toast.error(response?.error || 'Erro ao atualizar quantidade', {
						position: 'top-right',
					});
					return;
				}

				onUpdate?.();
			} catch {
				toast.error('Erro ao atualizar quantidade', {
					position: 'top-right',
				});
			}
		});
	}

	async function handleRemove() {
		setIsRemoving(true);

		startTransition(async () => {
			try {
				const response = await deleteItemOrder({ itemId });

				if (!response.success) {
					toast.error(response?.error || 'Erro ao remover produto', {
						position: 'top-right',
					});
					setIsRemoving(false);
					return;
				}

				toast.success('Produto removido do carrinho', {
					position: 'top-right',
				});

				onUpdate?.();
			} catch {
				toast.error('Erro ao remover produto', {
					position: 'top-right',
				});
				setIsRemoving(false);
			}
		});
	}

	return (
		<div
			className={`flex items-start gap-4 py-6 border-b border-border/40 last:border-0 transition-opacity ${
				isRemoving ? 'opacity-50' : 'opacity-100'
			}`}
		>
			<div className="flex-shrink-0 overflow-hidden rounded-lg border border-border/50">
				<ProductImage
					src={product?.image}
					alt={product?.name || 'Produto'}
					width={120}
					height={120}
					className="w-24 h-24 object-cover"
				/>
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<Text
							as="h3"
							variant="heading"
							className="text-foreground mb-1"
						>
							{product?.name}
						</Text>
						<Text
							as="p"
							className="font-bold text-foreground"
						>
							{formatPrice(product.price * product.quantity)}
						</Text>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground hover:text-destructive transition-colors"
						onClick={handleRemove}
						disabled={isPending || isRemoving}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex items-center gap-2 mt-4">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 bg-transparent hover:bg-accent"
						onClick={handleDecrement}
						disabled={isPending || product.quantity <= 1 || isRemoving}
					>
						<Minus className="h-3 w-3" />
					</Button>
					<Text
						variant="small"
						className="min-w-[2rem] text-center"
					>
						{product.quantity}
					</Text>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 bg-transparent hover:bg-accent"
						onClick={handleIncrement}
						disabled={isPending || isRemoving}
					>
						<Plus className="h-3 w-3" />
					</Button>
				</div>
			</div>
		</div>
	);
}
