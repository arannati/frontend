export const ROUTES = {
	HOME: '/',
	CATALOG: '/catalog',
	AUTH: {
		LOGIN: '/auth/login',
		VERIFY: '/auth/verify',
		TELEGRAM: '/auth/telegram',
		TG_FINALIZE: '/auth/tg-finalize',
	},
	PRODUCTS: {
		SINGLE: (slug: string) => `/products/${slug}`,
	},
	CATEGORIES: {
		SINGLE: (slug: string) => `/categories/${slug}`,
	},
	BRANDS: {
		SINGLE: (slug: string) => `/brands/${slug}`,
	},
	CART: '/cart',
	CHECKOUT: {
		ROOT: '/checkout',
		SUCCESS: '/checkout/success',
	},
	ACCOUNT: {
		ROOT: '/account',
		ORDERS: '/account/orders',
		ORDER: (id: string) => `/account/orders/${id}`,
		SETTINGS: '/account/settings',
		UPGRADE_ROLE: '/account/upgrade-role',
	},
	EDUCATION: '/education',
	ADMIN: {
		ROOT: '/admin',
		PRODUCTS: '/admin/products',
		PRODUCT_NEW: '/admin/products/new',
		PRODUCT_EDIT: (id: string) => `/admin/products/${id}`,
		CATEGORIES: '/admin/categories',
		BRANDS: '/admin/brands',
		ORDERS: '/admin/orders',
		ORDER: (id: string) => `/admin/orders/${id}`,
		USERS: '/admin/users',
		EDUCATION: '/admin/education',
		EDUCATION_NEW: '/admin/education/new',
	},
}
