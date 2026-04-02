'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { ChevronLeft } from 'lucide-react'

import { useDeleteProduct, useUpdateProduct } from '@/api/hooks/products/useProductMutations'
import { useProduct } from '@/api/hooks/products/useProducts'
import { ProductForm } from '@/components/admin/product-form'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'

export default function AdminProductEditPage() {
	const { id: slug } = useParams<{ id: string }>()
	const router = useRouter()

	const { data: product, isLoading } = useProduct(slug)

	const updateProduct = useUpdateProduct()
	const deleteProduct = useDeleteProduct()

	if (isLoading) {
		return (
			<div className='mx-auto max-w-2xl space-y-4'>
				<Skeleton className='h-6 w-32' />
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-64 w-full rounded-2xl' />
			</div>
		)
	}

	if (!product) {
		return <div className='text-muted-foreground py-16 text-center'>Товар не найден</div>
	}

	return (
		<div className='mx-auto max-w-2xl'>
			<Link
				href={ROUTES.ADMIN.PRODUCTS}
				className='text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 text-sm transition-colors'
			>
				<ChevronLeft className='h-4 w-4' />
				Товары
			</Link>

			<div className='mb-6 flex items-start justify-between'>
				<h1 className='text-foreground text-2xl font-bold'>{product.name}</h1>
				<Button
					variant='destructive'
					size='sm'
					loading={deleteProduct.isPending}
					onClick={() => {
						if (confirm(`Удалить «${product.name}»?`)) {
							deleteProduct.mutate(product.id, {
								onSuccess: () => router.push(ROUTES.ADMIN.PRODUCTS),
							})
						}
					}}
				>
					Удалить
				</Button>
			</div>

			<ProductForm
				initial={product}
				onSubmit={async (data) => {
					await updateProduct.mutateAsync({ id: product.id, data })
					router.push(ROUTES.ADMIN.PRODUCTS)
				}}
				isLoading={updateProduct.isPending}
			/>
		</div>
	)
}
