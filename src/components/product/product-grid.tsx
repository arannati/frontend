import type { Product } from '@/api/requests/products'

import { ProductCard } from './product-card'
import { ProductCardSkeleton } from './product-card-skeleton'

interface ProductGridProps {
	products?: Product[]
	isLoading?: boolean
	skeletonCount?: number
}

export function ProductGrid({ products, isLoading, skeletonCount = 8 }: ProductGridProps) {
	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4'>
			{isLoading
				? Array.from({ length: skeletonCount }).map((_, i) => <ProductCardSkeleton key={i} />)
				: products?.map((product) => <ProductCard key={product.id} product={product} />)}
		</div>
	)
}
