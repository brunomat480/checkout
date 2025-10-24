import { HTTPError } from 'ky';
import {
	ChevronLeft,
	RotateCcw,
	Shield,
	ShoppingCart,
	Star,
	Truck,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { Text } from '@/components/text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getProduct } from '@/services/get-product';
import type { Product } from '@/types/products';
import { delay } from '@/utils/delay';
import { formatPrice } from '@/utils/format-price';

interface MetadataProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: MetadataProps): Promise<Metadata> {
	const { id } = await params;

	let product: Product | null = null;
	try {
		await delay();
		const productResponse = await getProduct(id);
		product = productResponse;
	} catch (error) {
		if (error instanceof HTTPError) {
			if (error.response.status === 404) {
				notFound();
			}
			product = null;
		}
		product = null;
	}

	return {
		title: `Detalhes | ${product?.name}`,
	};
}

interface ProductPageProps {
	params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { id } = await params;

	let product: Product | null = null;
	try {
		await delay();
		const productResponse = await getProduct(id);
		product = productResponse;
	} catch (error) {
		if (error instanceof HTTPError) {
			if (error.response.status === 404) {
				notFound();
			}
			product = null;
		}
		product = null;
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-6 md:py-8">
				<Button
					asChild
					variant="ghost"
				>
					<Link
						href="/"
						className="flex items-center gap-1 mb-4"
					>
						<ChevronLeft />
						Voltar
					</Link>
				</Button>

				<div className="grid md:grid-cols-2 gap-8 mb-12">
					<div className="space-y-4">
						<div className="aspect-square rounded-lg overflow-hidden bg-muted">
							<Image
								src={product?.image || 'https://via.placeholder.com/150'}
								alt={product?.name || ''}
								width={600}
								height={600}
								className="object-cover w-full h-full"
							/>
						</div>
					</div>

					<div className="space-y-6">
						<div>
							<Badge className="mb-3">{product?.category}</Badge>
							<h1 className="text-3xl md:text-4xl font-bold mb-4">
								{product?.name}
							</h1>
							<div className="flex items-center gap-4 mb-4">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-5 w-5 ${i < Math.floor(product?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
										/>
									))}
								</div>
								<span className="text-sm font-medium">{product?.rating}</span>
							</div>
							<div className="text-4xl font-bold text-primary">
								{formatPrice(product?.price || 0)}
							</div>
						</div>

						{product?.description && (
							<div>
								<Text
									as="h3"
									className="font-semibold mb-2"
								>
									Descrição
								</Text>
								<Text
									as="p"
									className="text-muted-foreground leading-relaxed"
								>
									{product?.description}
								</Text>
							</div>
						)}

						<Separator />

						<div className="space-y-3">
							<Button
								size="lg"
								className="w-full h-12 text-base"
							>
								<ShoppingCart className="h-5 w-5 mr-2" />
								Adicionar ao Carrinho
							</Button>
						</div>

						<Separator />

						<div className="grid gap-4">
							<div className="flex items-start gap-3">
								<Truck className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<Text
										as="p"
										className="font-medium"
									>
										Frete Grátis
									</Text>
									<Text
										as="p"
										variant="sm"
										className="text-muted-foreground"
									>
										Para todo o Brasil em compras acima de R$ 199
									</Text>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Shield className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<Text
										as="p"
										className="font-medium"
									>
										Garantia de 1 ano
									</Text>
									<Text
										as="p"
										variant="sm"
										className="text-muted-foreground"
									>
										Garantia oficial do fabricante
									</Text>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<RotateCcw className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<Text
										as="p"
										className="font-medium"
									>
										Devolução grátis
									</Text>
									<Text
										as="p"
										variant="sm"
										className="text-muted-foreground"
									>
										Até 30 dias após a compra
									</Text>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* {relatedProducts.length > 0 && (
					<section>
						<Text
							as="h2"
							variant="xl"
							className="font-bold mb-6"
						>
							Produtos Relacionados
						</Text>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
							{relatedProducts.map((relatedProduct) => (
								<ProductCard
									key={relatedProduct.id}
									product={relatedProduct}
								/>
							))}
						</div>
					</section>
				)} */}
			</div>
		</div>
	);
}
