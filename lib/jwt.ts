import jwt from 'jsonwebtoken';

const JWT_SECRET = 'd64a9d7049d31f6d43e12fb73617070e';

export interface JWTPayload {
	userId: string;
	email: string;
	role?: string;
}

export function generateToken(payload: JWTPayload): string {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: '7d',
	});
}

export function verifyToken(token: string): JWTPayload {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload;
	} catch {
		throw new Error('Token inválido');
	}
}
