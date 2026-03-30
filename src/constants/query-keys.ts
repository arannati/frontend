export const queryKeys = {
	products: {
		all: ['products'] as const,
		list: (params: object) => ['products', 'list', params] as const,
		detail: (slug: string) => ['products', 'detail', slug] as const,
	},
	brands: {
		all: ['brands'] as const,
		detail: (slug: string) => ['brands', 'detail', slug] as const,
	},
	categories: {
		all: ['categories'] as const,
		detail: (slug: string) => ['categories', 'detail', slug] as const,
	},
	cart: ['cart'] as const,
	orders: {
		all: ['orders'] as const,
		detail: (id: string) => ['orders', id] as const,
		adminAll: (params: object) => ['orders', 'admin', params] as const,
	},
	reviews: {
		product: (productId: string) => ['reviews', 'product', productId] as const,
		rating: (productId: string) => ['reviews', 'rating', productId] as const,
	},
	payments: {
		detail: (id: string) => ['payments', id] as const,
	},
	education: {
		all: (params?: object) => ['education', params] as const,
		detail: (id: string) => ['education', id] as const,
	},
	me: ['me'] as const,
	account: ['account'] as const,
}
