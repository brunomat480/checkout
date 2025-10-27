import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SuccessLoading() {
	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="flex justify-center">
					<Card className="max-w-2xl w-full border-0 shadow-lg">
						<CardHeader className="text-center pb-6 space-y-4">
							<div className="flex justify-center">
								<Skeleton className="h-20 w-20 rounded-full" />
							</div>

							<div className="space-y-2">
								<Skeleton className="h-8 w-72 mx-auto" />
								<Skeleton className="h-4 w-96 mx-auto" />
							</div>
						</CardHeader>

						<CardContent className="space-y-6">
							<div className="bg-muted/30 rounded-xl p-6 space-y-5">
								{[
									{ label: 'Número do pedido', width: 'w-24' },
									{ label: 'Data do pedido', width: 'w-20' },
									{ label: 'Método de pagamento', width: 'w-28' },
								].map((item, index) => (
									<div key={index}>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<Skeleton className="h-5 w-5 rounded-full" />
												<Skeleton className={`h-4 ${item.width}`} />
											</div>
											<Skeleton className="h-4 w-20" />
										</div>
										{index < 2 && <Skeleton className="w-full h-px mt-4" />}
									</div>
								))}

								<div className="flex items-center justify-between pt-2">
									<Skeleton className="h-5 w-20" />
									<Skeleton className="h-8 w-28" />
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 pt-2">
								<Skeleton className="h-11 flex-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
