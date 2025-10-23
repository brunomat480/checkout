import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	try {
		const productId = parseInt(id);

		if (isNaN(productId)) {
			return Response.json(
				{ error: 'ID do produto inválido' },
				{ status: 400 },
			);
		}

		const product = await prisma.product.findUnique({
			where: {
				id: productId,
			},
		});

		if (!product) {
			return Response.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 },
			);
		}

		return Response.json(product);
	} catch (error) {
		console.error('Erro ao buscar produto:', error);

		return Response.json(
			{ error: 'Erro interno do servidor ao buscar produto' },
			{ status: 500 },
		);
	} finally {
		await prisma.$disconnect();
	}
}
