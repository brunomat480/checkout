'use server';

import { removeAuthToken } from '@/lib/auth';

export async function removeAuthTokenAction(): Promise<{
	success: boolean;
	message: string;
}> {
	const logOutAccount = await removeAuthToken();

	return logOutAccount;
}
