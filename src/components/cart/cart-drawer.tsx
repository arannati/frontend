'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ShoppingBag, X } from 'lucide-react'

import { useCart, useRemoveFromCart } from '@/api/hooks/cart/useCart'
import type { Product } from '@/api/requests/products'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/format-price'

import { CartItemRow } from './cart-item'

interface CartDrawerProps {
	open: boolean
	onClose: () => void
	products?: Record<string, Product>
}

export function CartDrawer({ open, onClose, products = {} }: CartDrawerProps) {
	const { data: cart, isLoading } = useCart()
	const removeFromCart = useRemoveFromCart()
	const [removingId, setRemovingId] = useState<string | null>(null)

	const items = cart?.items ?? []

	const total = items.reduce((sum, item) => {
		const p = products[item.productId]
		if (!p) return sum
		const price = p.discountAmount && p.discountAmount < p.price ? p.discountAmount : p.price
		return sum + price * item.quantity
	}, 0)

	const handleRemove = async (productId: string) => {
		setRemovingId(productId)
		await removeFromCart.mutateAsync(productId).finally(() => setRemovingId(null))
	}

	return (
		<>
			{open && (
				<div className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm' onClick={onClose} />
			)}

			<div
				className={cn(
					'bg-background fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col shadow-xl transition-transform duration-300',
					open ? 'translate-x-0' : 'translate-x-full',
				)}
			>
				<div className='border-border flex items-center justify-between border-b px-4 py-4'>
					<div className='flex items-center gap-2'>
						<ShoppingBag className='text-primary h-5 w-5' />
						<h2 className='text-foreground font-semibold'>Корзина</h2>
						{items.length > 0 && (
							<span className='bg-primary flex h-5 w-5 items-center justify-center rounded-full text-xs text-white'>
								{items.length}
							</span>
						)}
					</div>
					<Button variant='ghost' size='icon-sm' onClick={onClose}>
						<X className='h-4 w-4' />
					</Button>
				</div>

				<div className='flex-1 overflow-y-auto px-4'>
					{isLoading ? (
						<div className='flex flex-col gap-3 py-3'>
							{[1, 2, 3].map((i) => (
								<div key={i} className='flex gap-3 py-3'>
									<Skeleton className='h-16 w-16 shrink-0' />
									<div className='flex flex-1 flex-col gap-2'>
										<Skeleton className='h-4 w-full' />
										<Skeleton className='h-3 w-24' />
									</div>
								</div>
							))}
						</div>
					) : items.length === 0 ? (
						<div className='flex flex-col items-center gap-3 py-16 text-center'>
							<ShoppingBag className='text-muted-foreground h-12 w-12' />
							<p className='text-muted-foreground text-sm'>Корзина пуста</p>
							<Link href={ROUTES.CATALOG} onClick={onClose}>
								<Button variant='outline' size='sm'>
									Перейти в каталог
								</Button>
							</Link>
						</div>
					) : (
						<div className='divide-border divide-y'>
							{items.map((item) => (
								<CartItemRow
									key={item.productId}
									item={item}
									product={products[item.productId]}
									onRemove={handleRemove}
									removing={removingId === item.productId}
								/>
							))}
						</div>
					)}
				</div>

				{items.length > 0 && (
					<div className='border-border flex flex-col gap-3 border-t px-4 py-4'>
						<div className='flex items-center justify-between'>
							<span className='text-muted-foreground text-sm'>Итого</span>
							<span className='text-foreground font-semibold'>{formatPrice(total, 'KGS')}</span>
						</div>
						<Link href={ROUTES.CHECKOUT.ROOT} onClick={onClose} className='w-full'>
							<Button className='w-full'>Оформить заказ</Button>
						</Link>
					</div>
				)}
			</div>
		</>
	)
}
