'use server';

import { HTTPError } from 'ky';
import { auth } from '@/services/auth';

interface CreateAccount {
	name: string;
	email: string;
	password: string;
}

interface CreateAccountResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export async function createAccountAction({
	name,
	email,
	password,
}: CreateAccount): Promise<CreateAccountResponse> {
	console.log({
		name,
		email,
		password,
	});

	try {
		const response = await auth({
			name,
			email,
			password,
		});

		return {
			success: true,
			message: response.message,
		};
	} catch (error) {
		if (error instanceof HTTPError) {
			const errBody = await error.response.json();

			return {
				success: false,
				error: errBody?.error || 'Erro ao criar conta.',
			};
		}

		return {
			success: false,
			error: 'Erro inesperado ao criar conta.',
		};
	}
}
