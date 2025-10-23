'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { HTTPError } from 'ky';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { createAccountAction } from '@/actions/create-account-action';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUpSchema } from '@/schemas/sign-up-schema';
import { delay } from '@/utils/delay';

type SignUpType = z.infer<typeof signUpSchema>;

export function SignUpForm() {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<SignUpType>({
		resolver: zodResolver(signUpSchema),
		mode: 'all',
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	async function handleCreateAccount({ name, email, password }: SignUpType) {
		startTransition(async () => {
			await delay();
			try {
				const result = await createAccountAction({ name, email, password });

				if (result.success) {
					toast.success(result?.message, {
						position: 'top-right',
					});

					router.push('/');
				} else {
					toast.error(result?.error, {
						position: 'top-right',
					});
				}
			} catch (error) {
				if (error instanceof HTTPError) {
					toast.error(error?.message, {
						position: 'top-right',
					});
				}
			}
		});
	}

	function handleViewPassword() {
		setShowPassword((prevState) => !prevState);
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Criar conta</CardTitle>
				<CardDescription>
					Preencha todos campos para criar conta
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleCreateAccount)}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<FormLabel>Nome</FormLabel>
								<FormField
									name="name"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="text"
													placeholder="Seu nome"
													disabled={isPending}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid gap-2">
								<FormLabel>Email</FormLabel>
								<FormField
									name="email"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="email"
													placeholder="email@example.com"
													disabled={isPending}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid gap-2">
								<FormLabel>Senha</FormLabel>
								<FormField
									name="password"
									control={form.control}
									render={({ field }) => {
										return (
											<FormItem>
												<FormControl>
													<div className="relative">
														<Input
															type={showPassword ? 'text' : 'password'}
															placeholder="Sua senha"
															disabled={isPending}
															{...field}
														/>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={handleViewPassword}
															className="absolute right-3 top-1/2 -translate-y-1/2"
															disabled={isPending}
														>
															{showPassword ? (
																<EyeOff className="h-4 w-4" />
															) : (
																<Eye className="h-4 w-4" />
															)}
														</Button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
							</div>
						</div>

						<Button
							type="submit"
							size="lg"
							className="w-full mt-8"
							disabled={isPending}
						>
							{isPending ? (
								<LoaderCircle className="animate-spin" />
							) : (
								'Criar conta'
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
