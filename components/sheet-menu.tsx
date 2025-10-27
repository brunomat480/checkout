'use client';

import { LogOut, Menu, User } from 'lucide-react';
import { Text } from '@/components/text';
import { ThemeButton } from '@/components/theme/theme-button';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

export function SheetMenu() {
	return (
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
						<Text
							variant="small"
							className="flex items-center"
						>
							<User className="h-4 w-4 mr-2" />
							Minha Conta
						</Text>

						<Button
							variant="ghost"
							className="justify-start"
						>
							Meus Pedidos
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
	);
}
