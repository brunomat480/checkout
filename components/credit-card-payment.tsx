'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { HTTPError } from 'ky';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { createPaymentAction } from '@/actions/payments/create-payment-action';
import { CreditCardComponent } from '@/components/credit-card';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
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
import { useCheckout } from '@/hooks/use-checkout';
import {
	formatCreditCard,
	formatOnlyNumbers,
	unmaskCreditCard,
	validateCreditCard,
} from '@/lib/credit-card-utils';

const creditCardSchema = z.object({
	credit_card: z
		.string()
		.min(1, 'Informe o número do cartão')
		.refine(
			(value) => validateCreditCard(unmaskCreditCard(value)),
			'Número de cartão inválido',
		),
	name: z.string().min(1, 'Informe o nome impresso no cartão'),
	month: z.string().min(2, 'Inválido').max(2, 'Inválido'),
	year: z.string().min(2, 'Inválido').max(2, 'Inválido'),
	cvv: z.string().min(3, '3 dígitos').max(3, '3 dígitos'),
	installments: z.string().min(1, 'Selecione uma parcela'),
});

export type CreditCardType = z.infer<typeof creditCardSchema>;

export function CreditCardPayment() {
	const router = useRouter();

	const { order } = useCheckout();
	const [isFlipped, setIsFlipped] = useState(false);
	const [isPending, startTransition] = useTransition();

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

	async function handleMakePayment({
		credit_card,
		cvv,
		installments,
		month,
		name,
		year,
	}: CreditCardType) {
		startTransition(async () => {
			if (!order?.id) {
				toast.error('Pedido não encontrado', {
					position: 'top-right',
				});
				return;
			}

			try {
				const response = await createPaymentAction({
					orderId: order.id,
					type: 'credit_card',
					card: {
						credit_card: unmaskCreditCard(credit_card),
						name,
						month,
						year,
						cvv,
						installments: Number(installments),
					},
				});

				if (!response.success) {
					toast.error(response.error, {
						position: 'top-right',
					});
					return;
				}

				toast.success('Pagamento realizado com sucesso!', {
					position: 'top-right',
				});

				router.push(`/resume/payment/success/${response.payment?.id}`);
			} catch (error) {
				if (error instanceof HTTPError) {
					toast.error(error.message, {
						position: 'top-right',
					});
				} else {
					toast.error('Erro ao realizar pagamento', {
						position: 'top-right',
					});
				}
			}
		});
	}

	const watchedValues: CreditCardType = form.watch();

	return (
		<div className="max-w-5xl mx-auto p-6">
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-col lg:flex-row gap-8 items-start">
						<div className="flex-1 w-full">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleMakePayment)}>
									<div className="flex items-start w-full gap-4 flex-wrap md:flex-nowrap">
										<FormField
											control={form.control}
											name="credit_card"
											render={({ field }) => (
												<FormItem className="w-full md:max-w-xs">
													<FormLabel>Número do cartão</FormLabel>
													<FormControl>
														<Input
															value={field.value}
															maxLength={19}
															onFocus={() => setIsFlipped(false)}
															placeholder="0000 0000 0000 0000"
															onChange={(e) => {
																const formatted = formatCreditCard(
																	e.target.value,
																);
																field.onChange(formatted);
															}}
															onBlur={field.onBlur}
															name={field.name}
															ref={field.ref}
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
										<div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
											<div className="flex items-start gap-4">
												<FormField
													control={form.control}
													name="month"
													render={({ field }) => (
														<FormItem className="w-full min-w-16">
															<FormControl>
																<Input
																	value={field.value}
																	maxLength={2}
																	placeholder="Mês"
																	onFocus={() => setIsFlipped(false)}
																	onChange={(e) => {
																		const formatted = formatOnlyNumbers(
																			e.target.value,
																		);
																		field.onChange(formatted);
																	}}
																	onBlur={field.onBlur}
																	name={field.name}
																	ref={field.ref}
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
														<FormItem className="w-full min-w-16">
															<FormControl>
																<Input
																	value={field.value}
																	maxLength={2}
																	placeholder="Ano"
																	onFocus={() => setIsFlipped(false)}
																	onChange={(e) => {
																		const formatted = formatOnlyNumbers(
																			e.target.value,
																		);
																		field.onChange(formatted);
																	}}
																	onBlur={field.onBlur}
																	name={field.name}
																	ref={field.ref}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="cvv"
													render={({ field }) => (
														<FormItem className="w-full md:min-w-24">
															<FormControl>
																<Input
																	value={field.value}
																	maxLength={3}
																	placeholder="CVV"
																	onFocus={() => setIsFlipped(true)}
																	onBlur={() => {
																		setIsFlipped(false);
																		field.onBlur();
																	}}
																	onChange={(e) => {
																		const formatted = formatOnlyNumbers(
																			e.target.value,
																		);
																		field.onChange(formatted);
																	}}
																	name={field.name}
																	ref={field.ref}
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

									<Button
										type="submit"
										size="lg"
										className="mt-8 w-full"
										disabled={isPending}
									>
										{isPending ? (
											<>
												<LoaderCircle className="animate-spin mr-2" />
												Processando...
											</>
										) : (
											'Realizar pagamento'
										)}
									</Button>
								</form>
							</Form>
						</div>

						<CreditCardComponent
							isFlipped={isFlipped}
							watchedValues={watchedValues}
						/>
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
