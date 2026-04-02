const CURRENCY_SYMBOLS: Record<string, string> = {
	KGS: 'сом',
	KZT: '₸',
	USD: '$',
}

// Prices are stored in minor units (tyiyn/kopecks) — divide by 100 for display
export function formatPrice(amount: number, currency = 'KGS'): string {
	const symbol = CURRENCY_SYMBOLS[currency] ?? currency
	return `${(amount / 100).toLocaleString('ru-RU')} ${symbol}`
}

// discountAmount = final price after discount (not the discount size)
export function formatDiscount(original: number, discountedPrice: number): number {
	return Math.round((1 - discountedPrice / original) * 100)
}
