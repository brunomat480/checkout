// // // import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
// // // import { type NextRequest, NextResponse } from 'next/server';
// // // import { getCurrentUser } from '@/lib/get-current-user';
// // // import { prisma } from '@/lib/prisma';

// // // const paymentTypeMap = {
// // // 	pix: PaymentMethod.PIX,
// // // 	bank_slip: PaymentMethod.BANK_SLIP,
// // // 	credit_card: PaymentMethod.CREDIT_CARD,
// // // };

// // // export async function POST(request: NextRequest) {
// // // 	try {
// // // 		const currentUser = await getCurrentUser();

// // // 		if (!currentUser) {
// // // 			return NextResponse.json(
// // // 				{ error: 'Usuário não autenticado' },
// // // 				{ status: 401 },
// // // 			);
// // // 		}

// // // 		const { orderId, type, installments = 1, card } = await request.json();

// // // 		if (!orderId || !type) {
// // // 			return NextResponse.json(
// // // 				{ error: 'ID do pedido e tipo de pagamento são obrigatórios' },
// // // 				{ status: 400 },
// // // 			);
// // // 		}

// // // 		if (!Object.keys(paymentTypeMap).includes(type)) {
// // // 			return NextResponse.json(
// // // 				{
// // // 					error: 'Tipo de pagamento inválido',
// // // 					validTypes: ['pix', 'bank_slip', 'credit_card'],
// // // 				},
// // // 				{ status: 400 },
// // // 			);
// // // 		}

// // // 		if (type === 'credit_card' && !card) {
// // // 			return NextResponse.json(
// // // 				{ error: 'Dados do cartão são obrigatórios para pagamento com cartão' },
// // // 				{ status: 400 },
// // // 			);
// // // 		}

// // // 		const order = await prisma.order.findFirst({
// // // 			where: {
// // // 				id: parseInt(orderId),
// // // 				userId: parseInt(currentUser.userId),
// // // 				status: OrderStatus.ACTIVE,
// // // 			},
// // // 			include: {
// // // 				items: {
// // // 					include: {
// // // 						product: true,
// // // 					},
// // // 				},
// // // 			},
// // // 		});

// // // 		if (!order) {
// // // 			return NextResponse.json(
// // // 				{ error: 'Pedido não encontrado ou não está ativo' },
// // // 				{ status: 404 },
// // // 			);
// // // 		}

// // // 		const existingPayment = await prisma.payment.findFirst({
// // // 			where: {
// // // 				orderId: order.id,
// // // 				paymentStatus: {
// // // 					in: [
// // // 						PaymentStatus.CREATED,
// // // 						PaymentStatus.PENDING,
// // // 						PaymentStatus.PROCESSING,
// // // 					],
// // // 				},
// // // 			},
// // // 		});

// // // 		if (existingPayment) {
// // // 			return NextResponse.json(
// // // 				{
// // // 					error: 'Já existe um pagamento em andamento para este pedido',
// // // 					existingPaymentId: existingPayment.id,
// // // 				},
// // // 				{ status: 409 },
// // // 			);
// // // 		}

// // // 		let paymentResult: any;

// // // 		switch (type) {
// // // 			case 'pix':
// // // 				paymentResult = await createPixPayment(order, currentUser.userId);
// // // 				break;

// // // 			case 'bank_slip':
// // // 				paymentResult = await createBankSlipPayment(order, currentUser.userId);
// // // 				break;

// // // 			case 'credit_card':
// // // 				paymentResult = await processCreditCardPayment(
// // // 					order,
// // // 					currentUser.userId,
// // // 					card,
// // // 					installments,
// // // 				);
// // // 				break;

// // // 			default:
// // // 				return NextResponse.json(
// // // 					{ error: 'Tipo de pagamento não implementado' },
// // // 					{ status: 400 },
// // // 				);
// // // 		}

// // // 		if (!paymentResult.success) {
// // // 			return NextResponse.json({ error: paymentResult.error }, { status: 400 });
// // // 		}

// // // 		return NextResponse.json(paymentResult.response);
// // // 	} catch (error: any) {
// // // 		console.error('Error creating payment:', error);
// // // 		return NextResponse.json(
// // // 			{ error: 'Erro ao criar pagamento: ' + error.message },
// // // 			{ status: 500 },
// // // 		);
// // // 	}
// // // }

// // // async function createPixPayment(order: any, userId: string) {
// // // 	try {
// // // 		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// // // 		const pixCode = generatePixCode(order.id, order.totalAmount);

// // // 		const payment = await prisma.payment.create({
// // // 			data: {
// // // 				orderId: order.id,
// // // 				userId: parseInt(userId),
// // // 				paymentMethod: PaymentMethod.PIX,
// // // 				paymentStatus: PaymentStatus.PENDING,
// // // 				amount: order.totalAmount,
// // // 				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
// // // 				pixCode: pixCode,
// // // 				pixQrCode: `${baseUrl}/api/payments/${order.id}/qrcode`,
// // // 				pixImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`,
// // // 			},
// // // 		});

// // // 		await prisma.order.update({
// // // 			where: { id: order.id },
// // // 			data: { status: OrderStatus.PENDING },
// // // 		});

// // // 		const response = {
// // // 			success: true,
// // // 			payment: {
// // // 				id: payment.id,
// // // 				type: 'pix',
// // // 				status: 'pending',
// // // 				amount: payment.amount,
// // // 				pix_code: payment.pixCode,
// // // 				qr_code: payment.pixQrCode,
// // // 				qr_code_image: payment.pixImageUrl,
// // // 				expires_at: payment.expiresAt,
// // // 				expires_in: '24 horas',
// // // 				created_at: payment.createdAt,
// // // 			},
// // // 			message: 'Pagamento PIX criado com sucesso',
// // // 		};

// // // 		return { success: true, response };
// // // 	} catch (error: any) {
// // // 		console.error('Error creating PIX payment:', error);
// // // 		return { success: false, error: 'Erro ao criar pagamento PIX' };
// // // 	}
// // // }

// // // async function createBankSlipPayment(order: any, userId: string) {
// // // 	try {
// // // 		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// // // 		const bankSlipCode = generateBankSlipCode(order.id, order.totalAmount);

// // // 		const payment = await prisma.payment.create({
// // // 			data: {
// // // 				orderId: order.id,
// // // 				userId: parseInt(userId),
// // // 				paymentMethod: PaymentMethod.BANK_SLIP,
// // // 				paymentStatus: PaymentStatus.PENDING,
// // // 				amount: order.totalAmount,
// // // 				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
// // // 				boletoCode: bankSlipCode,
// // // 				boletoUrl: `${baseUrl}/api/payments/${order.id}/boleto`,
// // // 				barcodeImage: `${baseUrl}/api/payments/${order.id}/barcode`,
// // // 			},
// // // 		});

// // // 		await prisma.order.update({
// // // 			where: { id: order.id },
// // // 			data: { status: OrderStatus.PENDING },
// // // 		});

// // // 		const response = {
// // // 			success: true,
// // // 			payment: {
// // // 				id: payment.id,
// // // 				type: 'bank_slip',
// // // 				status: 'pending',
// // // 				amount: payment.amount,
// // // 				bank_slip_code: payment.boletoCode,
// // // 				bank_slip_url: payment.boletoUrl,
// // // 				barcode_image: payment.barcodeImage,
// // // 				expires_at: payment.expiresAt,
// // // 				expires_in: '24 horas',
// // // 				created_at: payment.createdAt,
// // // 			},
// // // 			message: 'Pagamento com boleto criado com sucesso',
// // // 		};

// // // 		return { success: true, response };
// // // 	} catch (error: any) {
// // // 		console.error('Error creating bank slip payment:', error);
// // // 		return { success: false, error: 'Erro ao criar pagamento com boleto' };
// // // 	}
// // // }

// // // async function processCreditCardPayment(
// // // 	order: any,
// // // 	userId: string,
// // // 	card: any,
// // // 	installments: number,
// // // ) {
// // // 	try {
// // // 		if (!card.number || !card.holder_name || !card.expiry || !card.cvv) {
// // // 			return {
// // // 				success: false,
// // // 				error:
// // // 					'Dados do cartão incompletos. São necessários: number, holder_name, expiry, cvv',
// // // 			};
// // // 		}

// // // 		const processingResult = await simulateCreditCardProcessing(
// // // 			card,
// // // 			order.totalAmount,
// // // 		);

// // // 		// 🔥 CORREÇÃO: Use os enums do Prisma diretamente
// // // 		let paymentStatus: PaymentStatus = processingResult.success
// // // 			? PaymentStatus.SUCCESS
// // // 			: PaymentStatus.FAILED;

// // // 		let orderStatus: OrderStatus = processingResult.success
// // // 			? OrderStatus.PROCESSING
// // // 			: OrderStatus.ACTIVE;

// // // 		let message = processingResult.success
// // // 			? 'Pagamento com cartão aprovado com sucesso!'
// // // 			: `Pagamento recusado: ${processingResult.error}`;

// // // 		const payment = await prisma.payment.create({
// // // 			data: {
// // // 				orderId: order.id,
// // // 				userId: parseInt(userId),
// // // 				paymentMethod: PaymentMethod.CREDIT_CARD,
// // // 				paymentStatus: paymentStatus,
// // // 				amount: order.totalAmount,
// // // 				installments: installments,
// // // 				externalId: processingResult.transactionId,
// // // 				cardLastFour: card.number.slice(-4),
// // // 				cardBrand: card.brand || 'Unknown',
// // // 				processorResponse: JSON.stringify(processingResult),
// // // 				failureReason: processingResult.error || null,
// // // 				paidAt: processingResult.success ? new Date() : null,
// // // 			},
// // // 		});

// // // 		await prisma.order.update({
// // // 			where: { id: order.id },
// // // 			data: { status: orderStatus },
// // // 		});

