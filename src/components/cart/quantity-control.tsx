'use client'

import { Minus, Plus } from 'lucide-react'

import { useAddToCart, useCart, useDecrementCartItem } from '@/api/hooks/cart/useCart'
import { cn } from '@/lib/utils/cn'

interface QuantityControlProps {
	productId: string
	size?: 'sm' | 'md'
	className?: string
}

export function QuantityControl({ productId, size = 'md', className }: QuantityControlProps) {
	const { data: cart } = useCart()
	const addToCart = useAddToCart()
	const decrement = useDecrementCartItem()

	const item = cart?.items.find((i) => i.productId === productId)
	const quantity = item?.quantity ?? 0

	const isPending =
		(addToCart.isPending && addToCart.variables?.productId === productId) ||
		(decrement.isPending && decrement.variables?.productId === productId)

	const handleDecrement = () => {
		decrement.mutate({ productId, currentQty: quantity })
	}

	const handleIncrement = () => {
		addToCart.mutate({ productId, quantity: 1 })
	}

	if (quantity === 0) return null

	const isSmall = size === 'sm'

	return (
		<div
			className={cn(
				'border-border bg-surface flex items-center overflow-hidden rounded-lg border',
				isSmall ? 'h-7' : 'h-9',
				isPending && 'pointer-events-none opacity-60',
				className,
			)}
		>
			<button
				onClick={handleDecrement}
				disabled={isPending}
				className={cn(
					'text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors',
					isSmall ? 'h-7 w-7' : 'h-9 w-9',
				)}
				aria-label='Уменьшить'
			>
				<Minus className={isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
			</button>

			<span
				className={cn(
					'text-foreground font-semibold tabular-nums select-none',
					isSmall ? 'min-w-[20px] text-center text-xs' : 'min-w-[28px] text-center text-sm',
				)}
			>
				{quantity}
			</span>

			<button
				onClick={handleIncrement}
				disabled={isPending}
				className={cn(
					'text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors',
					isSmall ? 'h-7 w-7' : 'h-9 w-9',
				)}
				aria-label='Увеличить'
			>
				<Plus className={isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
			</button>
		</div>
	)
}
