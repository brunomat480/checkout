import { compare, hash } from 'bcryptjs';
import { HTTPError } from 'ky';
import { type NextRequest, NextResponse } from 'next/server';
import { getAuthCookieOptions } from '@/lib/auth';
import { generateToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		console.log('📝 Request recebido:', { email, hasPassword: !!password });

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email e senha são obrigatórios' },
				{ status: 400 },
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Formato de email inválido' },
				{ status: 400 },
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'A senha deve ter pelo menos 6 caracteres' },
				{ status: 400 },
			);
		}

		let user = await prisma.user.findUnique({
			where: { email },
		});

		let isNewUser = false;

		if (!user) {
			const hashedPassword = await hash(password, 12);

			user = await prisma.user.create({
				data: {
					email,
					name: name || null,
					password: hashedPassword,
				},
			});
			isNewUser = true;
			console.log('✅ Novo usuário criado:', user.id);
		} else {
			const isPasswordValid = await compare(password, user.password);
			if (!isPasswordValid) {
				return NextResponse.json(
					{ error: 'Credenciais inválidas' },
					{ status: 401 },
				);
			}
			console.log('✅ Login de usuário existente:', user.id);
		}

		const token = await generateToken({
			userId: user.id.toString(),
			email: user.email,
		});

		console.log('🔑 Token gerado:', token.substring(0, 20) + '...');

		const cookieOptions = getAuthCookieOptions();
		console.log('🍪 Opções do cookie:', cookieOptions);

		// Criar a resposta
		const response = NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: 'user',
				createdAt: user.createdAt,
			},
			isNewUser,
			message: isNewUser
				? 'Usuário criado e autenticado com sucesso'
				: 'Login realizado com sucesso',
		});

		// Definir o cookie na resposta
		response.cookies.set('auth-token', token, cookieOptions);

		console.log('🍪 Cookie definido na resposta');
		console.log(
			'📤 Headers da resposta:',
			Object.fromEntries(response.headers.entries()),
		);

		return response;
	} catch (error: any) {
		console.error('❌ Erro no handler:', error);

		if (error.code === 'P2002') {
			return NextResponse.json(
				{ error: 'Email já está em uso' },
				{ status: 400 },
			);
		}

		if (error instanceof HTTPError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.response.status },
			);
		}

		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}
