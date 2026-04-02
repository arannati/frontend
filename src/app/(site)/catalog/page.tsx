import { Suspense } from 'react'

import type { Metadata } from 'next'

import { getBrands } from '@/api/requests/brands'
import { getCategories } from '@/api/requests/categories'
import { getProducts } from '@/api/requests/products'
import { ProductFilters } from '@/components/product/product-filters'
import { ProductGrid } from '@/components/product/product-grid'

export const metadata: Metadata = { title: 'Каталог' }

interface CatalogPageProps {
	searchParams: Promise<{
		category?: string
		brand?: string
		search?: string
		page?: string
	}>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
	const params = await searchParams
	const page = Number(params.page ?? 1)
	const limit = 24
	const offset = (page - 1) * limit

	const [productsData, categories, brands] = await Promise.all([
		getProducts({
			category: params.category,
			brandSlug: params.brand,
			search: params.search,
			limit,
			offset,
		}).catch(() => ({ products: [], total: 0 })),
		getCategories().catch(() => []),
		getBrands().catch(() => []),
	])

	return (
		<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
			<h1 className='text-foreground mb-6 text-2xl font-bold'>Каталог</h1>

			<div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
				{/* Filters sidebar */}
				<aside className='lg:w-56 lg:shrink-0'>
					<Suspense>
						<ProductFilters categories={categories} brands={brands} />
					</Suspense>
				</aside>

				{/* Products */}
				<div className='min-w-0 flex-1'>
					{(productsData.products?.length ?? 0) === 0 ? (
						<div className='py-16 text-center'>
							<p className='text-muted-foreground'>Ничего не найдено</p>
						</div>
					) : (
						<>
							<p className='text-muted-foreground mb-4 text-sm'>
								{productsData.total ?? productsData.products.length} товаров
							</p>
							<ProductGrid products={productsData.products} />
						</>
					)}
				</div>
			</div>
		</div>
	)
}
