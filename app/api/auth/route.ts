import { HTTPError } from 'ky';
import { type NextRequest, NextResponse } from 'next/server';
import { setAuthToken } from '@/lib/auth';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (email !== 'usuario@exemplo.com' || password !== 'senha123') {
			return NextResponse.json(
				{ error: 'Credenciais inválidas' },
				{ status: 401 },
			);
		}

		const token = generateToken({
			userId: '123',
			email: email,
		});
		await setAuthToken(token);

		return NextResponse.json({
			success: true,
			user: {
				id: '123',
				email: email,
				role: 'user',
			},
		});
	} catch (error) {
		if (error instanceof HTTPError) {
			if (error.response.status === 401) {
				return NextResponse.json(
					{ message: error.message },
					{ status: error.response.status },
				);
			}
		}

		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}