// // // 		const response = {
// // // 			success: processingResult.success,
// // // 			payment: {
// // // 				id: payment.id,
// // // 				type: 'credit_card',
// // // 				status: paymentStatus.toLowerCase(),
// // // 				amount: payment.amount,
// // // 				card_last_four: payment.cardLastFour,
// // // 				card_brand: payment.cardBrand,
// // // 				installments: payment.installments,
// // // 				paid_at: payment.paidAt,
// // // 				transaction_id: payment.externalId,
// // // 				created_at: payment.createdAt,
// // // 			},
// // // 			message: message,
// // // 		};

// // // 		return { success: true, response };
// // // 	} catch (error: any) {
// // // 		console.error('Error processing credit card payment:', error);
// // // 		return { success: false, error: 'Erro ao processar pagamento com cartão' };
// // // 	}
// // // }

// // // async function simulateCreditCardProcessing(card: any, amount: number) {
// // // 	await new Promise((resolve) => setTimeout(resolve, 2000));

// // // 	const cleanNumber = card.number.replace(/\s/g, '');
// // // 	if (cleanNumber.length !== 16) {
// // // 		return {
// // // 			success: false,
// // // 			error: 'Número do cartão inválido',
// // // 			transactionId: `fail_${Date.now()}`,
// // // 		};
// // // 	}

// // // 	const [month, year] = card.expiry.split('/');
// // // 	const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
// // // 	if (expiryDate < new Date()) {
// // // 		return {
// // // 			success: false,
// // // 			error: 'Cartão expirado',
// // // 			transactionId: `fail_${Date.now()}`,
// // // 		};
// // // 	}

// // // 	if (!card.cvv || card.cvv.length < 3) {
// // // 		return {
// // // 			success: false,
// // // 			error: 'CVV inválido',
// // // 			transactionId: `fail_${Date.now()}`,
// // // 		};
// // // 	}

// // // 	const isSuccess = Math.random() > 0.2;

// // // 	if (isSuccess) {
// // // 		return {
// // // 			success: true,
// // // 			transactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
// // // 			authorizationCode: `auth_${Math.random().toString(36).substring(2, 8)}`,
// // // 		};
// // // 	} else {
// // // 		const errors = [
// // // 			'Cartão recusado pela operadora',
// // // 			'Saldo insuficiente',
// // // 			'Transação não autorizada',
// // // 			'Limite do cartão excedido',
// // // 		];
// // // 		return {
// // // 			success: false,
// // // 			error: errors[Math.floor(Math.random() * errors.length)],
// // // 			transactionId: `fail_${Date.now()}`,
// // // 		};
// // // 	}
// // // }

// // // export async function GET(request: NextRequest) {
// // // 	try {
// // // 		const currentUser = await getCurrentUser();

// // // 		if (!currentUser) {
// // // 			return NextResponse.json(
// // // 				{ error: 'Usuário não autenticado' },
// // // 				{ status: 401 },
// // // 			);
// // // 		}

// // // 		const { searchParams } = new URL(request.url);
// // // 		const orderId = searchParams.get('orderId');

// // // 		const whereClause: any = {
// // // 			userId: parseInt(currentUser.userId),
// // // 		};

// // // 		if (orderId) {
// // // 			whereClause.orderId = parseInt(orderId);
// // // 		}

// // // 		const payments = await prisma.payment.findMany({
// // // 			where: whereClause,
// // // 			include: {
// // // 				order: {
// // // 					select: {
// // // 						id: true,
// // // 						orderNumber: true,
// // // 						status: true,
// // // 					},
// // // 				},
// // // 			},
// // // 			orderBy: {
// // // 				createdAt: 'desc',
// // // 			},
// // // 		});

// // // 		const formattedPayments = payments.map((payment) => {
// // // 			const basePayment = {
// // // 				id: payment.id,
// // // 				type: getPaymentTypeFromMethod(payment.paymentMethod),
// // // 				status: payment.paymentStatus.toLowerCase(),
// // // 				amount: payment.amount,
// // // 				createdAt: payment.createdAt,
// // // 				expiresAt: payment.expiresAt,
// // // 				paidAt: payment.paidAt,
// // // 			};

// // // 			if (payment.paymentMethod === PaymentMethod.PIX) {
// // // 				return {
// // // 					...basePayment,
// // // 					pix_code: payment.pixCode,
// // // 					qr_code: payment.pixQrCode,
// // // 				};
// // // 			} else if (payment.paymentMethod === PaymentMethod.BANK_SLIP) {
// // // 				return {
// // // 					...basePayment,
// // // 					bank_slip_code: payment.boletoCode,
// // // 					bank_slip_url: payment.boletoUrl,
// // // 				};
// // // 			} else if (payment.paymentMethod === PaymentMethod.CREDIT_CARD) {
// // // 				return {
// // // 					...basePayment,
// // // 					card_last_four: payment.cardLastFour,
// // // 					card_brand: payment.cardBrand,
// // // 					installments: payment.installments,
// // // 				};
// // // 			}

// // // 			return basePayment;
// // // 		});

// // // 		return NextResponse.json({
// // // 			success: true,
// // // 			payments: formattedPayments,
// // // 		});
// // // 	} catch (error: any) {
// // // 		console.error('Error fetching payments:', error);
// // // 		return NextResponse.json(
// // // 			{ error: 'Erro ao buscar pagamentos' },
// // // 			{ status: 500 },
// // // 		);
// // // 	}
// // // }

// // // function generatePixCode(paymentId: number, amount: number): string {
// // // 	const amountInCents = Math.round(amount * 100);
// // // 	return `00020126580014br.gov.bcb.pix0136${paymentId}${Date.now()}52040000530398654${amountInCents.toString().padStart(2, '0')}${Math.random().toString(36).substring(2, 10)}6304`;
// // // }

// // // function generateBankSlipCode(paymentId: number, amount: number): string {
// // // 	const amountFormatted = amount.toFixed(2).replace('.', '').padStart(10, '0');
// // // 	return `23793.38128 60000.000000 00000.000000 0 ${paymentId.toString().padStart(8, '0')} ${amountFormatted}`;
// // // }

// // // function getPaymentTypeFromMethod(method: PaymentMethod): string {
// // // 	const reverseMap = {
// // // 		[PaymentMethod.PIX]: 'pix',
// // // 		[PaymentMethod.BANK_SLIP]: 'bank_slip',
// // // 		[PaymentMethod.CREDIT_CARD]: 'credit_card',
// // // 	};
// // // 	return reverseMap[method];
// // // }

// // import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
// // import { type NextRequest, NextResponse } from 'next/server';
// // import { getCurrentUser } from '@/lib/get-current-user';
// // import { prisma } from '@/lib/prisma';

// // const paymentTypeMap = {
// // 	pix: PaymentMethod.PIX,
// // 	bank_slip: PaymentMethod.BANK_SLIP,
// // 	credit_card: PaymentMethod.CREDIT_CARD,
// // };

// // export async function POST(request: NextRequest) {
// // 	try {
// // 		const currentUser = await getCurrentUser();

// // 		if (!currentUser) {
// // 			return NextResponse.json(
// // 				{ error: 'Usuário não autenticado' },
// // 				{ status: 401 },
// // 			);
// // 		}

// // 		const { orderId, type, installments = 1, card } = await request.json();

// // 		if (!orderId || !type) {
// // 			return NextResponse.json(
// // 				{ error: 'ID do pedido e tipo de pagamento são obrigatórios' },
// // 				{ status: 400 },
// // 			);
// // 		}

// // 		if (!Object.keys(paymentTypeMap).includes(type)) {
// // 			return NextResponse.json(
// // 				{
// // 					error: 'Tipo de pagamento inválido',
// // 					validTypes: ['pix', 'bank_slip', 'credit_card'],
// // 				},
// // 				{ status: 400 },
// // 			);
// // 		}

// // 		if (type === 'credit_card' && !card) {
// // 			return NextResponse.json(
// // 				{ error: 'Dados do cartão são obrigatórios para pagamento com cartão' },
// // 				{ status: 400 },
// // 			);
// // 		}

// // 		const order = await prisma.order.findFirst({
// // 			where: {
// // 				id: parseInt(orderId),
// // 				userId: parseInt(currentUser.userId),
// // 				status: {
// // 					in: [OrderStatus.ACTIVE, OrderStatus.PENDING],
// // 				},
// // 			},
// // 			include: {
// // 				items: {
// // 					include: {
// // 						product: true,
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

// // 		const existingPendingPayments = await prisma.payment.findMany({
// // 			where: {
// // 				orderId: order.id,
// // 				paymentStatus: {
// // 					in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING],
// // 				},
// // 			},
// // 		});

// // 		console.log(
// // 			`📄 Pagamentos pendentes encontrados: ${existingPendingPayments.length}`,
// // 		);

// // 		let paymentResult: any;

// // 		switch (type) {
// // 			case 'pix':
// // 				paymentResult = await createPixPayment(
// // 					order,
// // 					currentUser.userId,
// // 					existingPendingPayments,
// // 				);
// // 				break;

// // 			case 'bank_slip':
// // 				paymentResult = await createBankSlipPayment(
// // 					order,
// // 					currentUser.userId,
// // 					existingPendingPayments,
// // 				);
// // 				break;

// // 			case 'credit_card':
// // 				paymentResult = await processCreditCardPayment(
// // 					order,
// // 					currentUser.userId,
// // 					card,
// // 					installments,
// // 					existingPendingPayments,
// // 				);
// // 				break;

// // 			default:
// // 				return NextResponse.json(
// // 					{ error: 'Tipo de pagamento não implementado' },
// // 					{ status: 400 },
// // 				);
// // 		}

// // 		if (!paymentResult.success) {
// // 			return NextResponse.json({ error: paymentResult.error }, { status: 400 });
// // 		}

// // 		return NextResponse.json(paymentResult.response);
// // 	} catch (error: any) {
// // 		console.error('Error creating payment:', error);
// // 		return NextResponse.json(
// // 			{ error: 'Erro ao criar pagamento: ' + error.message },
// // 			{ status: 500 },
// // 		);
// // 	}
// // }

// // // 🔥 FUNÇÃO PARA CANCELAR PAGAMENTOS PENDENTES ANTERIORES
// // async function cancelPreviousPendingPayments(pendingPayments: any[]) {
// // 	if (pendingPayments.length === 0) return;

