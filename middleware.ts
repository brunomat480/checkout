import { HTTPError } from 'ky';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const protectedApiRoutes = ['/api/order', '/api/payments'];
	const isProtectedApiRoute = protectedApiRoutes.some((route) =>
		pathname.startsWith(route),
	);

	const isProtectedPage = pathname.startsWith('/resume');

	if (!isProtectedApiRoute && !isProtectedPage) {
		return NextResponse.next();
	}

	let token: string | undefined | null;

	if (isProtectedPage) {
		token = request.cookies.get('auth-token')?.value;
	}

	if (isProtectedApiRoute) {
		const authHeader = request.headers.get('authorization');
		token = authHeader?.startsWith('Bearer ')
			? authHeader.substring(7)
			: authHeader;

		if (!token) {
			token = request.cookies.get('auth-token')?.value;
		}
	}

	if (!token) {
		if (isProtectedPage) {
			return NextResponse.redirect(new URL('/sign-up', request.url));
		}

		return NextResponse.json(
			{ error: 'Token de autenticação necessário' },
			{ status: 401 },
		);
	}

	try {
		const decoded = await verifyToken(token);

		const requestHeaders = new Headers(request.headers);
		requestHeaders.set('x-user-id', decoded.userId);
		requestHeaders.set('x-user-email', decoded.email);

		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	} catch (error) {
		if (isProtectedPage) {
			return NextResponse.redirect(new URL('/sign-up', request.url));
		}

		if (error instanceof HTTPError) {
			return NextResponse.json(
				{ error: `Token inválido: ${error.message}` },
				{ status: 401 },
			);
		}

		return NextResponse.json(
			{ error: 'Token inválido ou expirado' },
			{ status: 401 },
		);
	}
}

export const config = {
	matcher: ['/api/order/:path*', '/api/payments/:path*', '/resume/:path*'],
};
