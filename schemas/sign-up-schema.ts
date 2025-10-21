import z from 'zod';

export const signUpSchema = z.object({
	name: z.string().min(1, 'Nome obrigatório'),
	email: z.email('E-mail inválido'),
	password: z
		.string()
		.nonempty('Senha obrigatória')
		.min(6, 'No mínimo 6 caracters'),
});
