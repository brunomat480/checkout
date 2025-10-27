import type { Product } from '@/types/product';

export interface OrderItem {
	id: number;
	orderId: number;
	productId: number;
	quantity: number;
	price: number;
	createdAt: string;
	updatedAt: string;
	product: Product;
}

export interface Order {
	id: number;
	userId: number;
	status: string;
	totalAmount: number;
	subtotal: number;
	shipping: number;
	discount: number;
	orderNumber: string;
	createdAt: string;
	updatedAt: string;
	items: OrderItem[];
}
