// import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
// import { type NextRequest, NextResponse } from 'next/server';
// import { getCurrentUser } from '@/lib/get-current-user';
// import { prisma } from '@/lib/prisma';

// export async function PUT(
// 	_request: NextRequest,
// 	{ params }: { params: { id: string } },
// ) {
// 	try {
// 		const currentUser = await getCurrentUser();

// 		if (!currentUser) {
// 			return NextResponse.json(
// 				{ error: 'Usuário não autenticado' },
// 				{ status: 401 },
// 			);
// 		}

// 		const orderId = parseInt(params.id);

// 		if (!orderId || isNaN(orderId)) {
// 			return NextResponse.json(
// 				{ error: 'ID do pedido é obrigatório e deve ser um número válido' },
// 				{ status: 400 },
// 			);
// 		}

// 		const order = await prisma.order.findFirst({
// 			where: {
// 				id: orderId,
// 				userId: parseInt(currentUser.userId),
// 			},
// 			include: {
// 				items: {
// 					include: {
// 						product: true,
// 					},
// 				},
// 				payments: {
// 					orderBy: {
// 						createdAt: 'desc',
// 					},
// 					take: 1,
// 				},
// 			},
// 		});

// 		if (!order) {
// 			return NextResponse.json(
// 				{ error: 'Pedido não encontrado' },
// 				{ status: 404 },
// 			);
// 		}

