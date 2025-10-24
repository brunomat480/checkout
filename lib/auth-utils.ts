import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function getCurrentUserFromRequest(request: NextRequest) {
	try {
		console.log('=== GET CURRENT USER FROM REQUEST ===');

		const authHeader = request.headers.get('authorization');
		console.log('Auth header:', authHeader);

		if (!authHeader) {
			console.log('Nenhum header authorization encontrado');
			return null;
		}

		let token = authHeader;
		if (authHeader.startsWith('Bearer ')) {
			token = authHeader.substring(7);
		}

		console.log('Token para verificação:', token.substring(0, 20) + '...');

		const decoded = await verifyToken(token); // Agora é async
		console.log('✅ Token decodificado via request:', decoded);

		return {
			userId: decoded.userId,
			email: decoded.email,
		};
	} catch (error: any) {
		console.error(
			'❌ Error verifying token in getCurrentUserFromRequest:',
			error.message,
		);
		return null;
	}
}
