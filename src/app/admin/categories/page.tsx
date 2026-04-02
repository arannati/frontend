'use client'

import { useState } from 'react'

import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'

import { useCategories } from '@/api/hooks/categories/useCategories'
import {
	useCreateCategory,
	useDeleteCategory,
	useUpdateCategory,
} from '@/api/hooks/categories/useCategoryMutations'
import type { Category } from '@/api/requests/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { generateSlug } from '@/lib/utils/slug'

export default function AdminCategoriesPage() {
	const { data: categories, isLoading } = useCategories()
	const createCategory = useCreateCategory()
	const updateCategory = useUpdateCategory()
	const deleteCategory = useDeleteCategory()

	const [newTitle, setNewTitle] = useState('')
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editTitle, setEditTitle] = useState('')

	const handleCreate = () => {
		if (!newTitle.trim()) return
		createCategory.mutate(
			{ title: newTitle.trim(), slug: generateSlug(newTitle.trim()) },
			{ onSuccess: () => setNewTitle('') },
		)
	}

	const startEdit = (category: Category) => {
		setEditingId(category.id)
		setEditTitle(category.title)
	}

	const handleUpdate = () => {
		if (!editingId || !editTitle.trim()) return
		updateCategory.mutate(
			{ id: editingId, data: { title: editTitle.trim(), slug: generateSlug(editTitle.trim()) } },
			{ onSuccess: () => setEditingId(null) },
		)
	}

	return (
		<div className='mx-auto max-w-2xl'>
			<h1 className='text-foreground mb-6 text-2xl font-bold'>Категории</h1>

			{/* Create */}
			<div className='mb-6 flex gap-2'>
				<Input
					placeholder='Название категории'
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
				/>
				<Button
					onClick={handleCreate}
					loading={createCategory.isPending}
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

				{!isLoading && (!categories || categories.length === 0) && (
					<p className='text-muted-foreground px-4 py-6 text-center text-sm'>Категорий нет</p>
				)}

				{categories?.map((category) => (
					<div key={category.id} className='flex items-center gap-3 px-4 py-3'>
						{editingId === category.id ? (
							<>
								<Input
									value={editTitle}
									onChange={(e) => setEditTitle(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
									className='h-8 flex-1'
									autoFocus
								/>
								<Button size='icon-sm' onClick={handleUpdate} loading={updateCategory.isPending}>
									<Check className='h-3.5 w-3.5' />
								</Button>
								<Button size='icon-sm' variant='ghost' onClick={() => setEditingId(null)}>
									<X className='h-3.5 w-3.5' />
								</Button>
							</>
						) : (
							<>
								<span className='text-foreground flex-1 text-sm font-medium'>{category.title}</span>
								<Button size='icon-sm' variant='ghost' onClick={() => startEdit(category)}>
									<Pencil className='h-3.5 w-3.5' />
								</Button>
								<Button
									size='icon-sm'
									variant='ghost'
									onClick={() => deleteCategory.mutate(category.id)}
									loading={deleteCategory.isPending}
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
