import { OrderStatus } from '@prisma/client';
import { HTTPError } from 'ky';
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth-utils';
import { getCurrentUser } from '@/lib/get-current-user';
import { prisma } from '@/lib/prisma';

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

		const activeOrder = await prisma.order.findUnique({
			where: {
				user_active_order: {
					userId: userId,
					status: OrderStatus.ACTIVE,
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
		});

		if (!activeOrder) {
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
		}

		return NextResponse.json({
			success: true,
			order: activeOrder,
			message: 'Carrinho encontrado',
		});
	} catch (error) {
		if (error instanceof HTTPError) {
			return NextResponse.json(
				{ error: `Erro interno do servidor: ${error.message}` },
				{ status: 500 },
			);
		}
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
		const { productId, quantity = 1 } = await request.json();

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

		let order = await prisma.order.findUnique({
			where: {
				user_active_order: {
					userId: userId,
					status: OrderStatus.ACTIVE,
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

		const existingItem = await prisma.orderItem.findUnique({
			where: {
				order_product_unique: {
					orderId: order.id,
					productId: product.id,
				},
			},
		});

		console.log(
			'Item existente:',
			existingItem ? `ID: ${existingItem.id}` : 'Nenhum',
		);

		let orderItem: any;
		let message: any;

		if (existingItem) {
			orderItem = await prisma.orderItem.update({
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
			});
			message = `Quantidade atualizada para ${orderItem.quantity} unidades`;
			console.log('Item atualizado:', orderItem.id);
		} else {
			orderItem = await prisma.orderItem.create({
				data: {
					orderId: order.id,
					productId: product.id,
					quantity: quantity,
					price: product.price,
				},
				include: {
					product: true,
				},
			});
			message = 'Item adicionado ao carrinho';
			console.log('Novo item criado:', orderItem.id);
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

		return NextResponse.json(
			{
				success: true,
				order: updatedOrder,
				item: {
					id: orderItem.id,
					productId: orderItem.productId,
					productName: orderItem.product.name,
					quantity: orderItem.quantity,
					price: orderItem.price,
					subtotal: orderItem.product.price * orderItem.quantity,
				},
				message: message,
			},
			{ status: 200 },
		);
	} catch (error: any) {
		if (error.code === 'P2002') {
			return NextResponse.json(
				{ error: 'Item já existe no carrinho' },
				{ status: 409 },
			);
		}

		if (error.code === 'P2025') {
			return NextResponse.json(
				{ error: 'Produto ou pedido não encontrado' },
				{ status: 404 },
			);
		}

		if (error.code === 'P2003') {
			return NextResponse.json(
				{ error: 'Produto não existe' },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ error: `Erro interno ao adicionar item ao carrinho: ${error.message}` },
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
					status: OrderStatus.ACTIVE,
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

		let message = '';
		let updatedOrder: any;

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
	} catch (error: any) {
		console.error('Error removing item from order:', error);

		if (error.code === 'P2025') {
			return NextResponse.json(
				{ error: 'Item não encontrado' },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ error: `Erro ao remover item do carrinho: ${error.message}` },
			{ status: 500 },
		);
	}
}
