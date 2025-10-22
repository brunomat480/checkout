import { ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AccountMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="hidden md:flex items-center gap-2 px-3"
				>
					<User className="h-5 w-5" />
					<div className="hidden lg:flex flex-col items-start">
						<span className="text-xs text-muted-foreground">Olá, Bruno</span>
						<span className="text-sm font-medium flex items-center gap-1">
							Minha Conta
							<ChevronDown className="h-3 w-3" />
						</span>
					</div>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-56"
			>
				<DropdownMenuLabel className="flex flex-col">
					<span>Bruno</span>
					<span className="text-xs font-normal text-muted-foreground">
						teste@email.com
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
