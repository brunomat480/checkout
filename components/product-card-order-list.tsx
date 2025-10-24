'use client';

import { ProductCardOrder } from '@/components/product-card-order';
import { Skeleton } from '@/components/ui/skeleton';
import { useCheckout } from '@/hooks/use-checkout';

function ProductCardOrderSkeleton() {
	return (
		<div className="flex items-start gap-4 py-6 border-b border-border/40 last:border-0 animate-pulse">
			<div className="flex-shrink-0 overflow-hidden rounded-lg border border-border/50">
				<Skeleton className="w-24 h-24" />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<Skeleton className="h-5 w-3/4 mb-2" />

						<Skeleton className="h-6 w-20" />
					</div>

					<Skeleton className="h-8 w-8 rounded-full" />
				</div>

				<div className="flex items-center gap-2 mt-4">
					<Skeleton className="h-8 w-8 rounded-md" />

					<Skeleton className="h-5 w-8" />

					<Skeleton className="h-8 w-8 rounded-md" />
				</div>
			</div>
		</div>
	);
}

export function ProductCardOrderList() {
	const { order, loading } = useCheckout();

	return (
		<>
			{!loading &&
				order?.items.map((item) => (
					<ProductCardOrder
						key={item.id}
						product={{
							name: item.product.name,
							image: item.product.image,
							description: item.product.description,
							price: item.price,
							quantity: item.quantity,
						}}
					/>
				))}

			{loading &&
				Array.from({ length: 4 }).map((_, i) => (
					<ProductCardOrderSkeleton key={i} />
				))}
		</>
	);
}
