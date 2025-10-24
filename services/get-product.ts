import { api } from '@/lib/api';
import type { Product } from '@/types/products';

export async function getProduct(id: string): Promise<Product> {
	const response: Product = await api.get(`products/${id}`).json();

	return response;
}
