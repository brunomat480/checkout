import type { Metadata } from 'next';
import { ProductCard } from '@/components/product-card';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import { products } from '@/mocks/products';

export const metadata: Metadata = {
	title: 'Produtos',
};

export default function HomePage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
				<div className="container mx-auto px-4">
					<div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Eletrônicos
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Computadores
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Livros
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Casa e Cozinha
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Moda
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Beleza
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Brinquedos
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Esportes
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Automotivo
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Mercado
						</Button>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-6 md:py-8">
				<section>
					<Text
						as="h2"
						variant="xl"
						className="mb-4"
					>
						Todos os Produtos
					</Text>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
							/>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
