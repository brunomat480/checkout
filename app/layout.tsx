import { Lato, Montserrat } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { CheckoutProvider } from '@/contexts/checkout-context';

const lato = Lato({
	variable: '--font-lato',
	subsets: ['latin'],
	weight: ['400', '700'],
});

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="pt-BR"
			suppressHydrationWarning
		>
			<body
				className={`${lato.variable} ${montserrat.variable} antialiased font-lato`}
			>
				<Toaster richColors />
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<CheckoutProvider>{children}</CheckoutProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
