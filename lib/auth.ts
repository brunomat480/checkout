import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from './jwt';

export interface User {
	id: string;
	email: string;
}

export function getAuthCookieOptions() {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		maxAge: 60 * 60 * 24 * 7,
		path: '/',
	};
}

export async function setAuthToken(token: string) {
	const cookieStore = await cookies();
	cookieStore.set('auth-token', token, getAuthCookieOptions());
}

export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get('auth-token')?.value || null;
}

export async function removeAuthToken(): Promise<{
	success: boolean;
	message: string;
}> {
	const cookieStore = await cookies();
	cookieStore.delete('auth-token');

	return {
		success: true,
		message: 'Token de autenticação removido com sucesso',
	};
}

export async function getCurrentUser(): Promise<User | null> {
	try {
		const token = await getAuthToken();
		if (!token) return null;

		const decoded = await verifyToken(token);
		return decoded as User;
	} catch {
		return null;
	}
}

export async function requireAuth(): Promise<User> {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/sign-up');
	}

	return user;
}
