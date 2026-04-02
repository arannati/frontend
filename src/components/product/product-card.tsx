'use client'

import type { MouseEvent } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ShoppingBag } from 'lucide-react'

import { useAddToCart, useCart } from '@/api/hooks/cart/useCart'
import type { Product } from '@/api/requests/products'
import { QuantityControl } from '@/components/cart/quantity-control'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getMediaSource } from '@/lib/utils/get-media-source'

import { ProductPrice } from './product-price'

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	const primaryImage = product.images[0]
	const router = useRouter()
	const { isAuthenticated } = useAuth()
	const addToCart = useAddToCart()
	const { data: cart } = useCart()

	const inCart = cart?.items.some((i) => i.productId === product.id) ?? false

	const handleAddToCart = (e: MouseEvent) => {
		e.preventDefault()
		if (!isAuthenticated) {
			router.push(ROUTES.AUTH.LOGIN)
			return
		}
		addToCart.mutate({ productId: product.id, quantity: 1 })
	}

	return (
		<div className='group bg-surface border-border flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-md'>
			{/* Image */}
			<Link
				href={ROUTES.PRODUCTS.SINGLE(product.slug)}
				className='relative block aspect-square overflow-hidden bg-white'
			>
				{primaryImage ? (
					<ImageWithFallback
						src={getMediaSource(primaryImage)}
						alt={product.name}
						fill
						sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
						className='object-cover transition-transform duration-300 group-hover:scale-105'
					/>
				) : (
					<div className='bg-muted flex h-full w-full items-center justify-center'>
						<ShoppingBag className='text-muted-foreground h-10 w-10' />
					</div>
				)}

				{product.discountAmount && product.discountAmount > 0 ? (
					<span className='absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white'>
						−{Math.round((1 - product.discountAmount / product.price) * 100)}%
					</span>
				) : null}
			</Link>

			{/* Info */}
			<div className='flex flex-1 flex-col gap-2 p-3'>
				{product.brand && (
					<Link
						href={ROUTES.BRANDS.SINGLE(product.brand.slug)}
						className='text-muted-foreground hover:text-primary text-xs font-medium tracking-wide uppercase transition-colors'
						onClick={(e) => e.stopPropagation()}
					>
						{product.brand.title}
					</Link>
				)}

				<Link href={ROUTES.PRODUCTS.SINGLE(product.slug)}>
					<p className='text-foreground line-clamp-2 text-sm leading-snug font-medium'>
						{product.name}
					</p>
				</Link>

				{product.categories && product.categories.length > 0 && (
					<div className='mt-1 flex flex-wrap gap-1'>
						{product.categories.slice(0, 3).map((c) => (
							<Badge key={c.id} variant='secondary' className='px-1.5 py-0 text-[10px]'>
								{c.title}
							</Badge>
						))}
						{product.categories.length > 3 && (
							<Badge variant='secondary' className='px-1.5 py-0 text-[10px]'>
								+{product.categories.length - 3}
							</Badge>
						)}
					</div>
				)}

				<div className='mt-auto flex items-center justify-between gap-2 pt-1'>
					<ProductPrice
						price={product.price}
						discountAmount={product.discountAmount}
						currency={product.currency}
						size='sm'
					/>

					{inCart ? (
						<QuantityControl productId={product.id} size='sm' />
					) : (
						<Button
							size='icon-sm'
							variant='primary'
							onClick={handleAddToCart}
							loading={addToCart.isPending}
							aria-label='В корзину'
						>
							<ShoppingBag className='h-3.5 w-3.5' />
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
