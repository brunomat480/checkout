import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { Text } from '@/components/text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';

export default function HomePage() {
	// Produtos em destaque para o carrossel
	const featuredProducts = [
		{
			id: 1,
			name: 'iPhone 15 Pro Max',
			price: 7999.99,
			oldPrice: 9499.99,
			image:
				'https://images.unsplash.com/photo-1696446702163-474579d95b52?w=800&q=80',
			badge: '15% OFF',
			rating: 4.8,
		},
		{
			id: 2,
			name: 'MacBook Pro M3',
			price: 15999.99,
			oldPrice: 18999.99,
			image:
				'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
			badge: 'LANÇAMENTO',
			rating: 4.9,
		},
		{
			id: 3,
			name: 'PlayStation 5 Pro',
			price: 4499.99,
			oldPrice: 4999.99,
			image:
				'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
			badge: '10% OFF',
			rating: 4.7,
		},
		{
			id: 4,
			name: 'Samsung Galaxy S24 Ultra',
			price: 6799.99,
			oldPrice: 7999.99,
			image:
				'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
			badge: '15% OFF',
			rating: 4.6,
		},
	];

	// Produtos aleatórios
	const products = [
		{
			id: 5,
			name: 'Fone Sony WH-1000XM5',
			price: 1899.99,
			image:
				'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80',
			rating: 4.8,
			category: 'Eletrônicos',
		},
		{
			id: 6,
			name: 'Kindle Paperwhite',
			price: 599.99,
			image:
				'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80',
			rating: 4.7,
			category: 'Livros',
		},
		{
			id: 7,
			name: 'Apple Watch Series 9',
			price: 3999.99,
			image:
				'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
			rating: 4.9,
			category: 'Eletrônicos',
		},
		{
			id: 8,
			name: 'Cafeteira Nespresso',
			price: 899.99,
			image:
				'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',
			rating: 4.5,
			category: 'Casa e Cozinha',
		},
		{
			id: 9,
			name: 'Tênis Nike Air Max',
			price: 799.99,
			image:
				'https://images.unsplash.com/photo-1542291026786-02b52d3a0d97?w=500&q=80',
			rating: 4.6,
			category: 'Moda',
		},
		{
			id: 10,
			name: 'Câmera Canon EOS R6',
			price: 12999.99,
			image:
				'https://images.unsplash.com/photo-1606980707986-02b5f721d03e?w=500&q=80',
			rating: 4.8,
			category: 'Eletrônicos',
		},
		{
			id: 11,
			name: 'Smart TV LG 65" OLED',
			price: 7999.99,
			image:
				'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80',
			rating: 4.7,
			category: 'Eletrônicos',
		},
		{
			id: 12,
			name: 'Bicicleta Speed Caloi',
			price: 2499.99,
			image:
				'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80',
			rating: 4.5,
			category: 'Esportes',
		},
		{
			id: 13,
			name: 'Perfume Dior Sauvage',
			price: 549.99,
			image:
				'https://images.unsplash.com/photo-1541643600914-7fd91fc51a46?w=500&q=80',
			rating: 4.9,
			category: 'Beleza',
		},
		{
			id: 14,
			name: 'Kit Panelas Tramontina',
			price: 399.99,
			image:
				'https://images.unsplash.com/photo-1584990347449-39b0e6f8c696?w=500&q=80',
			rating: 4.6,
			category: 'Casa e Cozinha',
		},
		{
			id: 15,
			name: 'Mouse Logitech MX Master 3',
			price: 599.99,
			image:
				'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
			rating: 4.8,
			category: 'Computadores',
		},
		{
			id: 16,
			name: 'Ar Condicionado Samsung',
			price: 2199.99,
			image:
				'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=500&q=80',
			rating: 4.4,
			category: 'Casa e Cozinha',
		},
	];

	function formatPrice(price: number) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(price);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
							<Card
								key={product.id}
								className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 py-0"
							>
								<div className="relative aspect-square overflow-hidden">
									<Image
										src={product.image || '/placeholder.svg'}
										alt={product.name}
										width={300}
										height={300}
										className="object-cover w-full h-full group-hover:scale-125 transition-transform duration-500"
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
										className="font-medium"
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
										<div className="text-lg font-bold">
											{formatPrice(product.price)}
										</div>
										<Text
											as="p"
											className="text-muted-foreground"
										>
											em até 10x {formatPrice(product.price / 10)}
										</Text>
									</div>
									<Button
										className="w-full h-9"
										size="sm"
									>
										<ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
										Adicionar
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
