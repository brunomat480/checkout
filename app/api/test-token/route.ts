import { NextResponse } from 'next/server';
import { generateToken, verifyToken } from '@/lib/jwt';

export async function GET() {
	try {
		// Gerar um novo token
		const payload = {
			userId: '1',
			email: 'teste@gmail.com',
		};

		const newToken = await generateToken(payload);
		console.log('🔐 NOVO TOKEN GERADO:', newToken);

		// Tentar verificar o mesmo token
		const verified = await verifyToken(newToken);
		console.log('✅ TOKEN VERIFICADO:', verified);

		return NextResponse.json({
			success: true,
			token: newToken,
			verified: verified,
		});
	} catch (error: any) {
		console.error('❌ Erro no teste:', error);
		return NextResponse.json(
			{
				success: false,
				error: error.message,
			},
			{ status: 500 },
		);
	}
}
