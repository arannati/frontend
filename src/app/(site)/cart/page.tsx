'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ChevronLeft, ShoppingBag } from 'lucide-react'

import { useCart, useClearCart, useRemoveFromCart } from '@/api/hooks/cart/useCart'
import { CartItemRow } from '@/components/cart/cart-item'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { formatPrice } from '@/lib/utils/format-price'

export default function CartPage() {
	const { data: cart, isLoading } = useCart()
	const removeFromCart = useRemoveFromCart()
	const clearCart = useClearCart()
	const [removingId, setRemovingId] = useState<string | null>(null)

	const items = cart?.items ?? []

	const total = items.reduce((sum, item) => {
		const price = item.product?.discountAmount ?? item.product?.price ?? 0
		return sum + price * item.quantity
	}, 0)

	const currency = items[0]?.product?.currency ?? 'KZT'

	const handleRemove = async (productId: string) => {
		setRemovingId(productId)
		await removeFromCart.mutateAsync(productId).finally(() => setRemovingId(null))
	}

	if (isLoading) {
		return (
			<div className='mx-auto max-w-2xl px-4 py-8 sm:px-6'>
				<Skeleton className='mb-6 h-8 w-32' />
				{[1, 2, 3].map((i) => (
					<div key={i} className='flex gap-4 py-4'>
						<Skeleton className='h-20 w-20 shrink-0' />
						<div className='flex flex-1 flex-col gap-2'>
							<Skeleton className='h-5 w-3/4' />
							<Skeleton className='h-4 w-1/3' />
						</div>
					</div>
				))}
			</div>
		)
	}

	if (items.length === 0) {
		return (
			<div className='flex flex-col items-center gap-4 py-24 text-center'>
				<ShoppingBag className='text-muted-foreground h-16 w-16' />
				<h1 className='text-foreground text-xl font-semibold'>Корзина пуста</h1>
				<p className='text-muted-foreground text-sm'>Добавьте товары из каталога</p>
				<Link href={ROUTES.CATALOG}>
					<Button>Перейти в каталог</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className='mx-auto max-w-2xl px-4 py-8 sm:px-6'>
			<Link
				href={ROUTES.CATALOG}
				className='text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 text-sm transition-colors'
			>
				<ChevronLeft className='h-4 w-4' />
				Продолжить покупки
			</Link>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-foreground text-2xl font-bold'>Корзина</h1>
				<button
					onClick={() => clearCart.mutate()}
					className='text-muted-foreground text-sm transition-colors hover:text-red-500'
				>
					Очистить
				</button>
			</div>

			<div className='bg-surface border-border divide-border divide-y rounded-2xl border'>
				{items.map((item) => (
					<div key={item.productId} className='px-4'>
						<CartItemRow
							item={item}
							product={item.product}
							onRemove={handleRemove}
							removing={removingId === item.productId}
						/>
					</div>
				))}
			</div>

			<div className='border-border mt-6 flex flex-col gap-4 rounded-2xl border p-4'>
				<div className='flex items-center justify-between'>
					<span className='text-muted-foreground'>Итого</span>
					<span className='text-foreground text-lg font-bold'>{formatPrice(total, currency)}</span>
				</div>
				<Link href={ROUTES.CHECKOUT.ROOT} className='w-full'>
					<Button size='lg' className='w-full'>
						Оформить заказ
					</Button>
				</Link>
			</div>
		</div>
	)
}
