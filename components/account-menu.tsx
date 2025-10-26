'use client';

import { ChevronDown, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { Text } from '@/components/text';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

export function AccountMenu() {
	const { user, logout } = useAuth();

	async function handleLogout() {
		const userLogout = await logout();

		if (!userLogout.success) {
			toast.error('Erro ao tentar sair da conta', {
				position: 'top-right',
			});

			return;
		}

		toast.success('Você saiu da conta', {
			position: 'top-right',
		});
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="hidden md:flex items-center gap-2 px-3"
				>
					<User className="h-5 w-5" />
					<div className="hidden lg:flex flex-col items-start">
						<Text
							variant="sm"
							className="font-medium flex items-center gap-1"
						>
							Minha Conta
							<ChevronDown className="h-3 w-3" />
						</Text>
					</div>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-56"
			>
				<DropdownMenuLabel className="flex flex-col">
					<span className="text-xs font-normal text-muted-foreground">
						{user?.email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Meus Pedidos</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					asChild
					className="text-rose-500 dark:text-rose-400"
				>
					<button
						type="button"
						onClick={handleLogout}
						className="w-full"
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Sair</span>
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
