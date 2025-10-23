import type { Metadata } from 'next';
import { SignUpForm } from '@/components/sign-up-form';

export const metadata: Metadata = {
	title: 'Entrar',
};

export default function SignUpPage() {
	return (
		<div className="h-screen container flex items-center justify-center">
			<SignUpForm />
		</div>
	);
}