// // 	console.log(
// // 		`🔄 Cancelando ${pendingPayments.length} pagamento(s) pendente(s) anterior(es)...`,
// // 	);

// // 	try {
// // 		await prisma.payment.updateMany({
// // 			where: {
// // 				id: {
// // 					in: pendingPayments.map((p) => p.id),
// // 				},
// // 			},
// // 			data: {
// // 				paymentStatus: PaymentStatus.CANCELLED,
// // 				updatedAt: new Date(),
// // 			},
// // 		});
// // 		console.log('✅ Pagamentos anteriores cancelados com sucesso');
// // 	} catch (error) {
// // 		console.error('❌ Erro ao cancelar pagamentos anteriores:', error);
// // 	}
// // }

// // async function createPixPayment(
// // 	order: any,
// // 	userId: string,
// // 	previousPayments: any[],
// // ) {
// // 	try {
// // 		await cancelPreviousPendingPayments(previousPayments);

// // 		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// // 		const pixCode = generatePixCode(order.id, order.totalAmount);

// // 		const payment = await prisma.payment.create({
// // 			data: {
// // 				orderId: order.id,
// // 				userId: parseInt(userId),
// // 				paymentMethod: PaymentMethod.PIX,
// // 				paymentStatus: PaymentStatus.PENDING,
// // 				amount: order.totalAmount,
// // 				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
// // 				pixCode: pixCode,
// // 				pixQrCode: `${baseUrl}/api/payments/${order.id}/qrcode`,
// // 				pixImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`,
// // 			},
// // 		});

// // 		if (order.status !== OrderStatus.PENDING) {
// // 			await prisma.order.update({
// // 				where: { id: order.id },
// // 				data: { status: OrderStatus.PENDING },
// // 			});
// // 		}

// // 		const response = {
// // 			success: true,
// // 			payment: {
// // 				id: payment.id,
// // 				type: 'pix',
// // 				status: 'pending',
// // 				amount: payment.amount,
// // 				pix_code: payment.pixCode,
// // 				qr_code: payment.pixQrCode,
// // 				qr_code_image: payment.pixImageUrl,
// // 				expires_at: payment.expiresAt,
// // 				expires_in: '24 horas',
// // 				created_at: payment.createdAt,
// // 			},
// // 			message: 'Pagamento PIX criado com sucesso',
// // 			cancelled_previous_payments: previousPayments.length,
// // 		};

// // 		return { success: true, response };
// // 	} catch (error: any) {
// // 		console.error('Error creating PIX payment:', error);
// // 		return { success: false, error: 'Erro ao criar pagamento PIX' };
// // 	}
// // }

// // async function createBankSlipPayment(
// // 	order: any,
// // 	userId: string,
// // 	previousPayments: any[],
// // ) {
// // 	try {
// // 		await cancelPreviousPendingPayments(previousPayments);

// // 		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// // 		const bankSlipCode = generateBankSlipCode(order.id, order.totalAmount);

// // 		const payment = await prisma.payment.create({
// // 			data: {
// // 				orderId: order.id,
// // 				userId: parseInt(userId),
// // 				paymentMethod: PaymentMethod.BANK_SLIP,
// // 				paymentStatus: PaymentStatus.PENDING,
// // 				amount: order.totalAmount,
// // 				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
// // 				boletoCode: bankSlipCode,
// // 				boletoUrl: `${baseUrl}/api/payments/${order.id}/boleto`,
// // 				barcodeImage: `${baseUrl}/api/payments/${order.id}/barcode`,
// // 			},
// // 		});

// // 		if (order.status !== OrderStatus.PENDING) {
// // 			await prisma.order.update({
// // 				where: { id: order.id },
// // 				data: { status: OrderStatus.PENDING },
// // 			});
// // 		}

// // 		const response = {
// // 			success: true,
// // 			payment: {
// // 				id: payment.id,
// // 				type: 'bank_slip',
// // 				status: 'pending',
// // 				amount: payment.amount,
// // 				bank_slip_code: payment.boletoCode,
// // 				bank_slip_url: payment.boletoUrl,
// // 				barcode_image: payment.barcodeImage,
// // 				expires_at: payment.expiresAt,
// // 				expires_in: '24 horas',
// // 				created_at: payment.createdAt,
// // 			},
// // 			message: 'Pagamento com boleto criado com sucesso',
// // 			cancelled_previous_payments: previousPayments.length,
// // 		};

// // 		return { success: true, response };
// // 	} catch (error: any) {
// // 		console.error('Error creating bank slip payment:', error);
// // 		return { success: false, error: 'Erro ao criar pagamento com boleto' };
// // 	}
// // }

// // async function processCreditCardPayment(
// // 	order: any,
// // 	userId: string,
// // 	card: any,
// // 	installments: number,
// // 	previousPayments: any[],
// // ) {
// // 	try {
// // 		if (!card.number || !card.holder_name || !card.expiry || !card.cvv) {
// // 			return {
// // 				success: false,
// // 				error:
// // 					'Dados do cartão incompletos. São necessários: number, holder_name, expiry, cvv',
// // 			};
// // 		}

// // 		await cancelPreviousPendingPayments(previousPayments);

// // 		const processingResult = await simulateCreditCardProcessing(
// // 			card,
// // 			order.totalAmount,
// // 		);

// // 		let paymentStatus: PaymentStatus = processingResult.success
// // 			? PaymentStatus.SUCCESS
// // 			: PaymentStatus.FAILED;

// // 		let orderStatus: OrderStatus = processingResult.success
// // 			? OrderStatus.PROCESSING
// // 			: OrderStatus.PENDING;

// // 		let message = processingResult.success
// // 			? 'Pagamento com cartão aprovado com sucesso!'
// // 			: `Pagamento recusado: ${processingResult.error}`;

// // 		const payment = await prisma.payment.create({
// // 			data: {
// // 				orderId: order.id,
// // 				userId: parseInt(userId),
// // 				paymentMethod: PaymentMethod.CREDIT_CARD,
// // 				paymentStatus: paymentStatus,
// // 				amount: order.totalAmount,
// // 				installments: installments,
// // 				externalId: processingResult.transactionId,
// // 				cardLastFour: card.number.slice(-4),
// // 				cardBrand: card.brand || 'Unknown',
// // 				processorResponse: JSON.stringify(processingResult),
// // 				failureReason: processingResult.error || null,
// // 				paidAt: processingResult.success ? new Date() : null,
// // 			},
// // 		});

// // 		await prisma.order.update({
// // 			where: { id: order.id },
// // 			data: { status: orderStatus },
// // 		});

// // 		const response = {
// // 			success: processingResult.success,
// // 			payment: {
// // 				id: payment.id,
// // 				type: 'credit_card',
// // 				status: paymentStatus.toLowerCase(),
// // 				amount: payment.amount,
// // 				card_last_four: payment.cardLastFour,
// // 				card_brand: payment.cardBrand,
// // 				installments: payment.installments,
// // 				paid_at: payment.paidAt,
// // 				transaction_id: payment.externalId,
// // 				created_at: payment.createdAt,
// // 			},
// // 			message: message,
// // 			cancelled_previous_payments: previousPayments.length,
// // 		};

// // 		return { success: true, response };
// // 	} catch (error: any) {
// // 		console.error('Error processing credit card payment:', error);
// // 		return { success: false, error: 'Erro ao processar pagamento com cartão' };
// // 	}
// // }

// // // 🔥 ADICIONANDO AS FUNÇÕES QUE ESTAVAM FALTANDO

// // // Função para gerar código PIX
// // function generatePixCode(paymentId: number, amount: number): string {
// // 	const amountInCents = Math.round(amount * 100);
// // 	return `00020126580014br.gov.bcb.pix0136${paymentId}${Date.now()}52040000530398654${amountInCents.toString().padStart(2, '0')}${Math.random().toString(36).substring(2, 10)}6304`;
// // }

// // // Função para gerar código de boleto
// // function generateBankSlipCode(paymentId: number, amount: number): string {
// // 	const amountFormatted = amount.toFixed(2).replace('.', '').padStart(10, '0');
// // 	return `23793.38128 60000.000000 00000.000000 0 ${paymentId.toString().padStart(8, '0')} ${amountFormatted}`;
// // }

// // // Função para simular processamento de cartão de crédito
// // async function simulateCreditCardProcessing(card: any, amount: number) {
// // 	await new Promise((resolve) => setTimeout(resolve, 2000));

// // 	const cleanNumber = card.number.replace(/\s/g, '');
// // 	if (cleanNumber.length !== 16) {
// // 		return {
// // 			success: false,
// // 			error: 'Número do cartão inválido',
// // 			transactionId: `fail_${Date.now()}`,
// // 		};
// // 	}

// // 	const [month, year] = card.expiry.split('/');
// // 	const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
// // 	if (expiryDate < new Date()) {
// // 		return {
// // 			success: false,
// // 			error: 'Cartão expirado',
// // 			transactionId: `fail_${Date.now()}`,
// // 		};
// // 	}

// // 	if (!card.cvv || card.cvv.length < 3) {
// // 		return {
// // 			success: false,
// // 			error: 'CVV inválido',
// // 			transactionId: `fail_${Date.now()}`,
// // 		};
// // 	}

// // 	const isSuccess = Math.random() > 0.2;

// // 	if (isSuccess) {
// // 		return {
// // 			success: true,
// // 			transactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
// // 			authorizationCode: `auth_${Math.random().toString(36).substring(2, 8)}`,
// // 		};
// // 	} else {
// // 		const errors = [
// // 			'Cartão recusado pela operadora',
// // 			'Saldo insuficiente',
// // 			'Transação não autorizada',
// // 			'Limite do cartão excedido',
// // 		];
// // 		return {
// // 			success: false,
// // 			error: errors[Math.floor(Math.random() * errors.length)],
// // 			transactionId: `fail_${Date.now()}`,
// // 		};
// // 	}
// // }

