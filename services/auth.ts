import { api } from '@/lib/api';

export interface Auth {
	name: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export async function auth({
	name,
	email,
	password,
}: Auth): Promise<AuthResponse> {
	const response: AuthResponse = await api
		.post('auth', {
			json: {
				name,
				email,
				password,
			},
		})
		.json();

	return response;
}
