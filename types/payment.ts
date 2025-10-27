export interface Payment {
	id: number;
	orderId: number;
	userId: number;
	paymentMethod: string;
	paymentStatus: string;
	amount: number;
	installments?: number;
	createdAt: string;
	updatedAt: string;
	expiresAt?: string;
	paidAt?: string;
	refundedAt?: string;
	externalId?: string;
	failureReason?: string;
	order: {
		id: number;
		orderNumber: string;
		status: string;
		totalAmount: number;
		createdAt: string;
	};
	user?: {
		id: number;
		name: string;
		email: string;
	};
	pix?: {
		code: string;
		qrCode: string;
		qrCodeImage: string;
	};
	bankSlip?: {
		code: string;
		url: string;
		barcodeImage: string;
	};
	creditCard?: {
		lastFour: string;
		brand: string;
		installments: number;
	};
}
