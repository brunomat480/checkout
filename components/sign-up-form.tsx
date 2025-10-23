'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';
import type z from 'zod';
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
import { api } from '@/lib/api';
import { signUpSchema } from '@/schemas/sign-up-schema';

type SignUpType = z.infer<typeof signUpSchema>;

export function SignUpForm() {
	const form = useForm<SignUpType>({
		resolver: zodResolver(signUpSchema),
		mode: 'all',
		defaultValues: {
			// name: '',
			email: '',
			password: '',
		},
	});

	async function handleCreateAccount({ email, password }: SignUpType) {
		try {
			const response = await api
				.post('auth', {
					json: {
						email,
						password,
					},
				})
				.json();

			console.log(response);
		} catch (error) {
			if (error as HTTPError) {
				console.log(error);
			}
		}
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
							{/* <div className="grid gap-2">
								<FormLabel>Email</FormLabel>
								<FormField
									name="name"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="text"
													placeholder="Seu nome"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div> */}

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
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="password"
													placeholder="Sua senha"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<Button
							type="submit"
							size="lg"
							className="w-full mt-8"
						>
							Criar conta
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
