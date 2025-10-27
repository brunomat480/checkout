import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function getCurrentUserFromRequest(request: NextRequest) {
	try {
		const authHeader = request.headers.get('authorization');

		if (!authHeader) {
			return null;
		}

		let token = authHeader;
		if (authHeader.startsWith('Bearer ')) {
			token = authHeader.substring(7);
		}

		const decoded = await verifyToken(token);

		return {
			userId: decoded.userId,
			email: decoded.email,
		};
	} catch {
		return null;
	}
}
