import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type JWTPayload, verifyToken } from './jwt';

const TOKEN_NAME = 'd64a9d7049d31f6d43e12fb73617070e';

export async function setAuthToken(token: string) {
	const cookieStore = await cookies();
	cookieStore.set(TOKEN_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7,
	});
}

export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(TOKEN_NAME)?.value || null;
}

export async function removeAuthToken() {
	const cookieStore = await cookies();
	cookieStore.delete(TOKEN_NAME);
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
	try {
		const token = await getAuthToken();
		if (!token) return null;

		return verifyToken(token);
	} catch {
		return null;
	}
}

export async function requireAuth(): Promise<JWTPayload> {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	return user;
}
