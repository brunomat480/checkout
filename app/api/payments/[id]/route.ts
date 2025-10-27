import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/get-current-user';
import { prisma } from '@/lib/prisma';

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'Usuário não autenticado' },
				{ status: 401 },
			);
		}

		const paymentId = parseInt(id);

		if (!paymentId || isNaN(paymentId)) {
			return NextResponse.json(
				{ error: 'ID do pagamento é obrigatório e deve ser um número válido' },
				{ status: 400 },
			);
		}

		const payment = await prisma.payment.findFirst({
			where: {
				id: paymentId,
				userId: parseInt(currentUser.userId),
			},
			include: {
				order: {
					select: {
						id: true,
						orderNumber: true,
						status: true,
						totalAmount: true,
						createdAt: true,
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

		if (!payment) {
			return NextResponse.json(
				{
					error: 'Pagamento não encontrado',
					details: 'Verifique se o ID do pagamento está correto',
				},
				{ status: 404 },
			);
		}

		let formattedPayment: any = {
			id: payment.id,
			orderId: payment.orderId,
			userId: payment.userId,
			paymentMethod: payment.paymentMethod,
			paymentStatus: payment.paymentStatus,
			amount: payment.amount,
			installments: payment.installments,
			createdAt: payment.createdAt,
			updatedAt: payment.updatedAt,
			expiresAt: payment.expiresAt,
			paidAt: payment.paidAt,
			refundedAt: payment.refundedAt,
			order: payment.order,
			user: payment.user,
		};

		switch (payment.paymentMethod) {
			case PaymentMethod.PIX:
				formattedPayment.pix = {
					code: payment.pixCode,
					qrCode: payment.pixQrCode,
					qrCodeImage: payment.pixImageUrl,
				};
				break;

			case PaymentMethod.BANK_SLIP:
				formattedPayment.bankSlip = {
					code: payment.boletoCode,
					url: payment.boletoUrl,
					barcodeImage: payment.barcodeImage,
				};
				break;

			case PaymentMethod.CREDIT_CARD:
				formattedPayment.creditCard = {
					lastFour: payment.cardLastFour,
					brand: payment.cardBrand,
					installments: payment.installments,
				};
				break;
		}

		if (payment.processorResponse) {
			try {
				formattedPayment.processor = JSON.parse(payment.processorResponse);
			} catch {}
		}

		if (payment.failureReason) {
			formattedPayment.failureReason = payment.failureReason;
		}

		if (payment.externalId) {
			formattedPayment.externalId = payment.externalId;
		}

		return NextResponse.json({
			success: true,
			payment: formattedPayment,
		});
	} catch (error: any) {
		console.error('Error fetching payment:', error);

		if (error.code === 'P2025') {
			return NextResponse.json(
				{ error: 'Pagamento não encontrado' },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				error: 'Erro ao buscar pagamento',
				details: error.message,
			},
			{ status: 500 },
		);
	}
}

export async function PUT(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'Usuário não autenticado' },
				{ status: 401 },
			);
		}

		const orderId = parseInt(id);

		if (!orderId || isNaN(orderId)) {
			return NextResponse.json(
				{ error: 'ID do pedido é obrigatório e deve ser um número válido' },
				{ status: 400 },
			);
		}

		// Buscar a order para pegar o totalAmount
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
				userId: parseInt(currentUser.userId),
			},
		});

		if (!order) {
			return NextResponse.json(
				{ error: 'Pedido não encontrado' },
				{ status: 404 },
			);
		}

		const existingProcessingOrder = await prisma.order.findFirst({
			where: {
				userId: parseInt(currentUser.userId),
				status: OrderStatus.PROCESSING,
				id: { not: orderId },
			},
		});

		if (existingProcessingOrder) {
			await prisma.order.update({
				where: { id: existingProcessingOrder.id },
				data: {
					status: OrderStatus.SHIPPED,
					updatedAt: new Date(),
				},
			});
		}

		// Usar transaction para garantir que tudo acontece junto
		const result = await prisma.$transaction(async (tx) => {
			// Atualizar a order
			const updatedOrder = await tx.order.update({
				where: { id: orderId },
				data: {
					status: OrderStatus.PROCESSING,
					updatedAt: new Date(),
				},
			});

			// Criar o pagamento
			const payment = await tx.payment.create({
				data: {
					orderId: orderId,
					userId: parseInt(currentUser.userId),
					paymentMethod: PaymentMethod.CREDIT_CARD,
					paymentStatus: PaymentStatus.SUCCESS,
					amount: order.totalAmount,
					paidAt: new Date(),
				},
			});

			return { order: updatedOrder, payment };
		});

		return NextResponse.json({
			success: true,
			message: 'Status do pedido atualizado para PROCESSING!',
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
		console.error('Error updating order status:', error);

		if (error.code === 'P2025') {
			return NextResponse.json(
				{ error: 'Pedido não encontrado' },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				error: 'Erro ao atualizar status do pedido',
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
