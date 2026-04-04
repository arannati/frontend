import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ChevronLeft } from 'lucide-react'

import { getProductBySlug, getProducts } from '@/api/requests/products'
import { AddToCartButton } from '@/components/product/add-to-cart-button'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductPrice } from '@/components/product/product-price'
import { ReviewSection } from '@/components/review/review-section'
import { JsonLd } from '@/components/seo/json-ld'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/routes'
import { getMediaSource } from '@/lib/utils/get-media-source'

export const revalidate = 3600

interface Props {
	params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
	const data = await getProducts({ limit: 100 }).catch(() => ({ products: [] }))
	return (data.products ?? []).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const product = await getProductBySlug(slug).catch(() => null)
	if (!product) return {}

	const image = product.images[0] ? getMediaSource(product.images[0]) : undefined

	return {
		title: product.name,
		description: product.summary,
		openGraph: {
			title: product.name,
			description: product.summary,
			...(image && { images: [{ url: image, width: 800, height: 800 }] }),
		},
	}
}

export default async function ProductPage({ params }: Props) {
	const { slug } = await params
	const product = await getProductBySlug(slug).catch(() => null)
	if (!product) notFound()

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.name,
		description: product.description,
		image: product.images.map((k) => getMediaSource(k)),
		offers: {
			'@type': 'Offer',
			price:
				(product.discountAmount && product.discountAmount < product.price
					? product.discountAmount
					: product.price) / 100,
			priceCurrency: product.currency,
			availability: 'https://schema.org/InStock',
		},
		...(product.brand && { brand: { '@type': 'Brand', name: product.brand.title } }),
	}

	return (
		<>
			<JsonLd id='product-schema' data={jsonLd} />

			<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
				<Link
					href={ROUTES.CATALOG}
					className='text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 text-sm transition-colors'
				>
					<ChevronLeft className='h-4 w-4' />
					Каталог
				</Link>
				<div className='grid gap-8 md:grid-cols-2 lg:gap-12'>
					{/* Gallery */}
					<ProductGallery images={product.images} alt={product.name} />

					{/* Info */}
					<div className='flex flex-col gap-4'>
						{product.brand && (
							<Link
								href={ROUTES.BRANDS.SINGLE(product.brand.slug)}
								className='text-muted-foreground hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors'
							>
								{product.brand.title}
							</Link>
						)}

						<h1 className='text-foreground text-2xl leading-tight font-bold md:text-3xl'>
							{product.name}
						</h1>

						{product.summary && (
							<p className='text-muted-foreground text-sm leading-relaxed'>{product.summary}</p>
						)}

						<ProductPrice
							price={product.price}
							discountAmount={product.discountAmount}
							currency={product.currency}
							size='lg'
						/>

						{product.categories && product.categories.length > 0 && (
							<div className='flex flex-wrap gap-2'>
								{product.categories.map((c) => (
									<Link key={c.id} href={ROUTES.CATEGORIES.SINGLE(c.slug)}>
										<Badge variant='secondary'>{c.title}</Badge>
									</Link>
								))}
							</div>
						)}

						{product.countryOfOrigin && (
							<p className='text-muted-foreground text-sm'>
								Страна производства:{' '}
								<span className='text-foreground'>{product.countryOfOrigin}</span>
							</p>
						)}

						{product.description && (
							<div className='border-border mt-2 border-t pt-4'>
								<h2 className='text-foreground mb-2 text-sm font-semibold'>Описание</h2>
								<p className='text-muted-foreground text-sm leading-relaxed break-words whitespace-pre-line'>
									{product.description}
								</p>
							</div>
						)}

						<AddToCartButton productId={product.id} />
					</div>
				</div>

				{/* Reviews */}
				<div className='border-border mt-10 border-t pt-8'>
					<h2 className='text-foreground mb-5 text-xl font-bold'>Отзывы</h2>
					<ReviewSection productId={product.id} />
				</div>
			</div>
		</>
	)
}
