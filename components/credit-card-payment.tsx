// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import z from 'zod';
// import { Text } from '@/components/text';
// import { Card, CardContent } from '@/components/ui/card';
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select';

// const creditCardSchema = z.object({
// 	credit_card: z.string().min(1, 'Informe o número do cartão'),
// 	name: z.string().min(1, 'Informe o nome impresso no cartão'),
// 	month: z.string().min(1, 'Mês'),
// 	year: z.string().min(1, 'Ano'),
// 	cvv: z.string().min(3, '3 dígitos').max(3, '3 dígitos'),
// 	installments: z.string().min(1, 'Selecione uma parcela'),
// });

// type CreditCardType = z.infer<typeof creditCardSchema>;

// export function CreditCardPayment() {
// 	const form = useForm<CreditCardType>({
// 		mode: 'all',
// 		resolver: zodResolver(creditCardSchema),
// 		defaultValues: {
// 			credit_card: '',
// 			name: '',
// 			cvv: '',
// 			month: '',
// 			year: '',
// 			installments: '1',
// 		},
// 	});

// 	return (
// 		<Card className="max-w-5xl mx-auto">
// 			<CardContent className="space-y-6">
// 				<Form {...form}>
// 					<form>
// 						<div className="flex items-start w-full gap-4">
// 							<FormField
// 								control={form.control}
// 								name="credit_card"
// 								render={({ field }) => (
// 									<FormItem className="w-full max-w-xs">
// 										<FormLabel>Número do cartão</FormLabel>
// 										<FormControl>
// 											<Input {...field} />
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>

// 							<FormField
// 								control={form.control}
// 								name="name"
// 								render={({ field }) => (
// 									<FormItem className="w-full">
// 										<FormLabel>Nome</FormLabel>
// 										<FormControl>
// 											<Input {...field} />
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>
// 						</div>

// 						<div className="mt-4">
// 							<Text
// 								variant="sm"
// 								className="font-medium"
// 							>
// 								Validade
// 							</Text>
// 							<div className="flex items-start gap-6">
// 								<div className="flex items-start gap-4">
// 									<FormField
// 										control={form.control}
// 										name="month"
// 										render={({ field }) => (
// 											<FormItem className="w-full max-w-20">
// 												<FormControl>
// 													<Input
// 														maxLength={2}
// 														placeholder="Mês"
// 														{...field}
// 													/>
// 												</FormControl>
// 												<FormMessage />
// 											</FormItem>
// 										)}
// 									/>

// 									<FormField
// 										control={form.control}
// 										name="year"
// 										render={({ field }) => (
// 											<FormItem className="w-full max-w-20">
// 												<FormControl>
// 													<Input
// 														maxLength={2}
// 														placeholder="Ano"
// 														{...field}
// 													/>
// 												</FormControl>
// 												<FormMessage />
// 											</FormItem>
// 										)}
// 									/>
// 								</div>

// 								<div className="flex items-start gap-4 w-full">
// 									<FormField
// 										control={form.control}
// 										name="cvv"
// 										render={({ field }) => (
// 											<FormItem className="w-full max-w-32">
// 												<FormControl>
// 													<Input
// 														maxLength={3}
// 														placeholder="CVV"
// 														{...field}
// 													/>
// 												</FormControl>
// 												<FormMessage />
// 											</FormItem>
// 										)}
// 									/>

// 									<FormField
// 										control={form.control}
// 										name="installments"
// 										render={({ field }) => (
// 											<FormItem className="w-full">
// 												<Select
// 													onValueChange={field.onChange}
// 													defaultValue={field.value}
// 												>
// 													<FormControl>
// 														<SelectTrigger className="w-full">
// 															<SelectValue />
// 														</SelectTrigger>
// 													</FormControl>
// 													<SelectContent>
// 														<SelectItem value="1">1x de R$ 100,00</SelectItem>
// 													</SelectContent>
// 												</Select>
// 												<FormMessage />
// 											</FormItem>
// 										)}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 					</form>
// 				</Form>
// 			</CardContent>
// 		</Card>
// 	);
// }

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Text } from '@/components/text';
import { Card, CardContent } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const creditCardSchema = z.object({
	credit_card: z.string().min(1, 'Informe o número do cartão'),
	name: z.string().min(1, 'Informe o nome impresso no cartão'),
	month: z.string().min(1, 'Mês'),
	year: z.string().min(1, 'Ano'),
	cvv: z.string().min(3, '3 dígitos').max(3, '3 dígitos'),
	installments: z.string().min(1, 'Selecione uma parcela'),
});

