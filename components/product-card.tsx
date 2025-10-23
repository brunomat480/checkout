'use client';

import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Text } from '@/components/text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatPrice } from '@/utils/format-price';

interface ProductCardProps {
	product: {
		id: number | string;
		image: string;
		name: string;
		category: string;
		price: number;
		rating: number;
		description?: string;
	};
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className="group overflow-hidden h-[28.125rem] border-0 shadow-sm hover:shadow-xl transition-all duration-300 py-0">
			<div className="relative aspect-square overflow-hidden h-96 ">
				<Image
					src={product.image}
					alt={product.name}
					width={300}
					height={300}
					className="object-cover w-full h-96 group-hover:scale-125 transition-transform duration-500"
				/>
				<Badge
					variant="secondary"
					className="absolute top-2 left-2 text-[10px] px-2 py-0.5 h-auto bg-background/80 backdrop-blur-sm border-0"
				>
					{product.category}
				</Badge>
			</div>
			<CardHeader className="p-3 space-y-1.5 pb-0">
				<Text
					as="h3"
					className="font-medium truncate"
				>
					{product.name}
				</Text>
				<div className="flex items-center gap-1">
					<Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
					<Text className="font-medium">{product.rating}</Text>
				</div>
			</CardHeader>
			<CardContent className="p-3 space-y-2 pt-0">
				<div className="space-y-0.5">
					<div className="text-lg font-bold">{formatPrice(product.price)}</div>
					<Text
						as="p"
						className="text-muted-foreground"
					>
						em até 10x {formatPrice(product.price / 10)}
					</Text>
				</div>

				<Button
					size="sm"
					className="w-full h-9"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						console.log('Adicionar ao carrinho:', product.id);
					}}
				>
					<ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
					Adicionar
				</Button>

				<Button
					asChild
					size="sm"
					variant="outline"
					className="w-full h-9"
				>
					<Link href={`/product/${product.id}`}>Detalhes</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