// // // 🔥 ADICIONANDO A FUNÇÃO getPaymentTypeFromMethod QUE TAMBÉM ESTAVA FALTANDO
// // function getPaymentTypeFromMethod(method: PaymentMethod): string {
// // 	const reverseMap = {
// // 		[PaymentMethod.PIX]: 'pix',
// // 		[PaymentMethod.BANK_SLIP]: 'bank_slip',
// // 		[PaymentMethod.CREDIT_CARD]: 'credit_card',
// // 	};
// // 	return reverseMap[method];
// // }

// // export async function GET(request: NextRequest) {
// // 	try {
// // 		const currentUser = await getCurrentUser();

// // 		if (!currentUser) {
// // 			return NextResponse.json(
// // 				{ error: 'Usuário não autenticado' },
// // 				{ status: 401 },
// // 			);
// // 		}

// // 		const { searchParams } = new URL(request.url);
// // 		const orderId = searchParams.get('orderId');

// // 		const whereClause: any = {
// // 			userId: parseInt(currentUser.userId),
// // 		};

// // 		if (orderId) {
// // 			whereClause.orderId = parseInt(orderId);
// // 		}

// // 		const payments = await prisma.payment.findMany({
// // 			where: whereClause,
// // 			include: {
// // 				order: {
// // 					select: {
// // 						id: true,
// // 						orderNumber: true,
// // 						status: true,
// // 					},
// // 				},
// // 			},
// // 			orderBy: {
// // 				createdAt: 'desc',
// // 			},
// // 		});

// // 		const formattedPayments = payments.map((payment) => {
// // 			const basePayment = {
// // 				id: payment.id,
// // 				type: getPaymentTypeFromMethod(payment.paymentMethod),
// // 				status: payment.paymentStatus.toLowerCase(),
// // 				amount: payment.amount,
// // 				createdAt: payment.createdAt,
// // 				expiresAt: payment.expiresAt,
// // 				paidAt: payment.paidAt,
// // 			};

// // 			if (payment.paymentMethod === PaymentMethod.PIX) {
// // 				return {
// // 					...basePayment,
// // 					pix_code: payment.pixCode,
// // 					qr_code: payment.pixQrCode,
// // 				};
// // 			} else if (payment.paymentMethod === PaymentMethod.BANK_SLIP) {
// // 				return {
// // 					...basePayment,
// // 					bank_slip_code: payment.boletoCode,
// // 					bank_slip_url: payment.boletoUrl,
// // 				};
// // 			} else if (payment.paymentMethod === PaymentMethod.CREDIT_CARD) {
// // 				return {
// // 					...basePayment,
// // 					card_last_four: payment.cardLastFour,
// // 					card_brand: payment.cardBrand,
// // 					installments: payment.installments,
// // 				};
// // 			}

// // 			return basePayment;
// // 		});

// // 		return NextResponse.json({
// // 			success: true,
// // 			payments: formattedPayments,
// // 		});
// // 	} catch (error: any) {
// // 		console.error('Error fetching payments:', error);
// // 		return NextResponse.json(
// // 			{ error: 'Erro ao buscar pagamentos' },
// // 			{ status: 500 },
// // 		);
// // 	}
// // }

// import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
// import { type NextRequest, NextResponse } from 'next/server';
// import { getCurrentUser } from '@/lib/get-current-user';
// import { prisma } from '@/lib/prisma';

// const paymentTypeMap = {
// 	pix: PaymentMethod.PIX,
// 	bank_slip: PaymentMethod.BANK_SLIP,
// 	credit_card: PaymentMethod.CREDIT_CARD,
// };

// export async function POST(request: NextRequest) {
// 	try {
// 		const currentUser = await getCurrentUser();

// 		if (!currentUser) {
// 			return NextResponse.json(
// 				{ error: 'Usuário não autenticado' },
// 				{ status: 401 },
// 			);
// 		}

// 		const { orderId, type, installments = 1, card } = await request.json();

// 		if (!orderId || !type) {
// 			return NextResponse.json(
// 				{ error: 'ID do pedido e tipo de pagamento são obrigatórios' },
// 				{ status: 400 },
// 			);
// 		}

