import { api } from '@/lib/api';
import type { Product } from '@/types/product';

interface ProductsResponse {
	products: Product[];
	total: number;
}

export async function getProducts(): Promise<ProductsResponse> {
	const response: ProductsResponse = await api.get('products').json();

	return response;
}
