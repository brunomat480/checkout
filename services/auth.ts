import { api } from '@/lib/api';

interface Auth {
	name: string;
	email: string;
	password: string;
}

interface AuthResponse {
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
