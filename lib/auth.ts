import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from './jwt';

// const TOKEN_NAME = 'd64a9d7049d31f6d43e12fb73617070e';

export async function setAuthToken(token: string) {
	const cookieStore = await cookies();
	cookieStore.set('auth-token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7,
	});
}

export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get('auth-token')?.value || null;
}

export async function removeAuthToken() {
	const cookieStore = await cookies();
	cookieStore.delete('auth-token');
}

export async function getCurrentUser(): Promise<any | null> {
	try {
		const token = await getAuthToken();
		if (!token) return null;

		return verifyToken(token);
	} catch {
		return null;
	}
}

export async function requireAuth(): Promise<any> {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/sign-up');
	}

	return user;
}
