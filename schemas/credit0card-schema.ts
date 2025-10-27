import z from 'zod';
import { unmaskCreditCard, validateCreditCard } from '@/lib/credit-card-utils';

export const creditCardSchema = z.object({
	credit_card: z
		.string()
		.min(1, 'Informe o número do cartão')
		.refine(
			(value) => validateCreditCard(unmaskCreditCard(value)),
			'Número de cartão inválido',
		),
	name: z.string().min(1, 'Informe o nome impresso no cartão'),
	month: z.string().min(2, 'Inválido').max(2, 'Inválido'),
	year: z.string().min(2, 'Inválido').max(2, 'Inválido'),
	cvv: z.string().min(3, '3 dígitos').max(3, '3 dígitos'),
	installments: z.string().min(1, 'Selecione uma parcela'),
});