type CreditCardType = z.infer<typeof creditCardSchema>;

export function CreditCardPayment() {
	const [isFlipped, setIsFlipped] = useState(false);

	const form = useForm<CreditCardType>({
		mode: 'all',
		resolver: zodResolver(creditCardSchema),
		defaultValues: {
			credit_card: '',
			name: '',
			cvv: '',
			month: '',
			year: '',
			installments: '1',
		},
	});

	const formatCardNumber = (value: string) => {
		return value
			.replace(/\s/g, '')
			.replace(/(\d{4})/g, '$1 ')
			.trim();
	};

	const watchedValues = form.watch();

	return (
		<div className="max-w-5xl mx-auto p-6">
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-col lg:flex-row gap-8 items-start">
						<div className="flex-1 w-full">
							<Form {...form}>
								<div>
									<div className="flex items-start w-full gap-4">
										<FormField
											control={form.control}
											name="credit_card"
											render={({ field }) => (
												<FormItem className="w-full max-w-xs">
													<FormLabel>Número do cartão</FormLabel>
													<FormControl>
														<Input
															{...field}
															maxLength={16}
															onFocus={() => setIsFlipped(false)}
															placeholder="0000 0000 0000 0000"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem className="w-full">
													<FormLabel>Nome</FormLabel>
													<FormControl>
														<Input
															{...field}
															onFocus={() => setIsFlipped(false)}
															placeholder="Nome impresso no cartão"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="mt-4">
										<Text
											variant="sm"
											className="font-medium mb-2"
										>
											Validade
										</Text>
										<div className="flex items-start gap-6">
											<div className="flex items-start gap-4">
												<FormField
													control={form.control}
													name="month"
													render={({ field }) => (
														<FormItem className="w-full max-w-20">
															<FormControl>
																<Input
																	maxLength={2}
																	placeholder="Mês"
																	{...field}
																	onFocus={() => setIsFlipped(false)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="year"
													render={({ field }) => (
														<FormItem className="w-full max-w-20">
															<FormControl>
																<Input
																	maxLength={2}
																	placeholder="Ano"
																	{...field}
																	onFocus={() => setIsFlipped(false)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className="flex items-start gap-4 w-full">
												<FormField
													control={form.control}
													name="cvv"
													render={({ field }) => (
														<FormItem className="w-full max-w-32">
															<FormControl>
																<Input
																	maxLength={3}
																	placeholder="CVV"
																	{...field}
																	onFocus={() => setIsFlipped(true)}
																	onBlur={() => setIsFlipped(false)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="installments"
													render={({ field }) => (
														<FormItem className="w-full">
															<Select
																onValueChange={field.onChange}
																defaultValue={field.value}
															>
																<FormControl>
																	<SelectTrigger className="w-full">
																		<SelectValue />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem value="1">
																		1x de R$ 100,00
																	</SelectItem>
																	<SelectItem value="2">
																		2x de R$ 50,00
																	</SelectItem>
																	<SelectItem value="3">
																		3x de R$ 33,33
																	</SelectItem>
																	<SelectItem value="4">
																		4x de R$ 25,00
																	</SelectItem>
																	<SelectItem value="5">
																		5x de R$ 20,00
																	</SelectItem>
																	<SelectItem value="6">
																		6x de R$ 16,67
																	</SelectItem>
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>
									</div>
								</div>
							</Form>
						</div>

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
													<div className="text-xs opacity-70 mb-1">
														Nome do titular
													</div>
													<div className="text-xs sm:text-sm font-semibold uppercase tracking-wide truncate">
														{watchedValues.name || 'NOME COMPLETO'}
													</div>
												</div>
												<div className="flex-shrink-0">
													<div className="text-xs opacity-70 mb-1">
														Validade
													</div>
													<div className="text-xs sm:text-sm font-semibold">
														{watchedValues.month || 'MM'}/
														{watchedValues.year || 'AA'}
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
												<div className="mt-3 sm:mt-4 text-xs text-white opacity-70">
													<p className="leading-relaxed">
														Este é um exemplo de cartão de crédito. Os dados são
														apenas para demonstração.
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<style jsx>{`
				.perspective-1000 {
					perspective: 1000px;
				}
			`}</style>
		</div>
	);
}
