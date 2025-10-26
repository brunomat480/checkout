'use server';

import { getCurrentUser, type User } from '@/lib/auth';

export async function getCurrentUserAction(): Promise<User | null> {
	const user = await getCurrentUser();

	return user;
}
