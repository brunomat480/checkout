'use client';

import { LogOut, Menu, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AccountMenu } from '@/components/account-menu';
import { SheetMenu } from '@/components/sheet-menu';
import { Text } from '@/components/text';
import { ThemeButton } from '@/components/theme/theme-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useCheckout } from '@/hooks/use-checkout';

export function Header() {
	const path = usePathname();

	const { status } = useAuth();
	const { totalItens, loading } = useCheckout();

	const [isSearchOpen, setIsSearchOpen] = useState(false);

	if (path === '/sign-up') {
		return null;
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="px-4">
				<div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground border-b">
					<div className="flex items-center gap-6">
						<Text variant="small">Frete grátis acima de R$ 200</Text>
						<Text
							variant="small"
							className="hidden lg:inline"
						>
							Parcele em até 12x sem juros
						</Text>
					</div>
					<div className="flex items-center gap-4">
						<ThemeButton />
					</div>
				</div>

				<nav className="flex items-center justify-between py-3 md:py-4 gap-2 md:gap-8">
					<SheetMenu />

					<Link href="/">
						<Text
							variant="title"
							className="select-none"
						>
							Logo
						</Text>
					</Link>

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
						{status === 'authenticated' && <AccountMenu />}
						{status === 'unauthenticated' && (
							<Button
								asChild
								size="lg"
							>
								<Link href="/sign-up">
									<User />
									Entrar
								</Link>
							</Button>
						)}

						{status === 'authenticated' && (
							<Button
								asChild
								variant="ghost"
								size="icon"
								className="relative"
							>
								<Link href="/resume">
									<ShoppingCart className="h-5 w-5" />
									{loading && (
										<Skeleton className="absolute -top-1 -right-1 h-5 w-5 rounded-full" />
									)}
									{!loading && (
										<Badge
											variant="destructive"
											className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
										>
											{totalItens}
										</Badge>
									)}
								</Link>
							</Button>
						)}
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
