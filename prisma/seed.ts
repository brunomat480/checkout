import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const categories = [
		'Eletrônicos',
		'Computadores',
		'Livros',
		'Casa e Cozinha',
		'Moda',
		'Beleza',
		'Brinquedos',
		'Esportes',
		'Automotivo',
		'Mercado',
	];

	// Lista ampliada de produtos com imagens funcionais
	const products = [
		{
			name: 'iPhone 15 Pro Max',
			price: 7999.99,
			image:
				'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
			rating: 4.8,
			description:
				'O iPhone 15 Pro Max redefine o que um smartphone pode fazer. Com o chip A17 Pro, câmera de 48MP e design em titânio, este é o iPhone mais avançado de todos os tempos.',
		},
		{
			name: 'Notebook Dell XPS 13',
			price: 5999.9,
			image:
				'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
			rating: 4.6,
			description:
				'Notebook premium com processador Intel Core i7, tela InfinityEdge e design leve e elegante.',
		},
		{
			name: 'Fone de Ouvido Bluetooth Sony WH-1000XM5',
			price: 2499.99,
			image:
				'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
			rating: 4.9,
			description:
				'Cancelamento de ruído líder de mercado e até 30 horas de bateria.',
		},
		{
			name: 'Cafeteira Expresso Nespresso Vertuo',
			price: 899.9,
			image:
				'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
			rating: 4.7,
			description:
				'Prepare cafés perfeitos com um toque, graças à tecnologia de cápsulas Vertuo.',
		},
		{
			name: 'Tênis Nike Air Zoom Pegasus 40',
			price: 699.9,
			image:
				'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
			rating: 4.5,
			description:
				'Tênis de corrida com amortecimento responsivo e design leve para máximo conforto.',
		},
		{
			name: 'Smart TV Samsung 55" 4K UHD',
			price: 3299.0,
			image:
				'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
			rating: 4.6,
			description:
				'TV 4K com imagem nítida, HDR e sistema operacional Tizen com acesso a apps de streaming.',
		},
		{
			name: 'Kindle Paperwhite 11ª Geração',
			price: 749.0,
			image:
				'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
			rating: 4.8,
			description:
				'Leitor digital com tela antirreflexo, iluminação ajustável e bateria de longa duração.',
		},
		{
			name: 'Aspirador Robô Xiaomi Mi Robot Vacuum',
			price: 1599.0,
			image:
				'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
			rating: 4.7,
			description:
				'Aspirador inteligente com mapeamento a laser e controle via app.',
		},
		{
			name: 'Relógio Apple Watch Series 9',
			price: 4399.0,
			image:
				'https://images.unsplash.com/photo-1579586337278-3f436f4b5d7a?w=800&q=80',
			rating: 4.9,
			description:
				'Monitoramento de saúde, exercícios e integração total com o iPhone.',
		},
		{
			name: 'Liquidificador Philips Walita ProBlend 6',
			price: 299.9,
			image:
				'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80',
			rating: 4.4,
			description:
				'Potente liquidificador com lâminas de aço inoxidável e jarra de vidro resistente.',
		},
		{
			name: 'Camisa Polo Lacoste Clássica',
			price: 499.9,
			image:
				'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
			rating: 4.5,
			description:
				'Camisa polo de algodão Pima, confortável e elegante, ideal para o dia a dia.',
		},
		{
			name: 'Bicicleta Caloi Elite 30',
			price: 3299.9,
			image:
				'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
			rating: 4.6,
			description:
				'Mountain bike de alta performance com 24 marchas e quadro de alumínio.',
		},
		{
			name: 'Perfume Dior Sauvage Eau de Toilette',
			price: 599.9,
			image:
				'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
			rating: 4.8,
			description:
				'Perfume masculino amadeirado fresco, ideal para ocasiões especiais.',
		},
		{
			name: 'Caixa de Som JBL Charge 5',
			price: 899.9,
			image:
				'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
			rating: 4.8,
			description: 'Som potente, bateria de até 20h e resistência à água IP67.',
		},
		{
			name: 'Lego Star Wars Millennium Falcon',
			price: 1299.0,
			image:
				'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
			rating: 4.9,
			description:
				'Mais de 1.300 peças para construir a nave mais icônica da galáxia.',
		},
		{
			name: 'Câmera Canon EOS Rebel T7i',
			price: 3599.0,
			image:
				'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
			rating: 4.7,
			description: 'Câmera DSLR com sensor de 24MP, Wi-Fi e autofoco rápido.',
		},
		{
			name: 'Volante Logitech G29 para PS5 e PC',
			price: 2499.9,
			image:
				'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
			rating: 4.9,
			description:
				'Volante com pedais e force feedback realista para jogos de corrida.',
		},
		{
			name: 'Kit de Ferramentas Bosch 108 Peças',
			price: 379.9,
			image:
				'https://images.unsplash.com/photo-1572981779307-38f8b0456222?w=800&q=80',
			rating: 4.6,
			description:
				'Conjunto completo de chaves, brocas e acessórios em maleta resistente.',
		},
		{
			name: 'Cadeira Gamer ThunderX3 TGC12',
			price: 1299.9,
			image:
				'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
			rating: 4.7,
			description:
				'Cadeira ergonômica com apoio lombar, ajustável e design esportivo.',
		},
		{
			name: 'Pneu Michelin Primacy 4 205/55 R16',
			price: 599.0,
			image:
				'https://images.unsplash.com/photo-1603712610496-5368a73c1f04?w=800&q=80',
			rating: 4.5,
			description:
				'Pneu de alta durabilidade e excelente desempenho em piso molhado.',
		},
		{
			name: 'Tablet Samsung Galaxy Tab S9',
			price: 4299.0,
			image:
				'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
			rating: 4.7,
			description:
				'Tablet premium com S Pen, tela Dynamic AMOLED e processador Snapdragon.',
		},
		{
			name: 'Mochila North Face Borealis',
			price: 399.9,
			image:
				'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
			rating: 4.6,
			description:
				'Mochila resistente e confortável com múltiplos compartimentos organizados.',
		},
		{
			name: 'Processador de Alimentos Mondial',
			price: 459.9,
			image:
				'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
			rating: 4.4,
			description:
				'Prepare refeições rapidamente com múltiplas funções e lâminas afiadas.',
		},
		{
			name: 'Skate Elétrico Xiaomi Mi Electric',
			price: 2999.9,
			image:
				'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
			rating: 4.5,
			description:
				'Skate elétrico com autonomia de 30km e controle remoto inteligente.',
		},
	];

	await prisma.product.deleteMany();

	for (const product of products) {
		const category = categories[Math.floor(Math.random() * categories.length)];

		await prisma.product.create({
			data: {
				...product,
				category,
			},
		});
	}
}

main()
	.catch((e) => {
		console.error('❌ Erro ao executar o seed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
