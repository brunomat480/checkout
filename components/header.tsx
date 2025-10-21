'use client';

import { LogOut, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';
import { AccountMenu } from '@/components/account-menu';
import { Text } from '@/components/text';
import { ThemeButton } from '@/components/theme/theme-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="container mx-auto px-4">
				<div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground border-b">
					<div className="flex items-center gap-6">
						<Text>Frete grátis acima de R$ 200</Text>
						<Text className="hidden lg:inline">
							Parcele em até 12x sem juros
						</Text>
					</div>
					<div className="flex items-center gap-4">
						<ThemeButton />
					</div>
				</div>

				<nav className="flex items-center justify-between py-3 md:py-4 gap-2 md:gap-8">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
							>
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left">
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-4 mt-6 pl-3">
								<div className="flex flex-col gap-2">
									<Text className="text-sm font-medium">Conta</Text>
									<Button
										variant="ghost"
										className="justify-start"
									>
										<User className="h-4 w-4 mr-2" />
										Minha Conta
									</Button>
									<Button
										variant="ghost"
										className="justify-start"
									>
										Meus Pedidos
									</Button>
									<Button
										variant="ghost"
										className="justify-start"
									>
										Lista de Desejos
									</Button>
									<Button
										variant="ghost"
										className="justify-start"
									>
										Configurações
									</Button>
								</div>
								<div className="border-t pt-4">
									<ThemeButton />
								</div>
								<div className="border-t pt-4">
									<Button
										variant="ghost"
										className="justify-start text-rose-500 dark:text-rose-400 w-full"
									>
										<LogOut className="h-4 w-4 mr-2" />
										Sair
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>

					<div className="flex items-center">
						<Text
							className="text-xl md:text-2xl font-bold bg-clip-text"
							variant="xl"
						>
							Logo
						</Text>
					</div>

					<form className="hidden md:flex flex-1 max-w-2xl mx-8">
						<div className="relative flex items-center w-full">
							<Input
								placeholder="Buscar produtos, marcas ou categorias..."
								className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11 pr-4"
							/>
							<Button
								variant="outline"
								size="lg"
								className="rounded-l-none h-11 px-6 hover:bg-primary hover:text-primary-foreground transition-colors"
								type="submit"
							>
								<Search className="h-5 w-5" />
							</Button>
						</div>
					</form>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsSearchOpen(!isSearchOpen)}
					>
						<Search className="h-5 w-5" />
					</Button>

					<div className="flex items-center gap-1 md:gap-2">
						<AccountMenu />
						<Button
							variant="ghost"
							size="icon"
							className="relative"
						>
							<ShoppingCart className="h-5 w-5" />
							<Badge
								variant="destructive"
								className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
							>
								3
							</Badge>
						</Button>
					</div>
				</nav>

				{isSearchOpen && (
					<div className="md:hidden pb-3 animate-in slide-in-from-top">
						<form className="flex items-center">
							<Input
								placeholder="Buscar produtos..."
								className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
								autoFocus
							/>
							<Button
								variant="outline"
								className="rounded-l-none h-10 px-4"
								type="submit"
							>
								<Search className="h-4 w-4" />
							</Button>
						</form>
					</div>
				)}
			</div>
		</header>
	);
}
