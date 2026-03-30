const CURRENCY_SYMBOLS: Record<string, string> = {
	KGS: 'сом',
	KZT: '₸',
	USD: '$',
}

export function formatPrice(amount: number, currency = 'KGS'): string {
	const symbol = CURRENCY_SYMBOLS[currency] ?? currency

	return `${amount.toLocaleString('ru-RU')} ${symbol}`
}

export function formatDiscount(original: number, discount: number): number {
	return Math.round((discount / original) * 100)
}
