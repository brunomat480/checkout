import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode('d64a9d7049d31f6d43e12fb73617070e');

export async function generateToken(payload: any): Promise<string> {
	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(JWT_SECRET);

	return token;
}

export async function verifyToken(token: string): Promise<any> {
	if (!token) {
		throw new Error('Token não fornecido');
	}

	try {
		const cleanToken = token.replace('Bearer ', '').trim();

		const { payload } = await jwtVerify(cleanToken, JWT_SECRET);

		return payload;
	} catch (error: any) {
		if (error.code === 'ERR_JWT_EXPIRED') {
			throw new Error('Token expirado');
		} else if (error.code === 'ERR_JWT_INVALID') {
			throw new Error('Token inválido');
		} else {
			throw new Error(`Erro na verificação do token: ${error.message}`);
		}
	}
}
