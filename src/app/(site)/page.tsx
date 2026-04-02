'use client'

import { useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ArrowRight } from 'lucide-react'

import { useProducts } from '@/api/hooks/products/useProducts'
import { ProductGrid } from '@/components/product/product-grid'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function HomePage() {
	const { data, isLoading } = useProducts({ random: true, limit: 8 })
	const router = useRouter()

	// Telegram OAuth редиректит на return_to#tgAuthResult=...
	// Если return_to = корень домена, перехватываем хэш здесь
	useEffect(() => {
		if (window.location.hash.includes('tgAuthResult=')) {
			router.replace(`${ROUTES.AUTH.TELEGRAM}${window.location.hash}`)
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<main className='flex flex-col'>
			{/* Hero */}
			<section className='bg-surface flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center'>
				<p className='text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase'>
					Профессиональная косметика
				</p>
				<h1 className='text-foreground mb-6 max-w-2xl text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl'>
					Красота, которой доверяют косметологи
				</h1>
				<p className='text-muted-foreground mb-10 max-w-lg text-base sm:text-lg'>
					Профессиональные средства для ухода за кожей — только проверенные бренды и
					сертифицированные продукты.
				</p>
				<Link href={ROUTES.CATALOG}>
					<Button size='lg' variant='primary'>
						Перейти в каталог
						<ArrowRight className='h-4 w-4' />
					</Button>
				</Link>
			</section>

			{/* Random products */}
			<section className='px-4 py-16 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-7xl'>
					<h2 className='text-foreground mb-8 text-2xl font-bold'>Вам может понравиться</h2>
					<ProductGrid products={data?.products} isLoading={isLoading} skeletonCount={8} />
				</div>
			</section>
		</main>
	)
}
