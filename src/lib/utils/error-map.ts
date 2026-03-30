export const errorMessages: Record<string, string> = {
	'Invalid or expired code': 'Неверный или просроченный код',
	'User not found': 'Пользователь не найден',
	'Phone already registered': 'Телефон уже зарегистрирован',
	'Email already registered': 'Email уже зарегистрирован',
	'Too many attempts': 'Слишком много попыток. Попробуйте позже',
	Unauthorized: 'Неверные данные',
	'Product not found': 'Товар не найден',
	'Slug already exists': 'Такой slug уже занят',
	'Insufficient stock': 'Недостаточно товара на складе',
}

export function translateError(message?: string): string {
	if (!message) return 'Произошла ошибка. Попробуйте позже'

	return errorMessages[message] ?? message
}
