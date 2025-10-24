import { headers } from 'next/headers';

export interface CurrentUser {
	userId: string;
	email: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
	try {
		const headersList = await headers();

		const userId = headersList.get('x-user-id');
		const email = headersList.get('x-user-email');

		if (!userId || !email) {
			return null;
		}

		return {
			userId,
			email,
		};
	} catch {
		return null;
	}
}
