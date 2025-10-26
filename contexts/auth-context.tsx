'use client';

import { createContext, type ReactNode, useEffect, useState } from 'react';
import { getCurrentUserAction } from '@/actions/account/get-current-user-action';
import { removeAuthTokenAction } from '@/actions/account/remove-auth-token-action';
import type { User } from '@/lib/auth';
import { type Auth, type AuthResponse, auth } from '@/services/auth';

type AuthStatus = 'authenticated' | 'unauthenticated';

interface AuthContextType {
	user: User | null;
	status: AuthStatus;
	login: (value: Auth) => Promise<AuthResponse>;
	logout: () => Promise<{
		success: boolean;
		message: string;
	}>;
}

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>(
	{} as AuthContextType,
);

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [status, setStatus] = useState<AuthStatus>('unauthenticated');

	useEffect(() => {
		loadUser();
	}, [status]);

	async function loadUser() {
		const userData = await getCurrentUserAction();
		if (userData) {
			setUser(userData);
			setStatus('authenticated');
		}
	}

	async function login({ name, email, password }: Auth): Promise<AuthResponse> {
		const result = await auth({ name, email, password });

		if (result.success) {
			setStatus('authenticated');
			loadUser();
		}
		return result;
	}

	async function logout(): Promise<{
		success: boolean;
		message: string;
	}> {
		const userLogout = await removeAuthTokenAction();
		setUser(null);
		setStatus('unauthenticated');

		return userLogout;
	}

	return (
		<AuthContext.Provider value={{ user, status, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
