'use client'

import { useState } from 'react'

import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'

import {
	useCreateBrand,
	useDeleteBrand,
	useUpdateBrand,
} from '@/api/hooks/brands/useBrandMutations'
import { useBrands } from '@/api/hooks/brands/useBrands'
import type { Brand } from '@/api/requests/brands'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { generateSlug } from '@/lib/utils/slug'

export default function AdminBrandsPage() {
	const { data: brands, isLoading } = useBrands()
	const createBrand = useCreateBrand()
	const updateBrand = useUpdateBrand()
	const deleteBrand = useDeleteBrand()

	const [newTitle, setNewTitle] = useState('')
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editTitle, setEditTitle] = useState('')

	const handleCreate = () => {
		if (!newTitle.trim()) return
		createBrand.mutate(
			{ title: newTitle.trim(), slug: generateSlug(newTitle.trim()) },
			{ onSuccess: () => setNewTitle('') },
		)
	}

	const startEdit = (brand: Brand) => {
		setEditingId(brand.id)
		setEditTitle(brand.title)
	}

	const handleUpdate = () => {
		if (!editingId || !editTitle.trim()) return
		updateBrand.mutate(
			{ id: editingId, data: { title: editTitle.trim(), slug: generateSlug(editTitle.trim()) } },
			{ onSuccess: () => setEditingId(null) },
		)
	}

	return (
		<div className='mx-auto max-w-2xl'>
			<h1 className='text-foreground mb-6 text-2xl font-bold'>Бренды</h1>

			{/* Create */}
			<div className='mb-6 flex gap-2'>
				<Input
					placeholder='Название бренда'
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
				/>
				<Button
					onClick={handleCreate}
					loading={createBrand.isPending}
					size='md'
					className='shrink-0'
				>
					<Plus className='h-4 w-4' />
					Добавить
				</Button>
			</div>

			{/* List */}
			<div className='bg-surface border-border divide-border divide-y rounded-2xl border'>
				{isLoading &&
					Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className='flex items-center gap-3 px-4 py-3'>
							<Skeleton className='h-4 w-40' />
						</div>
					))}

				{!isLoading && (!brands || brands.length === 0) && (
					<p className='text-muted-foreground px-4 py-6 text-center text-sm'>Брендов нет</p>
				)}

				{brands?.map((brand) => (
					<div key={brand.id} className='flex items-center gap-3 px-4 py-3'>
						{editingId === brand.id ? (
							<>
								<Input
									value={editTitle}
									onChange={(e) => setEditTitle(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
									className='h-8 flex-1'
									autoFocus
								/>
								<Button size='icon-sm' onClick={handleUpdate} loading={updateBrand.isPending}>
									<Check className='h-3.5 w-3.5' />
								</Button>
								<Button size='icon-sm' variant='ghost' onClick={() => setEditingId(null)}>
									<X className='h-3.5 w-3.5' />
								</Button>
							</>
						) : (
							<>
								<span className='text-foreground flex-1 text-sm font-medium'>{brand.title}</span>
								<Button size='icon-sm' variant='ghost' onClick={() => startEdit(brand)}>
									<Pencil className='h-3.5 w-3.5' />
								</Button>
								<Button
									size='icon-sm'
									variant='ghost'
									onClick={() => deleteBrand.mutate(brand.id)}
									loading={deleteBrand.isPending}
									className='hover:text-red-500'
								>
									<Trash2 className='h-3.5 w-3.5' />
								</Button>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