// 		if (!Object.keys(paymentTypeMap).includes(type)) {
// 			return NextResponse.json(
// 				{
// 					error: 'Tipo de pagamento inválido',
// 					validTypes: ['pix', 'bank_slip', 'credit_card'],
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		if (type === 'credit_card' && !card) {
// 			return NextResponse.json(
// 				{ error: 'Dados do cartão são obrigatórios para pagamento com cartão' },
// 				{ status: 400 },
// 			);
// 		}

// 		// 🔥 CORREÇÃO: Buscar a order e verificar se tem itens
// 		const order = await prisma.order.findFirst({
// 			where: {
// 				id: parseInt(orderId),
// 				userId: parseInt(currentUser.userId),
// 				status: {
// 					in: [OrderStatus.ACTIVE, OrderStatus.PENDING],
// 				},
// 			},
// 			include: {
// 				items: {
// 					include: {
// 						product: true,
// 					},
// 				},
// 			},
// 		});

// 		if (!order) {
// 			return NextResponse.json(
// 				{ error: 'Pedido não encontrado' },
// 				{ status: 404 },
// 			);
// 		}

// 		// 🔥 CORREÇÃO CRÍTICA: Verificar se a order tem itens
// 		if (!order.items || order.items.length === 0) {
// 			return NextResponse.json(
// 				{
// 					error: 'Não é possível criar pagamento para um pedido vazio',
// 					details:
// 						'Adicione itens ao carrinho antes de prosseguir com o pagamento',
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		// 🔥 CORREÇÃO: Verificar se o total do pedido é maior que zero
// 		if (order.totalAmount <= 0) {
// 			return NextResponse.json(
// 				{
// 					error: 'Valor do pedido inválido',
// 					details: 'O valor total do pedido deve ser maior que zero',
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		const existingPendingPayments = await prisma.payment.findMany({
// 			where: {
// 				orderId: order.id,
// 				paymentStatus: {
// 					in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING],
// 				},
// 			},
// 		});

// 		console.log(
// 			`📄 Pagamentos pendentes encontrados: ${existingPendingPayments.length}`,
// 		);

// 		let paymentResult: any;

// 		switch (type) {
// 			case 'pix':
// 				paymentResult = await createPixPayment(
// 					order,
// 					currentUser.userId,
// 					existingPendingPayments,
// 				);
// 				break;

// 			case 'bank_slip':
// 				paymentResult = await createBankSlipPayment(
// 					order,
// 					currentUser.userId,
// 					existingPendingPayments,
// 				);
// 				break;

// 			case 'credit_card':
// 				paymentResult = await processCreditCardPayment(
// 					order,
// 					currentUser.userId,
// 					card,
// 					installments,
// 					existingPendingPayments,
// 				);
// 				break;

// 			default:
// 				return NextResponse.json(
// 					{ error: 'Tipo de pagamento não implementado' },
// 					{ status: 400 },
// 				);
// 		}

// 		if (!paymentResult.success) {
// 			return NextResponse.json({ error: paymentResult.error }, { status: 400 });
// 		}

// 		return NextResponse.json(paymentResult.response);
// 	} catch (error: any) {
// 		console.error('Error creating payment:', error);
// 		return NextResponse.json(
// 			{ error: 'Erro ao criar pagamento: ' + error.message },
// 			{ status: 500 },
// 		);
// 	}
// }

// // 🔥 FUNÇÃO PARA CANCELAR PAGAMENTOS PENDENTES ANTERIORES
// async function cancelPreviousPendingPayments(pendingPayments: any[]) {
// 	if (pendingPayments.length === 0) return;

// 	console.log(
// 		`🔄 Cancelando ${pendingPayments.length} pagamento(s) pendente(s) anterior(es)...`,
// 	);

// 	try {
// 		await prisma.payment.updateMany({
// 			where: {
// 				id: {
// 					in: pendingPayments.map((p) => p.id),
// 				},
// 			},
// 			data: {
// 				paymentStatus: PaymentStatus.CANCELLED,
// 				updatedAt: new Date(),
// 			},
// 		});
// 		console.log('✅ Pagamentos anteriores cancelados com sucesso');
// 	} catch (error) {
// 		console.error('❌ Erro ao cancelar pagamentos anteriores:', error);
// 	}
// }

// async function createPixPayment(
// 	order: any,
// 	userId: string,
// 	previousPayments: any[],
// ) {
// 	try {
// 		await cancelPreviousPendingPayments(previousPayments);

// 		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// 		const pixCode = generatePixCode(order.id, order.totalAmount);

// 		const payment = await prisma.payment.create({
// 			data: {
// 				orderId: order.id,
// 				userId: parseInt(userId),
// 				paymentMethod: PaymentMethod.PIX,
// 				paymentStatus: PaymentStatus.PENDING,
// 				amount: order.totalAmount,
// 				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
// 				pixCode: pixCode,
// 				pixQrCode: `${baseUrl}/api/payments/${order.id}/qrcode`,
// 				pixImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`,
// 			},
// 		});

// 		if (order.status !== OrderStatus.PENDING) {
// 			await prisma.order.update({
// 				where: { id: order.id },
// 				data: { status: OrderStatus.PENDING },
// 			});
// 		}

// 		const response = {
// 			success: true,
// 			payment: {
// 				id: payment.id,
// 				type: 'pix',
// 				status: 'pending',
// 				amount: payment.amount,
// 				pix_code: payment.pixCode,
// 				qr_code: payment.pixQrCode,
// 				qr_code_image: payment.pixImageUrl,
// 				expires_at: payment.expiresAt,
// 				expires_in: '24 horas',
// 				created_at: payment.createdAt,
// 			},
// 			message: 'Pagamento PIX criado com sucesso',
// 			cancelled_previous_payments: previousPayments.length,
// 		};

// 		return { success: true, response };
// 	} catch (error: any) {
// 		console.error('Error creating PIX payment:', error);
// 		return { success: false, error: 'Erro ao criar pagamento PIX' };
// 	}
// }

// async function createBankSlipPayment(
// 	order: any,
// 	userId: string,
// 	previousPayments: any[],
// ) {
// 	try {
// 		await cancelPreviousPendingPayments(previousPayments);

// 		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// 		const bankSlipCode = generateBankSlipCode(order.id, order.totalAmount);

// 		const payment = await prisma.payment.create({
// 			data: {
// 				orderId: order.id,
// 				userId: parseInt(userId),
// 				paymentMethod: PaymentMethod.BANK_SLIP,
// 				paymentStatus: PaymentStatus.PENDING,
// 				amount: order.totalAmount,
// 				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
// 				boletoCode: bankSlipCode,
// 				boletoUrl: `${baseUrl}/api/payments/${order.id}/boleto`,
// 				barcodeImage: `${baseUrl}/api/payments/${order.id}/barcode`,
// 			},
// 		});

// 		if (order.status !== OrderStatus.PENDING) {
// 			await prisma.order.update({
// 				where: { id: order.id },
// 				data: { status: OrderStatus.PENDING },
// 			});
// 		}

// 		const response = {
// 			success: true,
// 			payment: {
// 				id: payment.id,
// 				type: 'bank_slip',
// 				status: 'pending',
// 				amount: payment.amount,
// 				bank_slip_code: payment.boletoCode,
// 				bank_slip_url: payment.boletoUrl,
// 				barcode_image: payment.barcodeImage,
// 				expires_at: payment.expiresAt,
// 				expires_in: '24 horas',
// 				created_at: payment.createdAt,
// 			},
// 			message: 'Pagamento com boleto criado com sucesso',
// 			cancelled_previous_payments: previousPayments.length,
// 		};

// 		return { success: true, response };
// 	} catch (error: any) {
// 		console.error('Error creating bank slip payment:', error);
// 		return { success: false, error: 'Erro ao criar pagamento com boleto' };
// 	}
// }

// async function processCreditCardPayment(
// 	order: any,
// 	userId: string,
// 	card: any,
// 	installments: number,
// 	previousPayments: any[],
// ) {
// 	try {
// 		if (!card.number || !card.holder_name || !card.expiry || !card.cvv) {
// 			return {
// 				success: false,
// 				error:
// 					'Dados do cartão incompletos. São necessários: number, holder_name, expiry, cvv',
// 			};
// 		}

// 		await cancelPreviousPendingPayments(previousPayments);

// 		const processingResult = await simulateCreditCardProcessing(
// 			card,
// 			order.totalAmount,
// 		);

// 		let paymentStatus: PaymentStatus = processingResult.success
// 			? PaymentStatus.SUCCESS
// 			: PaymentStatus.FAILED;

// 		let orderStatus: OrderStatus = processingResult.success
// 			? OrderStatus.PROCESSING
// 			: OrderStatus.PENDING;

// 		let message = processingResult.success
// 			? 'Pagamento com cartão aprovado com sucesso!'
// 			: `Pagamento recusado: ${processingResult.error}`;

// 		const payment = await prisma.payment.create({
// 			data: {
// 				orderId: order.id,
// 				userId: parseInt(userId),
// 				paymentMethod: PaymentMethod.CREDIT_CARD,
// 				paymentStatus: paymentStatus,
// 				amount: order.totalAmount,
// 				installments: installments,
// 				externalId: processingResult.transactionId,
// 				cardLastFour: card.number.slice(-4),
// 				cardBrand: card.brand || 'Unknown',
// 				processorResponse: JSON.stringify(processingResult),
// 				failureReason: processingResult.error || null,
// 				paidAt: processingResult.success ? new Date() : null,
// 			},
// 		});

// 		await prisma.order.update({
// 			where: { id: order.id },
// 			data: { status: orderStatus },
// 		});

// 		const response = {
// 			success: processingResult.success,
// 			payment: {
// 				id: payment.id,
// 				type: 'credit_card',
// 				status: paymentStatus.toLowerCase(),
// 				amount: payment.amount,
// 				card_last_four: payment.cardLastFour,
// 				card_brand: payment.cardBrand,
// 				installments: payment.installments,
// 				paid_at: payment.paidAt,
// 				transaction_id: payment.externalId,
// 				created_at: payment.createdAt,
// 			},
// 			message: message,
// 			cancelled_previous_payments: previousPayments.length,
// 		};

// 		return { success: true, response };
// 	} catch (error: any) {
// 		console.error('Error processing credit card payment:', error);
// 		return { success: false, error: 'Erro ao processar pagamento com cartão' };
// 	}
// }

// // 🔥 ADICIONANDO AS FUNÇÕES QUE ESTAVAM FALTANDO

// // Função para gerar código PIX
// function generatePixCode(paymentId: number, amount: number): string {
// 	const amountInCents = Math.round(amount * 100);
// 	return `00020126580014br.gov.bcb.pix0136${paymentId}${Date.now()}52040000530398654${amountInCents.toString().padStart(2, '0')}${Math.random().toString(36).substring(2, 10)}6304`;
// }

// // Função para gerar código de boleto
// function generateBankSlipCode(paymentId: number, amount: number): string {
// 	const amountFormatted = amount.toFixed(2).replace('.', '').padStart(10, '0');
// 	return `23793.38128 60000.000000 00000.000000 0 ${paymentId.toString().padStart(8, '0')} ${amountFormatted}`;
// }

// // Função para simular processamento de cartão de crédito
// async function simulateCreditCardProcessing(card: any, amount: number) {
// 	await new Promise((resolve) => setTimeout(resolve, 2000));

// 	const cleanNumber = card.number.replace(/\s/g, '');
// 	if (cleanNumber.length !== 16) {
// 		return {
// 			success: false,
// 			error: 'Número do cartão inválido',
// 			transactionId: `fail_${Date.now()}`,
// 		};
// 	}

// 	const [month, year] = card.expiry.split('/');
// 	const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
// 	if (expiryDate < new Date()) {
// 		return {
// 			success: false,
// 			error: 'Cartão expirado',
// 			transactionId: `fail_${Date.now()}`,
// 		};
// 	}

// 	if (!card.cvv || card.cvv.length < 3) {
// 		return {
// 			success: false,
// 			error: 'CVV inválido',
// 			transactionId: `fail_${Date.now()}`,
// 		};
// 	}

// 	const isSuccess = Math.random() > 0.2;

// 	if (isSuccess) {
// 		return {
// 			success: true,
// 			transactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
// 			authorizationCode: `auth_${Math.random().toString(36).substring(2, 8)}`,
// 		};
// 	} else {
// 		const errors = [
// 			'Cartão recusado pela operadora',
// 			'Saldo insuficiente',
// 			'Transação não autorizada',
// 			'Limite do cartão excedido',
// 		];
// 		return {
// 			success: false,
// 			error: errors[Math.floor(Math.random() * errors.length)],
// 			transactionId: `fail_${Date.now()}`,
// 		};
// 	}
// }

// // 🔥 ADICIONANDO A FUNÇÃO getPaymentTypeFromMethod QUE TAMBÉM ESTAVA FALTANDO
// function getPaymentTypeFromMethod(method: PaymentMethod): string {
// 	const reverseMap = {
// 		[PaymentMethod.PIX]: 'pix',
// 		[PaymentMethod.BANK_SLIP]: 'bank_slip',
// 		[PaymentMethod.CREDIT_CARD]: 'credit_card',
// 	};
// 	return reverseMap[method];
// }

// export async function GET(request: NextRequest) {
// 	try {
// 		const currentUser = await getCurrentUser();

// 		if (!currentUser) {
// 			return NextResponse.json(
// 				{ error: 'Usuário não autenticado' },
// 				{ status: 401 },
// 			);
// 		}

// 		const { searchParams } = new URL(request.url);
// 		const orderId = searchParams.get('orderId');

// 		const whereClause: any = {
// 			userId: parseInt(currentUser.userId),
// 		};

// 		if (orderId) {
// 			whereClause.orderId = parseInt(orderId);
// 		}

// 		const payments = await prisma.payment.findMany({
// 			where: whereClause,
// 			include: {
// 				order: {
// 					select: {
// 						id: true,
// 						orderNumber: true,
// 						status: true,
// 					},
// 				},
// 			},
// 			orderBy: {
// 				createdAt: 'desc',
// 			},
// 		});

// 		const formattedPayments = payments.map((payment) => {
// 			const basePayment = {
// 				id: payment.id,
// 				type: getPaymentTypeFromMethod(payment.paymentMethod),
// 				status: payment.paymentStatus.toLowerCase(),
// 				amount: payment.amount,
// 				createdAt: payment.createdAt,
// 				expiresAt: payment.expiresAt,
// 				paidAt: payment.paidAt,
// 			};

// 			if (payment.paymentMethod === PaymentMethod.PIX) {
// 				return {
// 					...basePayment,
// 					pix_code: payment.pixCode,
// 					qr_code: payment.pixQrCode,
// 				};
// 			} else if (payment.paymentMethod === PaymentMethod.BANK_SLIP) {
// 				return {
// 					...basePayment,
// 					bank_slip_code: payment.boletoCode,
// 					bank_slip_url: payment.boletoUrl,
// 				};
// 			} else if (payment.paymentMethod === PaymentMethod.CREDIT_CARD) {
// 				return {
// 					...basePayment,
// 					card_last_four: payment.cardLastFour,
// 					card_brand: payment.cardBrand,
// 					installments: payment.installments,
// 				};
// 			}

// 			return basePayment;
// 		});

// 		return NextResponse.json({
// 			success: true,
// 			payments: formattedPayments,
// 		});
// 	} catch (error: any) {
// 		console.error('Error fetching payments:', error);
// 		return NextResponse.json(
// 			{ error: 'Erro ao buscar pagamentos' },
// 			{ status: 500 },
// 		);
// 	}
// }

// import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
// import { type NextRequest, NextResponse } from 'next/server';
// import { getCurrentUser } from '@/lib/get-current-user';
// import { prisma } from '@/lib/prisma';

// const paymentTypeMap = {
// 	pix: PaymentMethod.PIX,
// 	bank_slip: PaymentMethod.BANK_SLIP,
// 	credit_card: PaymentMethod.CREDIT_CARD,
// };

// export async function POST(request: NextRequest) {
// 	try {
// 		const currentUser = await getCurrentUser();

// 		if (!currentUser) {
// 			return NextResponse.json(
// 				{ error: 'Usuário não autenticado' },
// 				{ status: 401 },
// 			);
// 		}

// 		const { orderId, type, installments = 1, card } = await request.json();

// 		if (!orderId || !type) {
// 			return NextResponse.json(
// 				{ error: 'ID do pedido e tipo de pagamento são obrigatórios' },
// 				{ status: 400 },
// 			);
// 		}

// 		if (!Object.keys(paymentTypeMap).includes(type)) {
// 			return NextResponse.json(
// 				{
// 					error: 'Tipo de pagamento inválido',
// 					validTypes: ['pix', 'bank_slip', 'credit_card'],
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		if (type === 'credit_card' && !card) {
// 			return NextResponse.json(
// 				{ error: 'Dados do cartão são obrigatórios para pagamento com cartão' },
// 				{ status: 400 },
// 			);
// 		}

// 		// 🔥 CORREÇÃO: Buscar a order e verificar se tem itens
// 		const order = await prisma.order.findFirst({
// 			where: {
// 				id: parseInt(orderId),
// 				userId: parseInt(currentUser.userId),
// 				status: {
// 					in: [OrderStatus.ACTIVE, OrderStatus.PENDING],
// 				},
// 			},
// 			include: {
// 				items: {
// 					include: {
// 						product: true,
// 					},
// 				},
// 			},
// 		});

// 		if (!order) {
// 			return NextResponse.json(
// 				{ error: 'Pedido não encontrado' },
// 				{ status: 404 },
// 			);
// 		}

// 		// 🔥 CORREÇÃO CRÍTICA: Verificar se a order tem itens
// 		if (!order.items || order.items.length === 0) {
// 			return NextResponse.json(
// 				{
// 					error: 'Não é possível criar pagamento para um pedido vazio',
// 					details:
// 						'Adicione itens ao carrinho antes de prosseguir com o pagamento',
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		// 🔥 CORREÇÃO: Verificar se o total do pedido é maior que zero
// 		if (order.totalAmount <= 0) {
// 			return NextResponse.json(
// 				{
// 					error: 'Valor do pedido inválido',
// 					details: 'O valor total do pedido deve ser maior que zero',
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		const existingPendingPayments = await prisma.payment.findMany({
// 			where: {
// 				orderId: order.id,
// 				paymentStatus: {
// 					in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING],
// 				},
// 			},
// 		});

// 		console.log(
// 			`📄 Pagamentos pendentes encontrados: ${existingPendingPayments.length}`,
// 		);

// 		let paymentResult: any;

// 		switch (type) {
// 			case 'pix':
// 				paymentResult = await createPixPayment(
// 					order,
// 					currentUser.userId,
// 					existingPendingPayments,
// 				);
// 				break;

// 			case 'bank_slip':
// 				paymentResult = await createBankSlipPayment(
// 					order,
// 					currentUser.userId,
// 					existingPendingPayments,
// 				);
// 				break;

// 			case 'credit_card':
// 				paymentResult = await processCreditCardPayment(
// 					order,
// 					currentUser.userId,
// 					card,
// 					installments,
// 					existingPendingPayments,
// 				);
// 				break;

// 			default:
// 				return NextResponse.json(
// 					{ error: 'Tipo de pagamento não implementado' },
// 					{ status: 400 },
// 				);
// 		}

// 		if (!paymentResult.success) {
// 			return NextResponse.json({ error: paymentResult.error }, { status: 400 });
// 		}

// 		return NextResponse.json(paymentResult.response);
// 	} catch (error: any) {
// 		console.error('Error creating payment:', error);
// 		return NextResponse.json(
// 			{ error: 'Erro ao criar pagamento: ' + error.message },
// 			{ status: 500 },
// 		);
// 	}
// }

// // 🔥 FUNÇÃO PARA CANCELAR PAGAMENTOS PENDENTES ANTERIORES
// async function cancelPreviousPendingPayments(pendingPayments: any[]) {
// 	if (pendingPayments.length === 0) return;

// 	console.log(
// 		`🔄 Cancelando ${pendingPayments.length} pagamento(s) pendente(s) anterior(es)...`,
// 	);

// 	try {
// 		await prisma.payment.updateMany({
// 			where: {
// 				id: {
// 					in: pendingPayments.map((p) => p.id),
// 				},
// 			},
// 			data: {
// 				paymentStatus: PaymentStatus.CANCELLED,
// 				updatedAt: new Date(),
// 			},
// 		});
// 		console.log('✅ Pagamentos anteriores cancelados com sucesso');
// 	} catch (error) {
// 		console.error('❌ Erro ao cancelar pagamentos anteriores:', error);
// 	}
// }

// async function createPixPayment(
// 	order: any,
// 	userId: string,
// 	previousPayments: any[],
// ) {
// 	try {
// 		await cancelPreviousPendingPayments(previousPayments);

// 		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// 		const pixCode = generatePixCode(order.id, order.totalAmount);

// 		const payment = await prisma.payment.create({
// 			data: {
// 				orderId: order.id,
// 				userId: parseInt(userId),
// 				paymentMethod: PaymentMethod.PIX,
// 				paymentStatus: PaymentStatus.PENDING,
// 				amount: order.totalAmount,
// 				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
// 				pixCode: pixCode,
// 				pixQrCode: `${baseUrl}/api/payments/${order.id}/qrcode`,
// 				pixImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`,
// 			},
// 		});

// 		if (order.status !== OrderStatus.PENDING) {
// 			await prisma.order.update({
// 				where: { id: order.id },
// 				data: { status: OrderStatus.PENDING },
// 			});
// 		}

// 		const response = {
// 			success: true,
// 			payment: {
// 				id: payment.id,
// 				type: 'pix',
// 				status: 'pending',
// 				amount: payment.amount,
// 				pix_code: payment.pixCode,
// 				qr_code: payment.pixQrCode,
// 				qr_code_image: payment.pixImageUrl,
// 				expires_at: payment.expiresAt,
// 				expires_in: '24 horas',
// 				created_at: payment.createdAt,
// 			},
// 			message: 'Pagamento PIX criado com sucesso',
// 			cancelled_previous_payments: previousPayments.length,
// 		};

// 		return { success: true, response };
// 	} catch (error: any) {
// 		console.error('Error creating PIX payment:', error);
// 		return { success: false, error: 'Erro ao criar pagamento PIX' };
// 	}
// }

// async function createBankSlipPayment(
// 	order: any,
// 	userId: string,
// 	previousPayments: any[],
// ) {
// 	try {
// 		await cancelPreviousPendingPayments(previousPayments);

// 		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// 		const bankSlipCode = generateBankSlipCode(order.id, order.totalAmount);

// 		const payment = await prisma.payment.create({
// 			data: {
// 				orderId: order.id,
// 				userId: parseInt(userId),
// 				paymentMethod: PaymentMethod.BANK_SLIP,
// 				paymentStatus: PaymentStatus.PENDING,
// 				amount: order.totalAmount,
// 				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
// 				boletoCode: bankSlipCode,
// 				boletoUrl: `${baseUrl}/api/payments/${order.id}/boleto`,
// 				barcodeImage: `${baseUrl}/api/payments/${order.id}/barcode`,
// 			},
// 		});

// 		if (order.status !== OrderStatus.PENDING) {
// 			await prisma.order.update({
// 				where: { id: order.id },
// 				data: { status: OrderStatus.PENDING },
// 			});
// 		}

// 		const response = {
// 			success: true,
// 			payment: {
// 				id: payment.id,
// 				type: 'bank_slip',
// 				status: 'pending',
// 				amount: payment.amount,
// 				bank_slip_code: payment.boletoCode,
// 				bank_slip_url: payment.boletoUrl,
// 				barcode_image: payment.barcodeImage,
// 				expires_at: payment.expiresAt,
// 				expires_in: '24 horas',
// 				created_at: payment.createdAt,
// 			},
// 			message: 'Pagamento com boleto criado com sucesso',
// 			cancelled_previous_payments: previousPayments.length,
// 		};

// 		return { success: true, response };
// 	} catch (error: any) {
// 		console.error('Error creating bank slip payment:', error);
// 		return { success: false, error: 'Erro ao criar pagamento com boleto' };
// 	}
// }

// async function processCreditCardPayment(
// 	order: any,
// 	userId: string,
// 	card: any,
// 	installments: number,
// 	previousPayments: any[],
// ) {
// 	try {
// 		if (!card.number || !card.holder_name || !card.expiry || !card.cvv) {
// 			return {
// 				success: false,
// 				error:
// 					'Dados do cartão incompletos. São necessários: number, holder_name, expiry, cvv',
// 			};
// 		}

// 		await cancelPreviousPendingPayments(previousPayments);

// 		const processingResult = await simulateCreditCardProcessing(
// 			card,
// 			order.totalAmount,
// 		);

// 		let paymentStatus: PaymentStatus = processingResult.success
// 			? PaymentStatus.SUCCESS
// 			: PaymentStatus.FAILED;

// 		let orderStatus: OrderStatus = processingResult.success
// 			? OrderStatus.PROCESSING
// 			: OrderStatus.PENDING;

// 		let message = processingResult.success
// 			? 'Pagamento com cartão aprovado com sucesso!'
// 			: `Pagamento recusado: ${processingResult.error}`;

// 		const payment = await prisma.payment.create({
// 			data: {
// 				orderId: order.id,
// 				userId: parseInt(userId),
// 				paymentMethod: PaymentMethod.CREDIT_CARD,
// 				paymentStatus: paymentStatus,
// 				amount: order.totalAmount,
// 				installments: installments,
// 				externalId: processingResult.transactionId,
// 				cardLastFour: card.number.slice(-4),
// 				cardBrand: card.brand || 'Unknown',
// 				processorResponse: JSON.stringify(processingResult),
// 				failureReason: processingResult.error || null,
// 				paidAt: processingResult.success ? new Date() : null,
// 			},
// 		});

// 		await prisma.order.update({
// 			where: { id: order.id },
// 			data: { status: orderStatus },
// 		});

// 		const response = {
// 			success: processingResult.success,
// 			payment: {
// 				id: payment.id,
// 				type: 'credit_card',
// 				status: paymentStatus.toLowerCase(),
// 				amount: payment.amount,
// 				card_last_four: payment.cardLastFour,
// 				card_brand: payment.cardBrand,
// 				installments: payment.installments,
// 				paid_at: payment.paidAt,
// 				transaction_id: payment.externalId,
// 				created_at: payment.createdAt,
// 			},
// 			message: message,
// 			cancelled_previous_payments: previousPayments.length,
// 		};

// 		return { success: true, response };
// 	} catch (error: any) {
// 		console.error('Error processing credit card payment:', error);
// 		return { success: false, error: 'Erro ao processar pagamento com cartão' };
// 	}
// }

// // 🔥 ADICIONANDO AS FUNÇÕES QUE ESTAVAM FALTANDO

// // Função para gerar código PIX
// function generatePixCode(paymentId: number, amount: number): string {
// 	const amountInCents = Math.round(amount * 100);
// 	return `00020126580014br.gov.bcb.pix0136${paymentId}${Date.now()}52040000530398654${amountInCents.toString().padStart(2, '0')}${Math.random().toString(36).substring(2, 10)}6304`;
// }

// // Função para gerar código de boleto
// function generateBankSlipCode(paymentId: number, amount: number): string {
// 	const amountFormatted = amount.toFixed(2).replace('.', '').padStart(10, '0');
// 	return `23793.38128 60000.000000 00000.000000 0 ${paymentId.toString().padStart(8, '0')} ${amountFormatted}`;
// }

// // Função para simular processamento de cartão de crédito
// async function simulateCreditCardProcessing(card: any, amount: number) {
// 	await new Promise((resolve) => setTimeout(resolve, 2000));

// 	const cleanNumber = card.number.replace(/\s/g, '');
// 	if (cleanNumber.length !== 16) {
// 		return {
// 			success: false,
// 			error: 'Número do cartão inválido',
// 			transactionId: `fail_${Date.now()}`,
// 		};
// 	}

// 	const [month, year] = card.expiry.split('/');
// 	const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
// 	if (expiryDate < new Date()) {
// 		return {
// 			success: false,
// 			error: 'Cartão expirado',
// 			transactionId: `fail_${Date.now()}`,
// 		};
// 	}

// 	if (!card.cvv || card.cvv.length < 3) {
// 		return {
// 			success: false,
// 			error: 'CVV inválido',
// 			transactionId: `fail_${Date.now()}`,
// 		};
// 	}

// 	const isSuccess = Math.random() > 0.2;

// 	if (isSuccess) {
// 		return {
// 			success: true,
// 			transactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
// 			authorizationCode: `auth_${Math.random().toString(36).substring(2, 8)}`,
// 		};
// 	} else {
// 		const errors = [
// 			'Cartão recusado pela operadora',
// 			'Saldo insuficiente',
// 			'Transação não autorizada',
// 			'Limite do cartão excedido',
// 		];
// 		return {
// 			success: false,
// 			error: errors[Math.floor(Math.random() * errors.length)],
// 			transactionId: `fail_${Date.now()}`,
// 		};
// 	}
// }

// // 🔥 ADICIONANDO A FUNÇÃO getPaymentTypeFromMethod QUE TAMBÉM ESTAVA FALTANDO
// function getPaymentTypeFromMethod(method: PaymentMethod): string {
// 	const reverseMap = {
// 		[PaymentMethod.PIX]: 'pix',
// 		[PaymentMethod.BANK_SLIP]: 'bank_slip',
// 		[PaymentMethod.CREDIT_CARD]: 'credit_card',
// 	};
// 	return reverseMap[method];
// }

// export async function GET(request: NextRequest) {
// 	try {
// 		const currentUser = await getCurrentUser();

// 		if (!currentUser) {
// 			return NextResponse.json(
// 				{ error: 'Usuário não autenticado' },
// 				{ status: 401 },
// 			);
// 		}

// 		const { searchParams } = new URL(request.url);
// 		const orderId = searchParams.get('orderId');

// 		const whereClause: any = {
// 			userId: parseInt(currentUser.userId),
// 		};

// 		if (orderId) {
// 			whereClause.orderId = parseInt(orderId);
// 		}

// 		const payments = await prisma.payment.findMany({
// 			where: whereClause,
// 			include: {
// 				order: {
// 					select: {
// 						id: true,
// 						orderNumber: true,
// 						status: true,
// 					},
// 				},
// 			},
// 			orderBy: {
// 				createdAt: 'desc',
// 			},
// 		});

// 		const formattedPayments = payments.map((payment) => {
// 			const basePayment = {
// 				id: payment.id,
// 				type: getPaymentTypeFromMethod(payment.paymentMethod),
// 				status: payment.paymentStatus.toLowerCase(),
// 				amount: payment.amount,
// 				createdAt: payment.createdAt,
// 				expiresAt: payment.expiresAt,
// 				paidAt: payment.paidAt,
// 			};

// 			if (payment.paymentMethod === PaymentMethod.PIX) {
// 				return {
// 					...basePayment,
// 					pix_code: payment.pixCode,
// 					qr_code: payment.pixQrCode,
// 				};
// 			} else if (payment.paymentMethod === PaymentMethod.BANK_SLIP) {
// 				return {
// 					...basePayment,
// 					bank_slip_code: payment.boletoCode,
// 					bank_slip_url: payment.boletoUrl,
// 				};
// 			} else if (payment.paymentMethod === PaymentMethod.CREDIT_CARD) {
// 				return {
// 					...basePayment,
// 					card_last_four: payment.cardLastFour,
// 					card_brand: payment.cardBrand,
// 					installments: payment.installments,
// 				};
// 			}

// 			return basePayment;
// 		});

// 		return NextResponse.json({
// 			success: true,
// 			payments: formattedPayments,
// 		});
// 	} catch (error: any) {
// 		console.error('Error fetching payments:', error);
// 		return NextResponse.json(
// 			{ error: 'Erro ao buscar pagamentos' },
// 			{ status: 500 },
// 		);
// 	}
// }

import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/get-current-user';
import { prisma } from '@/lib/prisma';

const paymentTypeMap = {
	pix: PaymentMethod.PIX,
	bank_slip: PaymentMethod.BANK_SLIP,
	credit_card: PaymentMethod.CREDIT_CARD,
};

export async function POST(request: NextRequest) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'Usuário não autenticado' },
				{ status: 401 },
			);
		}

		const { orderId, type, card } = await request.json();

		if (!orderId || !type) {
			return NextResponse.json(
				{ error: 'ID do pedido e tipo de pagamento são obrigatórios' },
				{ status: 400 },
			);
		}

		if (!Object.keys(paymentTypeMap).includes(type)) {
			return NextResponse.json(
				{
					error: 'Tipo de pagamento inválido',
					validTypes: ['pix', 'bank_slip', 'credit_card'],
				},
				{ status: 400 },
			);
		}

		if (type === 'credit_card' && !card) {
			return NextResponse.json(
				{ error: 'Dados do cartão são obrigatórios para pagamento com cartão' },
				{ status: 400 },
			);
		}

		// 🔥 CORREÇÃO: Buscar a order e verificar se tem itens
		const order = await prisma.order.findFirst({
			where: {
				id: parseInt(orderId),
				userId: parseInt(currentUser.userId),
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
			return NextResponse.json(
				{ error: 'Pedido não encontrado' },
				{ status: 404 },
			);
		}

		// 🔥 CORREÇÃO CRÍTICA: Verificar se a order tem itens
		if (!order.items || order.items.length === 0) {
			return NextResponse.json(
				{
					error: 'Não é possível criar pagamento para um pedido vazio',
					details:
						'Adicione itens ao carrinho antes de prosseguir com o pagamento',
				},
				{ status: 400 },
			);
		}

		// 🔥 CORREÇÃO: Verificar se o total do pedido é maior que zero
		if (order.totalAmount <= 0) {
			return NextResponse.json(
				{
					error: 'Valor do pedido inválido',
					details: 'O valor total do pedido deve ser maior que zero',
				},
				{ status: 400 },
			);
		}

		const existingPendingPayments = await prisma.payment.findMany({
			where: {
				orderId: order.id,
				paymentStatus: {
					in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING],
				},
			},
		});

		console.log(
			`📄 Pagamentos pendentes encontrados: ${existingPendingPayments.length}`,
		);

		let paymentResult: any;

		switch (type) {
			case 'pix':
				paymentResult = await createPixPayment(
					order,
					currentUser.userId,
					existingPendingPayments,
				);
				break;

			case 'bank_slip':
				paymentResult = await createBankSlipPayment(
					order,
					currentUser.userId,
					existingPendingPayments,
				);
				break;

			case 'credit_card':
				paymentResult = await processCreditCardPayment(
					order,
					currentUser.userId,
					card,
					existingPendingPayments,
				);
				break;

			default:
				return NextResponse.json(
					{ error: 'Tipo de pagamento não implementado' },
					{ status: 400 },
				);
		}

		if (!paymentResult.success) {
			return NextResponse.json({ error: paymentResult.error }, { status: 400 });
		}

		return NextResponse.json(paymentResult.response);
	} catch (error: any) {
		console.error('Error creating payment:', error);
		return NextResponse.json(
			{ error: 'Erro ao criar pagamento: ' + error.message },
			{ status: 500 },
		);
	}
}

// 🔥 FUNÇÃO PARA CANCELAR PAGAMENTOS PENDENTES ANTERIORES
async function cancelPreviousPendingPayments(pendingPayments: any[]) {
	if (pendingPayments.length === 0) return;

	console.log(
		`🔄 Cancelando ${pendingPayments.length} pagamento(s) pendente(s) anterior(es)...`,
	);

	try {
		await prisma.payment.updateMany({
			where: {
				id: {
					in: pendingPayments.map((p) => p.id),
				},
			},
			data: {
				paymentStatus: PaymentStatus.CANCELLED,
				updatedAt: new Date(),
			},
		});
		console.log('✅ Pagamentos anteriores cancelados com sucesso');
	} catch (error) {
		console.error('❌ Erro ao cancelar pagamentos anteriores:', error);
	}
}

async function createPixPayment(
	order: any,
	userId: string,
	previousPayments: any[],
) {
	try {
		await cancelPreviousPendingPayments(previousPayments);

		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
		const pixCode = generatePixCode(order.id, order.totalAmount);

		const payment = await prisma.payment.create({
			data: {
				orderId: order.id,
				userId: parseInt(userId),
				paymentMethod: PaymentMethod.PIX,
				paymentStatus: PaymentStatus.PENDING,
				amount: order.totalAmount,
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
				pixCode: pixCode,
				pixQrCode: `${baseUrl}/api/payments/${order.id}/qrcode`,
				pixImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`,
			},
		});

		if (order.status !== OrderStatus.PENDING) {
			await prisma.order.update({
				where: { id: order.id },
				data: { status: OrderStatus.PENDING },
			});
		}

		const response = {
			success: true,
			payment: {
				id: payment.id,
				type: 'pix',
				status: 'pending',
				amount: payment.amount,
				pix_code: payment.pixCode,
				qr_code: payment.pixQrCode,
				qr_code_image: payment.pixImageUrl,
				expires_at: payment.expiresAt,
				expires_in: '24 horas',
				created_at: payment.createdAt,
			},
			message: 'Pagamento PIX criado com sucesso',
			cancelled_previous_payments: previousPayments.length,
		};

		return { success: true, response };
	} catch (error: any) {
		console.error('Error creating PIX payment:', error);
		return { success: false, error: 'Erro ao criar pagamento PIX' };
	}
}

async function createBankSlipPayment(
	order: any,
	userId: string,
	previousPayments: any[],
) {
	try {
		await cancelPreviousPendingPayments(previousPayments);

		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
		const bankSlipCode = generateBankSlipCode(order.id, order.totalAmount);

		const payment = await prisma.payment.create({
			data: {
				orderId: order.id,
				userId: parseInt(userId),
				paymentMethod: PaymentMethod.BANK_SLIP,
				paymentStatus: PaymentStatus.PENDING,
				amount: order.totalAmount,
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
				boletoCode: bankSlipCode,
				boletoUrl: `${baseUrl}/api/payments/${order.id}/boleto`,
				barcodeImage: `${baseUrl}/api/payments/${order.id}/barcode`,
			},
		});

		if (order.status !== OrderStatus.PENDING) {
			await prisma.order.update({
				where: { id: order.id },
				data: { status: OrderStatus.PENDING },
			});
		}

		const response = {
			success: true,
			payment: {
				id: payment.id,
				type: 'bank_slip',
				status: 'pending',
				amount: payment.amount,
				bank_slip_code: payment.boletoCode,
				bank_slip_url: payment.boletoUrl,
				barcode_image: payment.barcodeImage,
				expires_at: payment.expiresAt,
				expires_in: '24 horas',
				created_at: payment.createdAt,
			},
			message: 'Pagamento com boleto criado com sucesso',
			cancelled_previous_payments: previousPayments.length,
		};

		return { success: true, response };
	} catch (error: any) {
		console.error('Error creating bank slip payment:', error);
		return { success: false, error: 'Erro ao criar pagamento com boleto' };
	}
}

async function processCreditCardPayment(
	order: any,
	userId: string,
	card: any,
	previousPayments: any[],
) {
	try {
		// Validação dos campos do cartão conforme o schema
		if (
			!card.credit_card ||
			!card.name ||
			!card.month ||
			!card.year ||
			!card.cvv ||
			!card.installments
		) {
			return {
				success: false,
				error:
					'Dados do cartão incompletos. São necessários: credit_card, name, month, year, cvv, installments',
			};
		}

		await cancelPreviousPendingPayments(previousPayments);

		const processingResult = await simulateCreditCardProcessing(
			card,
			order.totalAmount,
		);

		let paymentStatus: PaymentStatus = processingResult.success
			? PaymentStatus.SUCCESS
			: PaymentStatus.FAILED;

		let orderStatus: OrderStatus = processingResult.success
			? OrderStatus.PROCESSING
			: OrderStatus.PENDING;

		let message = processingResult.success
			? 'Pagamento com cartão aprovado com sucesso!'
			: `Pagamento recusado: ${processingResult.error}`;

		const payment = await prisma.payment.create({
			data: {
				orderId: order.id,
				userId: parseInt(userId),
				paymentMethod: PaymentMethod.CREDIT_CARD,
				paymentStatus: paymentStatus,
				amount: order.totalAmount,
				installments: parseInt(card.installments),
				externalId: processingResult.transactionId,
				cardLastFour: card.credit_card.slice(-4),
				cardBrand: card.brand || 'Unknown',
				processorResponse: JSON.stringify(processingResult),
				failureReason: processingResult.error || null,
				paidAt: processingResult.success ? new Date() : null,
			},
		});

		await prisma.order.update({
			where: { id: order.id },
			data: { status: orderStatus },
		});

		const response = {
			success: processingResult.success,
			payment: {
				id: payment.id,
				type: 'credit_card',
				status: paymentStatus.toLowerCase(),
				amount: payment.amount,
				card_last_four: payment.cardLastFour,
				card_brand: payment.cardBrand,
				installments: payment.installments,
				paid_at: payment.paidAt,
				transaction_id: payment.externalId,
				created_at: payment.createdAt,
			},
			message: message,
			cancelled_previous_payments: previousPayments.length,
		};

		return { success: true, response };
	} catch (error: any) {
		console.error('Error processing credit card payment:', error);
		return { success: false, error: 'Erro ao processar pagamento com cartão' };
	}
}

// Função para gerar código PIX
function generatePixCode(paymentId: number, amount: number): string {
	const amountInCents = Math.round(amount * 100);
	return `00020126580014br.gov.bcb.pix0136${paymentId}${Date.now()}52040000530398654${amountInCents.toString().padStart(2, '0')}${Math.random().toString(36).substring(2, 10)}6304`;
}

// Função para gerar código de boleto
function generateBankSlipCode(paymentId: number, amount: number): string {
	const amountFormatted = amount.toFixed(2).replace('.', '').padStart(10, '0');
	return `23793.38128 60000.000000 00000.000000 0 ${paymentId.toString().padStart(8, '0')} ${amountFormatted}`;
}

// Função para simular processamento de cartão de crédito
async function simulateCreditCardProcessing(card: any, amount: number) {
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// Validação do número do cartão
	const cleanNumber = card.credit_card.replace(/\s/g, '');
	if (cleanNumber.length !== 16) {
		return {
			success: false,
			error: 'Número do cartão inválido',
			transactionId: `fail_${Date.now()}`,
		};
	}

	// Validação da data de validade
	const currentYear = new Date().getFullYear() % 100; // Últimos 2 dígitos
	const currentMonth = new Date().getMonth() + 1;
	const cardYear = parseInt(card.year);
	const cardMonth = parseInt(card.month);

	if (
		cardYear < currentYear ||
		(cardYear === currentYear && cardMonth < currentMonth)
	) {
		return {
			success: false,
			error: 'Cartão expirado',
			transactionId: `fail_${Date.now()}`,
		};
	}

	// Validação do CVV
	if (!card.cvv || card.cvv.length !== 3) {
		return {
			success: false,
			error: 'CVV inválido',
			transactionId: `fail_${Date.now()}`,
		};
	}

	// Simulação de sucesso/falha (80% de sucesso)
	const isSuccess = Math.random() > 0.2;

	if (isSuccess) {
		return {
			success: true,
			transactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
			authorizationCode: `auth_${Math.random().toString(36).substring(2, 8)}`,
		};
	} else {
		const errors = [
			'Cartão recusado pela operadora',
			'Saldo insuficiente',
			'Transação não autorizada',
			'Limite do cartão excedido',
		];
		return {
			success: false,
			error: errors[Math.floor(Math.random() * errors.length)],
			transactionId: `fail_${Date.now()}`,
		};
	}
}

// Função para obter o tipo de pagamento a partir do método
function getPaymentTypeFromMethod(method: PaymentMethod): string {
	const reverseMap = {
		[PaymentMethod.PIX]: 'pix',
		[PaymentMethod.BANK_SLIP]: 'bank_slip',
		[PaymentMethod.CREDIT_CARD]: 'credit_card',
	};
	return reverseMap[method];
}

export async function GET(request: NextRequest) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'Usuário não autenticado' },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(request.url);
		const orderId = searchParams.get('orderId');

		const whereClause: any = {
			userId: parseInt(currentUser.userId),
		};

		if (orderId) {
			whereClause.orderId = parseInt(orderId);
		}

		const payments = await prisma.payment.findMany({
			where: whereClause,
			include: {
				order: {
					select: {
						id: true,
						orderNumber: true,
						status: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const formattedPayments = payments.map((payment) => {
			const basePayment = {
				id: payment.id,
				type: getPaymentTypeFromMethod(payment.paymentMethod),
				status: payment.paymentStatus.toLowerCase(),
				amount: payment.amount,
				createdAt: payment.createdAt,
				expiresAt: payment.expiresAt,
				paidAt: payment.paidAt,
			};

			if (payment.paymentMethod === PaymentMethod.PIX) {
				return {
					...basePayment,
					pix_code: payment.pixCode,
					qr_code: payment.pixQrCode,
				};
			} else if (payment.paymentMethod === PaymentMethod.BANK_SLIP) {
				return {
					...basePayment,
					bank_slip_code: payment.boletoCode,
					bank_slip_url: payment.boletoUrl,
				};
			} else if (payment.paymentMethod === PaymentMethod.CREDIT_CARD) {
				return {
					...basePayment,
					card_last_four: payment.cardLastFour,
					card_brand: payment.cardBrand,
					installments: payment.installments,
				};
			}

			return basePayment;
		});

		return NextResponse.json({
			success: true,
			payments: formattedPayments,
		});
	} catch (error: any) {
		console.error('Error fetching payments:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar pagamentos' },
			{ status: 500 },
		);
	}
}
