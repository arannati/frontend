'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ChevronLeft } from 'lucide-react'

import { useCreateProduct } from '@/api/hooks/products/useProductMutations'
import { ProductForm } from '@/components/admin/product-form'
import { ROUTES } from '@/constants/routes'

export default function AdminProductNewPage() {
	const router = useRouter()
	const createProduct = useCreateProduct()

	return (
		<div className='mx-auto max-w-2xl'>
			<Link
				href={ROUTES.ADMIN.PRODUCTS}
				className='text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 text-sm transition-colors'
			>
				<ChevronLeft className='h-4 w-4' />
				Товары
			</Link>
			<h1 className='text-foreground mb-6 text-2xl font-bold'>Новый товар</h1>

			<ProductForm
				onSubmit={async (data) => {
					await createProduct.mutateAsync(data as Parameters<typeof createProduct.mutateAsync>[0])
					router.push(ROUTES.ADMIN.PRODUCTS)
				}}
				isLoading={createProduct.isPending}
			/>
		</div>
	)
}
