import { CreditCard } from 'lucide-react';
import type { CreditCardType } from '@/components/credit-card-payment';

interface CreditCardProps {
	isFlipped: boolean;
	watchedValues: CreditCardType;
}

export function CreditCardComponent({
	isFlipped,
	watchedValues,
}: CreditCardProps) {
	function formatCardNumber(value: string) {
		return value
			.replace(/\s/g, '')
			.replace(/(\d{4})/g, '$1 ')
			.trim();
	}

	return (
		<div className="w-full max-w-md mx-auto lg:mx-0 lg:w-96 flex-shrink-0">
			<div className="perspective-1000">
				<div
					className={`relative w-full h-48 sm:h-52 lg:h-56 transition-transform duration-700`}
					style={{
						transformStyle: 'preserve-3d',
						transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
					}}
				>
					<div
						className="absolute w-full h-full"
						style={{ backfaceVisibility: 'hidden' }}
					>
						<div className="w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 lg:p-6 text-white">
							<div className="flex justify-between items-start mb-6 sm:mb-7 lg:mb-8">
								<div className="w-10 h-8 sm:w-11 sm:h-9 lg:w-12 lg:h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded opacity-80"></div>
								<CreditCard className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 opacity-70" />
							</div>

							<div className="mb-4 sm:mb-5 lg:mb-6">
								<div className="text-base sm:text-lg lg:text-xl tracking-widest font-mono">
									{watchedValues.credit_card
										? formatCardNumber(watchedValues.credit_card)
										: '#### #### #### ####'}
								</div>
							</div>

							<div className="flex justify-between items-end">
								<div className="flex-1 min-w-0 mr-2">
									<div className="text-xs opacity-70 mb-1">Nome do titular</div>
									<div className="text-xs sm:text-sm font-semibold uppercase tracking-wide truncate">
										{watchedValues.name || 'NOME COMPLETO'}
									</div>
								</div>
								<div className="flex-shrink-0">
									<div className="text-xs opacity-70 mb-1">Validade</div>
									<div className="text-xs sm:text-sm font-semibold">
										{watchedValues.month || 'MM'}/{watchedValues.year || 'AA'}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div
						className="absolute w-full h-full"
						style={{
							backfaceVisibility: 'hidden',
							transform: 'rotateY(180deg)',
						}}
					>
						<div className="w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
							<div className="w-full h-10 sm:h-11 lg:h-12 bg-gray-900 mt-4 sm:mt-5 lg:mt-6"></div>
							<div className="p-4 sm:p-5 lg:p-6">
								<div className="bg-white h-8 sm:h-9 lg:h-10 rounded flex items-center justify-end px-3 sm:px-4">
									<div className="text-gray-800 font-mono text-xs sm:text-sm italic">
										{watchedValues.cvv || 'CVV'}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
