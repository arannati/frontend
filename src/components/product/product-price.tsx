import { cn } from '@/lib/utils/cn'
import { formatDiscount, formatPrice } from '@/lib/utils/format-price'

interface ProductPriceProps {
	price: number
	discountAmount?: number
	currency?: string
	size?: 'sm' | 'md' | 'lg'
	className?: string
}

const sizes = {
	sm: { current: 'text-sm font-semibold', original: 'text-xs', badge: 'text-xs px-1.5 py-0.5' },
	md: { current: 'text-base font-semibold', original: 'text-sm', badge: 'text-xs px-1.5 py-0.5' },
	lg: { current: 'text-xl font-bold', original: 'text-sm', badge: 'text-xs px-2 py-0.5' },
}

export function ProductPrice({
	price,
	discountAmount,
	currency = 'KGS',
	size = 'md',
	className,
}: ProductPriceProps) {
	const hasDiscount = discountAmount && discountAmount > 0 && discountAmount < price
	const finalPrice = hasDiscount ? discountAmount : price
	const discountPercent = hasDiscount ? formatDiscount(price, discountAmount) : 0
	const s = sizes[size]

	return (
		<div className={cn('flex flex-wrap items-center gap-1.5', className)}>
			<span className={cn('text-foreground', s.current)}>{formatPrice(finalPrice, currency)}</span>

			{hasDiscount && (
				<>
					<span className={cn('text-muted-foreground line-through', s.original)}>
						{formatPrice(price, currency)}
					</span>
					<span
						className={cn(
							'rounded-full bg-red-100 font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400',
							s.badge,
						)}
					>
						−{discountPercent}%
					</span>
				</>
			)}
		</div>
	)
}
