'use client'

import { useTransition } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Search, SlidersHorizontal, X } from 'lucide-react'

import type { Brand } from '@/api/requests/brands'
import type { Category } from '@/api/requests/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils/cn'

interface ProductFiltersProps {
	categories?: Category[]
	brands?: Brand[]
	className?: string
}

export function ProductFilters({ categories, brands, className }: ProductFiltersProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [, startTransition] = useTransition()

	const [search, setSearch] = useState(searchParams.get('search') ?? '')
	const debouncedSearch = useDebounce(search, 400)
	const isFirstRender = useRef(true)

	const selectedCategory = searchParams.get('category') ?? ''
	const selectedBrand = searchParams.get('brand') ?? ''

	const updateParam = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		if (value) {
			params.set(key, value)
		} else {
			params.delete(key)
		}
		startTransition(() => router.push(`?${params.toString()}`))
	}

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
			return
		}
		updateParam('search', debouncedSearch)
	}, [debouncedSearch])

	const hasFilters = selectedCategory || selectedBrand || search

	const clearAll = () => {
		setSearch('')
		startTransition(() => router.push('/catalog'))
	}

	return (
		<div className={cn('flex flex-col gap-4', className)}>
			{/* Search */}
			<div className='relative'>
				<Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder='Поиск товаров...'
					className='border-border bg-surface text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-10 w-full rounded-xl border py-2 pr-4 pl-9 text-sm transition-colors outline-none focus:ring-2'
				/>
				{search && (
					<button
						onClick={() => setSearch('')}
						className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2'
					>
						<X className='h-4 w-4' />
					</button>
				)}
			</div>

			{/* Category pills */}
			{categories && categories.length > 0 && (
				<div className='flex flex-col gap-2'>
					<p className='text-foreground text-xs font-semibold tracking-wide uppercase'>Категории</p>
					<div className='flex flex-wrap gap-2'>
						<button
							onClick={() => updateParam('category', '')}
							className={cn(
								'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
								!selectedCategory
									? 'bg-primary border-primary text-white'
									: 'border-border text-muted-foreground hover:border-primary hover:text-primary',
							)}
						>
							Все
						</button>
						{categories.map((c) => (
							<button
								key={c.id}
								onClick={() => updateParam('category', selectedCategory === c.slug ? '' : c.slug)}
								className={cn(
									'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
									selectedCategory === c.slug
										? 'bg-primary border-primary text-white'
										: 'border-border text-muted-foreground hover:border-primary hover:text-primary',
								)}
							>
								{c.title}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Brand pills */}
			{brands && brands.length > 0 && (
				<div className='flex flex-col gap-2'>
					<p className='text-foreground text-xs font-semibold tracking-wide uppercase'>Бренды</p>
					<div className='flex flex-wrap gap-2'>
						<button
							onClick={() => updateParam('brand', '')}
							className={cn(
								'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
								!selectedBrand
									? 'bg-primary border-primary text-white'
									: 'border-border text-muted-foreground hover:border-primary hover:text-primary',
							)}
						>
							Все
						</button>
						{brands.map((b) => (
							<button
								key={b.id}
								onClick={() => updateParam('brand', selectedBrand === b.slug ? '' : b.slug)}
								className={cn(
									'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
									selectedBrand === b.slug
										? 'bg-primary border-primary text-white'
										: 'border-border text-muted-foreground hover:border-primary hover:text-primary',
								)}
							>
								{b.title}
							</button>
						))}
					</div>
				</div>
			)}

			{hasFilters && (
				<button
					onClick={clearAll}
					className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors'
				>
					<X className='h-3 w-3' />
					Сбросить фильтры
				</button>
			)}
		</div>
	)
}
