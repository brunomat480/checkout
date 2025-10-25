import { HTTPError } from 'ky';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
	const protectedRoutes = ['/api/order', '/api/payments'];

	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route),
	);

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	const authHeader = request.headers.get('authorization');

	const token = authHeader?.startsWith('Bearer ')
		? authHeader.substring(7)
		: authHeader;

	if (!token) {
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
		if (error instanceof HTTPError) {
			return NextResponse.json(
				{ error: `Token inválido: ${error.message}` },
				{ status: 401 },
			);
		}
	}
}

export const config = {
	matcher: ['/api/order/:path*', '/api/payments/:path*'],
};
