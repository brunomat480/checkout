import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { HTTPError } from 'ky';
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/get-current-user';
import { prisma } from '@/lib/prisma';

interface FormattedPayment {
	id: number;
	orderId: number;
	userId: number;
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
	amount: number;
	installments: number | null;
	createdAt: Date;
	updatedAt: Date;
	expiresAt: Date | null;
	paidAt: Date | null;
	refundedAt: Date | null;
	order: {
		id: number;
		orderNumber: string | null;
		status: OrderStatus;
		totalAmount: number;
		createdAt: Date;
	};
	user: {
		id: number;
		name: string | null;
		email: string;
	};
	pix?: {
		code: string | null;
		qrCode: string | null;
		qrCodeImage: string | null;
	};
	bankSlip?: {
		code: string | null;
		url: string | null;
		barcodeImage: string | null;
	};
	creditCard?: {
		lastFour: string | null;
		brand: string | null;
		installments: number;
	};
	processor?: unknown;
	failureReason?: string | null;
	externalId?: string | null;
}

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

		const formattedPayment: FormattedPayment = {
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
			order: {
				id: payment.order.id,
				orderNumber: payment.order.orderNumber,
				status: payment.order.status,
				totalAmount: payment.order.totalAmount,
				createdAt: payment.order.createdAt,
			},
			user: {
				id: payment.user.id,
				name: payment.user.name,
				email: payment.user.email,
			},
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
					installments: payment.installments || 1,
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
	} catch (error: unknown) {
		console.error('Error fetching payment:', error);

		if (error instanceof HTTPError) {
			return NextResponse.json(
				{ error: `Erro HTTP: ${error.message}` },
				{ status: error.response.status },
			);
		}

		if (typeof error === 'object' && error !== null && 'code' in error) {
			const prismaError = error as { code: string };

			if (prismaError.code === 'P2025') {
				return NextResponse.json(
					{ error: 'Pagamento não encontrado' },
					{ status: 404 },
				);
			}
		}

		const errorMessage =
			error instanceof Error ? error.message : 'Erro desconhecido';
		return NextResponse.json(
			{
				error: 'Erro ao buscar pagamento',
				details: errorMessage,
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

		const result = await prisma.$transaction(async (tx) => {
			const updatedOrder = await tx.order.update({
				where: { id: orderId },
				data: {
					status: OrderStatus.PROCESSING,
					updatedAt: new Date(),
				},
			});

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
	} catch (error: unknown) {
		if (error instanceof HTTPError) {
			return NextResponse.json(
				{ error: `Erro HTTP: ${error.message}` },
				{ status: error.response.status },
			);
		}

		if (typeof error === 'object' && error !== null && 'code' in error) {
			const prismaError = error as { code: string };

			if (prismaError.code === 'P2025') {
				return NextResponse.json(
					{ error: 'Pedido não encontrado' },
					{ status: 404 },
				);
			}
		}

		const errorMessage =
			error instanceof Error ? error.message : 'Erro desconhecido';
		return NextResponse.json(
			{
				error: 'Erro ao atualizar status do pedido',
				details: errorMessage,
			},
			{ status: 500 },
		);
	}
}
