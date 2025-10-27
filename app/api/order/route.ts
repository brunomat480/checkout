import { OrderStatus } from '@prisma/client';
import { HTTPError } from 'ky';
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth-utils';
import { getCurrentUser } from '@/lib/get-current-user';
import { prisma } from '@/lib/prisma';

interface AddItemRequestBody {
	productId: string;
	quantity?: number;
}

interface OrderItemResponse {
	id: number;
	productId: number;
	productName: string;
	quantity: number;
	price: number;
	subtotal: number;
}

type OrderItemUpdateWithProduct = Awaited<
	ReturnType<typeof prisma.orderItem.update>
> & {
	product: {
		id: number;
		name: string;
		price: number;
		image: string | null;
		category: string;
		description: string | null;
		rating: number | null;
	};
};

type OrderItemCreateWithProduct = Awaited<
	ReturnType<typeof prisma.orderItem.create>
> & {
	product: {
		id: number;
		name: string;
		price: number;
		image: string | null;
		category: string;
		description: string | null;
		rating: number | null;
	};
};

export async function GET(request: NextRequest) {
	try {
		const currentUser = await getCurrentUser();

		let user = currentUser;
		if (!user) {
			user = await getCurrentUserFromRequest(request);
		}

		if (!user) {
			return NextResponse.json(
				{ error: 'Usuário não autenticado' },
				{ status: 401 },
			);
		}

		const userId = parseInt(user.userId);

		const existingOrder = await prisma.order.findFirst({
			where: {
				userId: userId,
				status: {
					in: [OrderStatus.ACTIVE, OrderStatus.PENDING],
				},
			},
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								price: true,
								image: true,
								category: true,
								description: true,
								rating: true,
							},
						},
					},
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		if (existingOrder) {
			return NextResponse.json({
				success: true,
				order: existingOrder,
				message:
					existingOrder.status === OrderStatus.PENDING
						? 'Pedido pendente encontrado'
						: 'Carrinho ativo encontrado',
			});
		}

		const newOrder = await prisma.order.create({
			data: {
				userId: userId,
				status: OrderStatus.ACTIVE,
				subtotal: 0,
				totalAmount: 0,
				shipping: 0,
				discount: 0,
				orderNumber: `CART-${userId}-${Date.now()}`,
			},
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								price: true,
								image: true,
								category: true,
								description: true,
								rating: true,
							},
						},
					},
				},
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			order: newOrder,
			message: 'Novo carrinho criado',
		});
	} catch (error: unknown) {
		if (error instanceof HTTPError) {
			return NextResponse.json(
				{ error: `Erro interno do servidor: ${error.message}` },
				{ status: 500 },
			);
		}

		console.error('Erro interno do servidor:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'Usuário não autenticado' },
				{ status: 401 },
			);
		}

		const userId = parseInt(currentUser.userId);
		const { productId, quantity = 1 } =
			(await request.json()) as AddItemRequestBody;

		if (!productId) {
			return NextResponse.json(
				{ error: 'ID do produto é obrigatório' },
				{ status: 400 },
			);
		}

		if (quantity < 1) {
			return NextResponse.json(
				{ error: 'Quantidade deve ser pelo menos 1' },
				{ status: 400 },
			);
		}

		const product = await prisma.product.findUnique({
			where: { id: parseInt(productId) },
		});

		if (!product) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 },
			);
		}

		let order = await prisma.order.findFirst({
			where: {
				userId: userId,
				status: {
					in: [OrderStatus.ACTIVE, OrderStatus.PENDING],
				},
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		if (!order) {
			order = await prisma.order.create({
				data: {
					userId: userId,
					status: OrderStatus.ACTIVE,
					subtotal: 0,
					totalAmount: 0,
					shipping: 0,
					discount: 0,
					orderNumber: `CART-${userId}-${Date.now()}`,
				},
				include: {
					items: {
						include: {
							product: true,
						},
					},
				},
			});
		}

		if (order.status === OrderStatus.PENDING) {
			order = await prisma.order.update({
				where: { id: order.id },
				data: {
					status: OrderStatus.ACTIVE,
					updatedAt: new Date(),
				},
				include: {
					items: {
						include: {
							product: true,
						},
					},
				},
			});
		}

		const existingItem = await prisma.orderItem.findUnique({
			where: {
				order_product_unique: {
					orderId: order.id,
					productId: product.id,
				},
			},
		});

		let orderItem: OrderItemUpdateWithProduct | OrderItemCreateWithProduct;
		let message: string;

		if (existingItem) {
			orderItem = (await prisma.orderItem.update({
				where: {
					id: existingItem.id,
				},
				data: {
					quantity: existingItem.quantity + quantity,
					updatedAt: new Date(),
				},
				include: {
					product: true,
				},
			})) as OrderItemUpdateWithProduct;
			message = `Quantidade atualizada para ${orderItem.quantity} unidades`;
		} else {
			orderItem = (await prisma.orderItem.create({
				data: {
					orderId: order.id,
					productId: product.id,
					quantity: quantity,
					price: product.price,
				},
				include: {
					product: true,
				},
			})) as OrderItemCreateWithProduct;
			message = 'Item adicionado ao carrinho';
		}

		const allItems = await prisma.orderItem.findMany({
			where: { orderId: order.id },
			include: { product: true },
		});

		const newSubtotal = allItems.reduce((total, item) => {
			return total + item.product.price * item.quantity;
		}, 0);

		const newTotalAmount = newSubtotal - order.discount + order.shipping;

		const updatedOrder = await prisma.order.update({
			where: { id: order.id },
			data: {
				subtotal: newSubtotal,
				totalAmount: newTotalAmount,
				updatedAt: new Date(),
			},
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								price: true,
								image: true,
								category: true,
								description: true,
								rating: true,
							},
						},
					},
					orderBy: {
						createdAt: 'asc',
					},
				},
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		const itemResponse: OrderItemResponse = {
			id: orderItem.id,
			productId: orderItem.productId,
			productName: orderItem.product.name,
			quantity: orderItem.quantity,
			price: orderItem.price,
			subtotal: orderItem.product.price * orderItem.quantity,
		};

		return NextResponse.json(
			{
				success: true,
				order: updatedOrder,
				item: itemResponse,
				message: message,
			},
			{ status: 200 },
		);
	} catch (error: unknown) {
		if (typeof error === 'object' && error !== null && 'code' in error) {
			const prismaError = error as { code: string };

			if (prismaError.code === 'P2002') {
				return NextResponse.json(
					{ error: 'Item já existe no carrinho' },
					{ status: 409 },
				);
			}

			if (prismaError.code === 'P2025') {
				return NextResponse.json(
					{ error: 'Produto ou pedido não encontrado' },
					{ status: 404 },
				);
			}

			if (prismaError.code === 'P2003') {
				return NextResponse.json(
					{ error: 'Produto não existe' },
					{ status: 404 },
				);
			}
		}

		const errorMessage =
			error instanceof Error ? error.message : 'Erro desconhecido';
		return NextResponse.json(
			{ error: `Erro interno ao adicionar item ao carrinho: ${errorMessage}` },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'Usuário não autenticado' },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(request.url);
		const itemId = searchParams.get('itemId');
		const quantityToRemove = searchParams.get('quantity');

		if (!itemId) {
			return NextResponse.json(
				{ error: 'ID do item é obrigatório' },
				{ status: 400 },
			);
		}

		const orderItem = await prisma.orderItem.findFirst({
			where: {
				id: parseInt(itemId),
				order: {
					userId: parseInt(currentUser.userId),
				},
			},
			include: {
				order: true,
				product: true,
			},
		});

		if (!orderItem) {
			return NextResponse.json(
				{ error: 'Item não encontrado no carrinho' },
				{ status: 404 },
			);
		}

		const allowedStatuses: OrderStatus[] = [
			OrderStatus.ACTIVE,
			OrderStatus.PENDING,
			OrderStatus.PROCESSING,
		];

		if (!allowedStatuses.includes(orderItem.order.status)) {
			return NextResponse.json(
				{
					error: `Não é possível modificar itens em um pedido com status ${orderItem.order.status}`,
				},
				{ status: 400 },
			);
		}

		let message = '';
		let updatedOrder: Awaited<ReturnType<typeof prisma.order.update>>;

		if (quantityToRemove) {
			const removeQuantity = parseInt(quantityToRemove);

			if (removeQuantity <= 0) {
				return NextResponse.json(
					{ error: 'Quantidade deve ser maior que 0' },
					{ status: 400 },
				);
			}

			if (removeQuantity >= orderItem.quantity) {
				await prisma.orderItem.delete({
					where: { id: parseInt(itemId) },
				});
				message = 'Item removido do carrinho';
			} else {
				await prisma.orderItem.update({
					where: { id: parseInt(itemId) },
					data: {
						quantity: orderItem.quantity - removeQuantity,
						updatedAt: new Date(),
					},
				});
				message = `${removeQuantity} unidade(s) removida(s) do item`;
			}
		} else {
			await prisma.orderItem.delete({
				where: { id: parseInt(itemId) },
			});
			message = 'Item removido do carrinho';
		}

		const remainingItems = await prisma.orderItem.findMany({
			where: { orderId: orderItem.order.id },
			include: { product: true },
		});

		const newSubtotal = remainingItems.reduce((total, item) => {
			return total + item.product.price * item.quantity;
		}, 0);

		const newTotalAmount =
			newSubtotal - orderItem.order.discount + orderItem.order.shipping;

		updatedOrder = await prisma.order.update({
			where: { id: orderItem.order.id },
			data: {
				subtotal: newSubtotal,
				totalAmount: newTotalAmount,
				updatedAt: new Date(),
			},
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								price: true,
								image: true,
								category: true,
								description: true,
								rating: true,
							},
						},
					},
					orderBy: {
						createdAt: 'asc',
					},
				},
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			order: updatedOrder,
			message: message,
		});
	} catch (error: unknown) {
		console.error('Error removing item from order:', error);

		if (typeof error === 'object' && error !== null && 'code' in error) {
			const prismaError = error as { code: string };

			if (prismaError.code === 'P2025') {
				return NextResponse.json(
					{ error: 'Item não encontrado' },
					{ status: 404 },
				);
			}
		}

		const errorMessage =
			error instanceof Error ? error.message : 'Erro desconhecido';
		return NextResponse.json(
			{ error: `Erro ao remover item do carrinho: ${errorMessage}` },
			{ status: 500 },
		);
	}
}
