'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { delay } from '@/utils/delay';

const signUpSchema = z.object({
	name: z.string().min(2, {
		message: 'Nome deve ter pelo menos 2 caracteres',
	}),
	email: z.string().email({
		message: 'Email inválido',
	}),
	password: z.string().min(6, {
		message: 'Senha deve ter pelo menos 6 caracteres',
	}),
});

type SignUpType = z.infer<typeof signUpSchema>;

interface SignUpFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => Promise<void>;
}

export function SignUpFormModal({
	open,
	onOpenChange,
	onSuccess,
}: SignUpFormModalProps) {
	const { login } = useAuth();
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
				const result = await login({ name, email, password });

				if (result.success) {
					toast.success(result?.message || 'Conta criada com sucesso!', {
						position: 'top-right',
					});

					if (onSuccess) {
						await onSuccess();
					}

					onOpenChange(false);
				} else {
					toast.error(result?.error || 'Erro ao criar conta', {
						position: 'top-right',
					});
				}
			} catch {
				toast.error('Erro ao conectar com o servidor', {
					position: 'top-right',
				});
			}
		});
	}

	function handleViewPassword() {
		setShowPassword((prevState) => !prevState);
	}

	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<AlertDialogContent className="max-w-md">
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
					onClick={() => onOpenChange(false)}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Fechar</span>
				</Button>

				<AlertDialogHeader className="space-y-2">
					<AlertDialogTitle className="text-2xl font-semibold">
						Criar conta
					</AlertDialogTitle>
					<AlertDialogDescription>
						Preencha todos campos para criar conta
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="mt-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleCreateAccount)}>
							<div className="flex flex-col gap-4">
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
										render={({ field }) => (
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
															className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
										)}
									/>
								</div>
							</div>

							<Button
								type="submit"
								size="lg"
								className="w-full mt-6"
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
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
