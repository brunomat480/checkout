import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
				<div className="container mx-auto px-4">
					<div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
						{Array.from({ length: 10 }).map((_, index) => (
							<Skeleton
								key={index}
								className="h-8 w-20 rounded-md animate-pulse"
							/>
						))}
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-6 md:py-8">
				<section>
					<Skeleton className="h-8 w-48 mb-4 animate-pulse" />

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className="group overflow-hidden h-[28.125rem] border border-border/40 rounded-lg shadow-sm py-0 animate-pulse"
							>
								<div className="relative aspect-square overflow-hidden h-96 bg-muted">
									<div className="absolute top-2 left-2">
										<Skeleton className="h-5 w-12 rounded-full" />
									</div>
								</div>

								<div className="p-3 space-y-3">
									<div className="space-y-2">
										<Skeleton className="h-4 w-3/4" />
										<div className="flex items-center gap-1">
											<Skeleton className="h-3.5 w-3.5 rounded-full" />
											<Skeleton className="h-3 w-8" />
										</div>
									</div>

									<div className="space-y-1.5">
										<Skeleton className="h-6 w-20" />
										<Skeleton className="h-3 w-24" />
									</div>

									<div className="space-y-2 pt-2">
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
