'use client';

import { LoaderCircle, ShoppingCart } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { SignUpFormModal } from '@/components/sign-up-form-modal';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useCheckout } from '@/hooks/use-checkout';

interface AddProductOrderButtonProps {
	product: {
		id: number | undefined;
		name: string | undefined;
	};
}

export function AddProductOrderButton({ product }: AddProductOrderButtonProps) {
	const { status } = useAuth();
	const { addProductOrder } = useCheckout();

	const [isPending, startTransition] = useTransition();
	const [isSignUpOpen, setIsSignUpOpen] = useState(false);

	async function handleAddProductOrder(productId: number | undefined) {
		startTransition(async () => {
			if (!productId) return;

			if (status === 'unauthenticated') {
				setIsSignUpOpen(true);
				return;
			}

			await addToCart(productId);
		});
	}

	async function addToCart(productId: number | undefined) {
		if (!productId) return;
		try {
			const response = await addProductOrder(productId);

			if (!response.success) {
				toast.error(response?.error, {
					position: 'bottom-right',
				});

				return;
			}

			toast.success(`${product.name} foi adicionado ao carrinho`, {
				position: 'bottom-right',
			});
		} catch {
			toast.error('Erro ao adicionar produto ao carrinho', {
				position: 'bottom-right',
			});
		}
	}

	return (
		<>
			<SignUpFormModal
				open={isSignUpOpen}
				onOpenChange={setIsSignUpOpen}
				onSuccess={async () => await addToCart(product?.id)}
			/>
			<Button
				size="lg"
				onClick={(event) => {
					event.preventDefault();
					event.stopPropagation();
					handleAddProductOrder(product?.id);
				}}
				className="w-full h-12"
			>
				{isPending ? (
					<LoaderCircle className="animate-spin" />
				) : (
					<>
						<ShoppingCart className="h-5 w-5 mr-2" />
						<Text variant="small">Adicionar ao Carrinho</Text>
					</>
				)}
			</Button>
		</>
	);
}
