export function validateCreditCard(cardNumber: string): boolean {
	const digits = cardNumber.replace(/\D/g, '');

	if (digits.length < 13 || digits.length > 19) {
		return false;
	}

	let sum = 0;
	let isEven = false;

	for (let i = digits.length - 1; i >= 0; i--) {
		let digit = Number.parseInt(digits[i], 10);

		if (isEven) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}

		sum += digit;
		isEven = !isEven;
	}

	return sum % 10 === 0;
}

export function formatCreditCard(value: string): string {
	const digits = value.replace(/\D/g, '');
	const groups = digits.match(/.{1,4}/g);
	return groups ? groups.join(' ') : digits;
}

export function unmaskCreditCard(value: string): string {
	return value.replace(/\D/g, '');
}

export function formatOnlyNumbers(value: string): string {
	return value.replace(/\D/g, '');
}
