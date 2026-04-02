import type { MetadataRoute } from 'next'

import { getBrands } from '@/api/requests/brands'
import { getCategories } from '@/api/requests/categories'
import { getProducts } from '@/api/requests/products'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arannati.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [products, categories, brands] = await Promise.all([
		getProducts({ limit: 1000 }).catch(() => ({
			products: [] as { slug: string; updatedAt: string }[],
		})),
		getCategories().catch(() => []),
		getBrands().catch(() => []),
	])

	const productUrls: MetadataRoute.Sitemap = products.products.map((p) => ({
		url: `${BASE_URL}/products/${p.slug}`,
		lastModified: p.updatedAt,
		changeFrequency: 'weekly',
		priority: 0.8,
	}))

	const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
		url: `${BASE_URL}/categories/${c.slug}`,
		lastModified: c.updatedAt,
		changeFrequency: 'weekly',
		priority: 0.7,
	}))

	const brandUrls: MetadataRoute.Sitemap = brands.map((b) => ({
		url: `${BASE_URL}/brands/${b.slug}`,
		lastModified: b.updatedAt,
		changeFrequency: 'monthly',
		priority: 0.6,
	}))

	return [
		{ url: BASE_URL, changeFrequency: 'daily', priority: 1 },
		{ url: `${BASE_URL}/catalog`, changeFrequency: 'daily', priority: 0.9 },
		...productUrls,
		...categoryUrls,
		...brandUrls,
	]
}
