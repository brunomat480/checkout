import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';

export function ProductCardResume() {
	return (
		<div className="flex items-start gap-4 py-6 border-b border-border/40 last:border-0">
			<div className="flex-shrink-0 overflow-hidden rounded-lg border border-border/50">
				<Image
					src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"
					alt="Produto"
					width={120}
					height={120}
					className="w-24 h-24 object-cover"
				/>
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<Text
							as="h3"
							className="font-semibold text-foreground mb-1"
						>
							Nome do Produto
						</Text>
						<Text
							as="p"
							variant="lg"
							className="font-bold text-foreground"
						>
							R$ 99,90
						</Text>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground hover:text-destructive"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex items-center gap-2 mt-4">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 bg-transparent"
					>
						<Minus className="h-3 w-3" />
					</Button>
					<Text className="text-sm font-medium min-w-[2rem] text-center">
						2
					</Text>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 bg-transparent"
					>
						<Plus className="h-3 w-3" />
					</Button>
				</div>
			</div>
		</div>
	);
}
