import { NextResponse } from 'next/server';

export async function GET() {
	const response = NextResponse.json({
		message: 'Testando cookies',
		timestamp: new Date().toISOString(),
	});

	response.cookies.set('debug-test-1', 'valor-teste-1', {
		httpOnly: false, // Temporariamente false para debug
		secure: false,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24,
		path: '/',
	});

	response.cookies.set('debug-test-2', 'valor-teste-2', {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24,
		path: '/',
	});

	console.log('Cookies setados:', Array.from(response.cookies.getAll()));

	return response;
}

export async function POST(request: Request) {
	const response = NextResponse.json({
		success: true,
		message: 'Cookie setado via POST',
	});

	response.cookies.set('auth-debug', 'token-debug-' + Date.now(), {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7,
		path: '/',
	});

	return response;
}