// 		if (!order.items || order.items.length === 0) {
// 			return NextResponse.json(
// 				{
// 					error: 'Não é possível pagar um pedido vazio',
// 					details: 'Adicione itens ao pedido antes de realizar o pagamento',
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		if (order.totalAmount <= 0) {
// 			return NextResponse.json(
// 				{
// 					error: 'Valor do pedido inválido',
// 					details: 'O valor total do pedido deve ser maior que zero',
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		if (
// 			order.status !== OrderStatus.PENDING &&
// 			order.status !== OrderStatus.ACTIVE
// 		) {
// 			return NextResponse.json(
// 				{
// 					error: 'Pedido não pode ser pago no status atual',
// 					details: `Status atual: ${order.status}. Só é possível pagar pedidos com status PENDING ou ACTIVE`,
// 					currentStatus: order.status,
// 				},
// 				{ status: 409 },
// 			);
// 		}

// 		const successfulPayment = order.payments.find(
// 			(payment) => payment.paymentStatus === PaymentStatus.SUCCESS,
// 		);

// 		if (successfulPayment) {
// 			return NextResponse.json(
// 				{
// 					error: 'Este pedido já foi pago',
// 					details:
// 						'Não é possível pagar um pedido que já possui pagamento confirmado',
// 					paymentId: successfulPayment.id,
// 					paidAt: successfulPayment.paidAt,
// 				},
// 				{ status: 409 },
// 			);
// 		}

// 		try {
// 			const result = await prisma.$transaction(async (tx) => {
// 				const updatedOrder = await tx.order.update({
// 					where: { id: orderId },
// 					data: {
// 						status: OrderStatus.PROCESSING,
// 						updatedAt: new Date(),
// 					},
// 					include: {
// 						items: {
// 							include: {
// 								product: true,
// 							},
// 						},
// 					},
// 				});

// 				let payment: any;

// 				const existingPendingPayment = order.payments.find(
// 					(p) => p.paymentStatus === PaymentStatus.PENDING,
// 				);

// 				if (existingPendingPayment) {
// 					payment = await tx.payment.update({
// 						where: { id: existingPendingPayment.id },
// 						data: {
// 							paymentStatus: PaymentStatus.SUCCESS,
// 							paidAt: new Date(),
// 							updatedAt: new Date(),
// 							processorResponse: JSON.stringify({
// 								manualApproval: true,
// 								approvedAt: new Date().toISOString(),
// 								approvedBy: `user:${currentUser.userId}`,
// 							}),
// 						},
// 					});
// 				} else {
// 					payment = await tx.payment.create({
// 						data: {
// 							orderId: orderId,
// 							userId: parseInt(currentUser.userId),
// 							paymentMethod: PaymentMethod.CREDIT_CARD, // Ou outro enum válido
// 							paymentStatus: PaymentStatus.SUCCESS,
// 							amount: order.totalAmount,
// 							paidAt: new Date(),
// 							externalId: `manual_${orderId}_${Date.now()}`,
// 							processorResponse: JSON.stringify({
// 								manualApproval: true,
// 								approvedAt: new Date().toISOString(),
// 								approvedBy: `user:${currentUser.userId}`,
// 								note: 'Pagamento manualmente aprovado via admin',
// 							}),
// 						},
// 					});
// 				}

// 				return { order: updatedOrder, payment };
// 			});

// 			return NextResponse.json({
// 				success: true,
// 				message: 'Pedido pago com sucesso!',
// 				order: {
// 					id: result.order.id,
// 					orderNumber: result.order.orderNumber,
// 					status: result.order.status,
// 					totalAmount: result.order.totalAmount,
// 					updatedAt: result.order.updatedAt,
// 				},
// 				payment: {
// 					id: result.payment.id,
// 					status: result.payment.paymentStatus,
// 					amount: result.payment.amount,
// 					paidAt: result.payment.paidAt,
// 					paymentMethod: result.payment.paymentMethod,
// 				},
// 			});
// 		} catch (transactionError: any) {
// 			if (transactionError.code === 'P2002') {
// 				return NextResponse.json(
// 					{
// 						error: 'Erro de duplicação',
// 						details: 'Já existe um pagamento com os mesmos dados',
// 					},
// 					{ status: 400 },
// 				);
// 			}

// 			throw transactionError;
// 		}
// 	} catch (error: any) {
// 		if (error.code === 'P2025') {
// 			return NextResponse.json(
// 				{ error: 'Pedido não encontrado' },
// 				{ status: 404 },
// 			);
// 		}

// 		if (error.code === 'P2003') {
// 			return NextResponse.json(
// 				{ error: 'Erro de referência - verifique os dados do pedido' },
// 				{ status: 400 },
// 			);
// 		}

// 		return NextResponse.json(
// 			{
// 				error: 'Erro ao processar pagamento',
// 				details: error.message,
// 			},
// 			{ status: 500 },
// 		);
// 	}
// }

// // export async function GET(
// // 	request: NextRequest,
// // 	{ params }: { params: { id: string } },
// // ) {
// // 	try {
// // 		const currentUser = await getCurrentUser();

// // 		if (!currentUser) {
// // 			return NextResponse.json(
// // 				{ error: 'Usuário não autenticado' },
// // 				{ status: 401 },
// // 			);
// // 		}

// // 		const orderId = parseInt(params.id);

// // 		if (!orderId || isNaN(orderId)) {
// // 			return NextResponse.json(
// // 				{ error: 'ID do pedido é obrigatório e deve ser um número válido' },
// // 				{ status: 400 },
// // 			);
// // 		}

// // 		const order = await prisma.order.findFirst({
// // 			where: {
// // 				id: orderId,
// // 				userId: parseInt(currentUser.userId),
// // 			},
// // 			include: {
// // 				payments: {
// // 					orderBy: {
// // 						createdAt: 'desc',
// // 					},
// // 					take: 5,
// // 				},
// // 				items: {
// // 					include: {
// // 						product: {
// // 							select: {
// // 								id: true,
// // 								name: true,
// // 								price: true,
// // 							},
// // 						},
// // 					},
// // 				},
// // 			},
// // 		});

// // 		if (!order) {
// // 			return NextResponse.json(
// // 				{ error: 'Pedido não encontrado' },
// // 				{ status: 404 },
// // 			);
// // 		}

// // 		const successfulPayment = order.payments.find(
// // 			(p) => p.paymentStatus === PaymentStatus.SUCCESS,
// // 		);

// // 		return NextResponse.json({
// // 			success: true,
// // 			order: {
// // 				id: order.id,
// // 				orderNumber: order.orderNumber,
// // 				status: order.status,
// // 				totalAmount: order.totalAmount,
// // 				itemsCount: order.items.length,
// // 			},
// // 			payment: successfulPayment
// // 				? {
// // 						id: successfulPayment.id,
// // 						status: successfulPayment.paymentStatus,
// // 						amount: successfulPayment.amount,
// // 						paidAt: successfulPayment.paidAt,
// // 						paymentMethod: successfulPayment.paymentMethod,
// // 					}
// // 				: null,
// // 			canPay:
// // 				order.status === OrderStatus.PENDING ||
// // 				order.status === OrderStatus.ACTIVE,
// // 			hasSuccessfulPayment: !!successfulPayment,
// // 		});
// // 	} catch (error: any) {
// // 		console.error('Error checking payment status:', error);
// // 		return NextResponse.json(
// // 			{ error: 'Erro ao verificar status do pagamento' },
// // 			{ status: 500 },
// // 		);
// // 	}
// // }

import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/get-current-user';
import { prisma } from '@/lib/prisma';

export async function PUT(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'Usuário não autenticado' },
				{ status: 401 },
			);
		}

		const orderId = parseInt(params.id);

		if (!orderId || isNaN(orderId)) {
			return NextResponse.json(
				{ error: 'ID do pedido é obrigatório e deve ser um número válido' },
				{ status: 400 },
			);
		}

		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
				userId: parseInt(currentUser.userId),
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
				payments: {
					orderBy: {
						createdAt: 'desc',
					},
					take: 1,
				},
			},
		});

		if (!order) {
			return NextResponse.json(
				{ error: 'Pedido não encontrado' },
				{ status: 404 },
			);
		}

		if (!order.items || order.items.length === 0) {
			return NextResponse.json(
				{
					error: 'Não é possível pagar um pedido vazio',
					details: 'Adicione itens ao pedido antes de realizar o pagamento',
				},
				{ status: 400 },
			);
		}

		if (order.totalAmount <= 0) {
			return NextResponse.json(
				{
					error: 'Valor do pedido inválido',
					details: 'O valor total do pedido deve ser maior que zero',
				},
				{ status: 400 },
			);
		}

		if (
			order.status !== OrderStatus.PENDING &&
			order.status !== OrderStatus.ACTIVE
		) {
			return NextResponse.json(
				{
					error: 'Pedido não pode ser pago no status atual',
					details: `Status atual: ${order.status}. Só é possível pagar pedidos com status PENDING ou ACTIVE`,
					currentStatus: order.status,
				},
				{ status: 409 },
			);
		}

		const successfulPayment = order.payments.find(
			(payment) => payment.paymentStatus === PaymentStatus.SUCCESS,
		);

		if (successfulPayment) {
			return NextResponse.json(
				{
					error: 'Este pedido já foi pago',
					details:
						'Não é possível pagar um pedido que já possui pagamento confirmado',
					paymentId: successfulPayment.id,
					paidAt: successfulPayment.paidAt,
				},
				{ status: 409 },
			);
		}

		const result = await prisma.$transaction(async (tx) => {
			const updatedOrder = await tx.order.update({
				where: { id: orderId },
				data: {
					status: OrderStatus.PROCESSING,
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

			let payment: any;

			const existingPendingPayment = order.payments.find(
				(p) => p.paymentStatus === PaymentStatus.PENDING,
			);

			if (existingPendingPayment) {
				payment = await tx.payment.update({
					where: { id: existingPendingPayment.id },
					data: {
						paymentStatus: PaymentStatus.SUCCESS,
						paidAt: new Date(),
						updatedAt: new Date(),
						processorResponse: JSON.stringify({
							manualApproval: true,
							approvedAt: new Date().toISOString(),
							approvedBy: `user:${currentUser.userId}`,
						}),
					},
				});
			} else {
				// 🔥 AGORA SEM externalId - problema resolvido!
				payment = await tx.payment.create({
					data: {
						orderId: orderId,
						userId: parseInt(currentUser.userId),
						paymentMethod: PaymentMethod.CREDIT_CARD,
						paymentStatus: PaymentStatus.SUCCESS,
						amount: order.totalAmount,
						paidAt: new Date(),
						processorResponse: JSON.stringify({
							manualApproval: true,
							approvedAt: new Date().toISOString(),
							approvedBy: `user:${currentUser.userId}`,
							note: 'Pagamento manualmente aprovado via admin',
						}),
					},
				});
			}

			return { order: updatedOrder, payment };
		});

		console.log(
			`✅ Pedido ${orderId} marcado como pago com sucesso pelo usuário ${currentUser.userId}`,
		);

		return NextResponse.json({
			success: true,
			message: 'Pedido pago com sucesso!',
			order: {
				id: result.order.id,
				orderNumber: result.order.orderNumber,
				status: result.order.status,
				totalAmount: result.order.totalAmount,
				updatedAt: result.order.updatedAt,
			},
			payment: {
				id: result.payment.id,
				status: result.payment.paymentStatus,
				amount: result.payment.amount,
				paidAt: result.payment.paidAt,
				paymentMethod: result.payment.paymentMethod,
			},
		});
	} catch (error: any) {
		console.error('Error processing payment:', error);

		if (error.code === 'P2025') {
			return NextResponse.json(
				{ error: 'Pedido não encontrado' },
				{ status: 404 },
			);
		}

		if (error.code === 'P2003') {
			return NextResponse.json(
				{ error: 'Erro de referência - verifique os dados do pedido' },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: 'Erro ao processar pagamento',
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
