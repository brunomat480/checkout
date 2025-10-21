'use client';

import {
	ChevronDown,
	LogOut,
	Menu,
	Moon,
	Search,
	ShoppingCart,
	Sun,
	User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Text } from '@/components/text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
	const { setTheme } = useTheme();
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
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-auto p-0 text-muted-foreground hover:text-foreground"
								>
									<Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
									<Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
									<span className="sr-only">Toggle theme</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setTheme('light')}>
									Light
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme('dark')}>
									Dark
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme('system')}>
									System
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
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
									<Text className="text-sm font-medium mb-2">Tema</Text>
									<div className="flex flex-col gap-2">
										<Button
											variant="ghost"
											className="justify-start"
											onClick={() => setTheme('light')}
										>
											<Sun className="h-4 w-4 mr-2" />
											Light
										</Button>
										<Button
											variant="ghost"
											className="justify-start"
											onClick={() => setTheme('dark')}
										>
											<Moon className="h-4 w-4 mr-2" />
											Dark
										</Button>
										<Button
											variant="ghost"
											className="justify-start"
											onClick={() => setTheme('system')}
										>
											System
										</Button>
									</div>
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
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="hidden md:flex items-center gap-2 px-3"
								>
									<User className="h-5 w-5" />
									<div className="hidden lg:flex flex-col items-start">
										<span className="text-xs text-muted-foreground">
											Olá, Bruno
										</span>
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
								<DropdownMenuItem>Lista de Desejos</DropdownMenuItem>
								<DropdownMenuItem>Configurações</DropdownMenuItem>
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
