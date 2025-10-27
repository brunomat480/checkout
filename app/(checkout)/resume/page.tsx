import type { Metadata } from 'next';
import { ProductCardOrderList } from '@/app/(checkout)/resume/_components/product-card-order-list';
import { ResumeCard } from '@/app/(checkout)/resume/_components/resume-card';
import { Text } from '@/components/text';

export const metadata: Metadata = {
	title: 'Carrinho',
};

export default function ResumePage() {
	return (
		<main className="min-h-screen pb-4">
			<div className="max-w-7xl mx-auto">
				<Text
					as="h1"
					variant="title"
					className="mb-4 mt-12 "
				>
					Seus Itens
				</Text>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="rounded-lg border border-border p-6">
							<ProductCardOrderList />
						</div>
					</div>

					<ResumeCard />
				</div>
			</div>
		</main>
	);
}
