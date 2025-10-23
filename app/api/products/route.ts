import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const products = await prisma.product.findMany();

		const total = await prisma.product.count();

		return Response.json({
			total,
			products,
		});
	} catch (error) {
		console.error('Erro ao buscar produtos:', error);

		return Response.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
