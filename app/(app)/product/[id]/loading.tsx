// app/product/[id]/loading.tsx

import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-6 md:py-8">
				<div className="flex items-center gap-1 mb-4">
					<ChevronLeft className="h-4 w-4" />
					<Skeleton className="h-4 w-16" />
				</div>

				<div className="grid md:grid-cols-2 gap-8 mb-12">
					<div className="space-y-4">
						<div className="aspect-square rounded-lg overflow-hidden bg-muted">
							<Skeleton className="w-full h-full" />
						</div>
					</div>

					<div className="space-y-6">
						<div>
							<Skeleton className="h-6 w-20 mb-3" />
							<Skeleton className="h-8 w-3/4 mb-4" />

							<div className="flex items-center gap-4 mb-4">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Skeleton
											key={i}
											className="h-5 w-5 rounded-full"
										/>
									))}
								</div>
								<Skeleton className="h-4 w-8" />
							</div>

							<Skeleton className="h-10 w-32" />
						</div>

						<div>
							<Skeleton className="h-5 w-24 mb-2" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>

						<Skeleton className="h-px w-full" />

						<div className="space-y-3">
							<Skeleton className="h-12 w-full rounded-md" />
						</div>

						<Skeleton className="h-px w-full" />

						<div className="grid gap-4">
							<div className="flex items-start gap-3">
								<Skeleton className="h-5 w-5 rounded-full mt-0.5" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-48" />
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Skeleton className="h-5 w-5 rounded-full mt-0.5" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-36" />
									<Skeleton className="h-3 w-40" />
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Skeleton className="h-5 w-5 rounded-full mt-0.5" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-44" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<section>
					<Skeleton className="h-7 w-48 mb-6" />
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
						{Array.from({ length: 5 }).map((_, index) => (
							<div
								key={index}
								className="group overflow-hidden h-[28.125rem] border-0 shadow-sm py-0"
							>
								<div className="relative aspect-square overflow-hidden h-96">
									<Skeleton className="w-full h-96" />
								</div>

								<div className="p-3 space-y-3">
									<div className="space-y-2">
										<Skeleton className="h-4 w-full" />
										<div className="flex items-center gap-1">
											<Skeleton className="h-3.5 w-3.5 rounded-full" />
											<Skeleton className="h-3 w-8" />
										</div>
									</div>

									<div className="space-y-1.5">
										<Skeleton className="h-6 w-20" />
										<Skeleton className="h-3 w-24" />
									</div>

									<div className="space-y-2">
										<Skeleton className="h-9 w-full rounded-md" />
										<Skeleton className="h-9 w-full rounded-md" />
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
