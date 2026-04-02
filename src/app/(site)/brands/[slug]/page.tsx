import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ChevronLeft } from 'lucide-react'

import { getBrandBySlug, getBrands } from '@/api/requests/brands'
import { getProducts } from '@/api/requests/products'
import { ProductGrid } from '@/components/product/product-grid'
import { ROUTES } from '@/constants/routes'

export const revalidate = 3600

interface Props {
	params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
	const brands = await getBrands().catch(() => [])
	return brands.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const brand = await getBrandBySlug(slug).catch(() => null)
	if (!brand) return {}
	return { title: brand.title, description: `Товары бренда ${brand.title}` }
}

export default async function BrandPage({ params }: Props) {
	const { slug } = await params
	const brand = await getBrandBySlug(slug).catch(() => null)
	if (!brand) notFound()

	const products = await getProducts({ brandSlug: slug, limit: 48 }).catch(() => ({ products: [] }))
	const productsList = products?.products ?? []

	return (
		<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
			<Link
				href={ROUTES.CATALOG}
				className='text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 text-sm transition-colors'
			>
				<ChevronLeft className='h-4 w-4' />
				Каталог
			</Link>
			<h1 className='text-foreground mb-2 text-2xl font-bold'>{brand.title}</h1>
			<p className='text-muted-foreground mb-6 text-sm'>{productsList.length} товаров</p>
			<ProductGrid products={productsList} />
		</div>
	)
}
