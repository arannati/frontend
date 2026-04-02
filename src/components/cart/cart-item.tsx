'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Trash2 } from 'lucide-react'

import type { CartItem as CartItemType } from '@/api/requests/cart'
import type { Product } from '@/api/requests/products'
import { QuantityControl } from '@/components/cart/quantity-control'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { formatPrice } from '@/lib/utils/format-price'
import { getMediaSource } from '@/lib/utils/get-media-source'

interface CartItemProps {
	item: CartItemType
	product?: Product
	onRemove: (productId: string) => void
	removing?: boolean
}

export function CartItemRow({ item, product, onRemove, removing }: CartItemProps) {
	const price = product
		? (product.discountAmount && product.discountAmount < product.price
				? product.discountAmount
				: product.price) * item.quantity
		: 0
	const image = product?.images[0]

	return (
		<div className='flex gap-3 py-3'>
			<div className='bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-xl'>
				{image ? (
					<Image
						src={getMediaSource(image)}
						alt={product?.name ?? ''}
						fill
						sizes='64px'
						className='object-cover'
					/>
				) : (
					<div className='bg-muted h-full w-full' />
				)}
			</div>

			<div className='flex flex-1 flex-col justify-between gap-2'>
				<div className='flex items-start justify-between gap-2'>
					{product ? (
						<Link
							href={ROUTES.PRODUCTS.SINGLE(product.slug)}
							className='text-foreground line-clamp-2 text-sm leading-snug font-medium hover:underline'
						>
							{product.name}
						</Link>
					) : (
						<p className='text-muted-foreground text-sm'>Загрузка...</p>
					)}
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={() => onRemove(item.productId)}
						loading={removing}
						className='text-muted-foreground -mt-1 shrink-0 hover:text-red-500'
						aria-label='Удалить'
					>
						<Trash2 className='h-3.5 w-3.5' />
					</Button>
				</div>

				<div className='flex items-center justify-between gap-2'>
					<QuantityControl productId={item.productId} size='sm' />
					<p className='text-foreground text-sm font-semibold'>
						{product ? formatPrice(price, product.currency) : '—'}
					</p>
				</div>
			</div>
		</div>
	)
}
