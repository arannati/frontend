'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Pencil, Plus, Trash2 } from 'lucide-react'

import { useDeleteProduct } from '@/api/hooks/products/useProductMutations'
import { useProducts } from '@/api/hooks/products/useProducts'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { formatPrice } from '@/lib/utils/format-price'
import { getMediaSource } from '@/lib/utils/get-media-source'

export default function AdminProductsPage() {
	const { data, isLoading } = useProducts({ limit: 100 })
	const deleteProduct = useDeleteProduct()

	return (
		<div>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-foreground text-2xl font-bold'>Товары</h1>
				<Link href={ROUTES.ADMIN.PRODUCT_NEW}>
					<Button size='md'>
						<Plus className='h-4 w-4' />
						Добавить товар
					</Button>
				</Link>
			</div>

			<div className='bg-surface border-border rounded-2xl border'>
				{/* Table header */}
				<div className='border-border grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b px-4 py-3'>
					<span className='text-muted-foreground w-12 text-xs font-medium tracking-wide uppercase'>
						Фото
					</span>
					<span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
						Название
					</span>
					<span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
						Цена
					</span>
					<span className='w-20' />
				</div>

				{isLoading &&
					Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='border-border grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b px-4 py-3 last:border-0'
						>
							<Skeleton className='h-10 w-10 rounded-lg' />
							<Skeleton className='h-4 w-48' />
							<Skeleton className='h-4 w-20' />
							<Skeleton className='h-8 w-20' />
						</div>
					))}

				{!isLoading && (!data?.products || data.products.length === 0) && (
					<p className='text-muted-foreground px-4 py-8 text-center text-sm'>Товаров нет</p>
				)}

				{data?.products?.map((product) => (
					<div
						key={product.id}
						className='border-border grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b px-4 py-3 last:border-0'
					>
						{/* Image */}
						<div className='bg-muted h-10 w-10 overflow-hidden rounded-lg'>
							{product.images?.[0] ? (
								<Image
									src={getMediaSource(product.images[0])}
									alt={product.name}
									width={40}
									height={40}
									className='h-full w-full object-cover'
								/>
							) : (
								<div className='h-full w-full' />
							)}
						</div>

						{/* Name */}
						<div>
							<p className='text-foreground text-sm font-medium'>{product.name}</p>
							{product.brand && (
								<p className='text-muted-foreground text-xs'>{product.brand.title}</p>
							)}
						</div>

						{/* Price */}
						<span className='text-foreground text-sm font-medium'>
							{formatPrice(product.price, product.currency)}
						</span>

						{/* Actions */}
						<div className='flex items-center gap-1'>
							<Link href={ROUTES.ADMIN.PRODUCT_EDIT(product.slug)}>
								<Button size='icon-sm' variant='ghost'>
									<Pencil className='h-3.5 w-3.5' />
								</Button>
							</Link>
							<Button
								size='icon-sm'
								variant='ghost'
								className='hover:text-red-500'
								onClick={() => {
									if (confirm(`Удалить «${product.name}»?`)) {
										deleteProduct.mutate(product.id)
									}
								}}
								loading={deleteProduct.isPending}
							>
								<Trash2 className='h-3.5 w-3.5' />
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
