'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Plus, Trash2 } from 'lucide-react'

import type { CreateProductRequest, UpdateProductRequest } from '@/api/generated'
import { useCreateBrand } from '@/api/hooks/brands/useBrandMutations'
import { useBrands } from '@/api/hooks/brands/useBrands'
import { useCategories } from '@/api/hooks/categories/useCategories'
import { useCreateCategory } from '@/api/hooks/categories/useCategoryMutations'
import type { Product } from '@/api/requests/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { MultiImageUploader } from '@/components/ui/multi-image-uploader'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ROUTES } from '@/constants/routes'
import { generateSlug } from '@/lib/utils/slug'

interface ProductFormProps {
	initial?: Product
	onSubmit: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>
	isLoading?: boolean
}

const CURRENCIES = [
	{ value: 'KGS', label: 'KGS — сом' },
	{ value: 'KZT', label: 'KZT — тенге' },
	{ value: 'USD', label: 'USD — доллар' },
]

export function ProductForm({ initial, onSubmit, isLoading }: ProductFormProps) {
	const router = useRouter()
	const { data: brands } = useBrands()
	const { data: categories } = useCategories()

	const [name, setName] = useState(initial?.name ?? '')
	const [slug, setSlug] = useState(initial?.slug ?? '')
	const [summary, setSummary] = useState(initial?.summary ?? '')
	const [description, setDescription] = useState(initial?.description ?? '')
	const [price, setPrice] = useState(initial?.price ? String(initial.price / 100) : '')
	const [discountAmount, setDiscountAmount] = useState(
		initial?.discountAmount ? String(initial.discountAmount / 100) : '',
	)
	const [currency, setCurrency] = useState(initial?.currency ?? 'KGS')
	const [countryOfOrigin, setCountryOfOrigin] = useState(initial?.countryOfOrigin ?? '')
	const [brandId, setBrandId] = useState(initial?.brand?.id ?? initial?.brandId ?? '')
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
		initial?.categories?.map((c) => c.id) ?? [],
	)
	const [images, setImages] = useState<string[]>(initial?.images ?? [])

	const [brandModalOpen, setBrandModalOpen] = useState(false)
	const [newBrandTitle, setNewBrandTitle] = useState('')
	const createBrand = useCreateBrand()

	const [categoryModalOpen, setCategoryModalOpen] = useState(false)
	const [newCategoryTitle, setNewCategoryTitle] = useState('')
	const createCategory = useCreateCategory()

	useEffect(() => {
		if (name) {
			setSlug(generateSlug(name))
		}
	}, [name])

	const toggleCategory = (id: string) => {
		setSelectedCategoryIds((prev) =>
			prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
		)
	}

	const handleCreateBrand = async () => {
		if (!newBrandTitle.trim()) return
		const brand = await createBrand.mutateAsync({
			title: newBrandTitle.trim(),
			slug: generateSlug(newBrandTitle),
		})
		setBrandId(brand.id)
		setNewBrandTitle('')
		setBrandModalOpen(false)
	}

	const handleCreateCategory = async () => {
		if (!newCategoryTitle.trim()) return
		const category = await createCategory.mutateAsync({
			title: newCategoryTitle.trim(),
			slug: generateSlug(newCategoryTitle),
		})
		setSelectedCategoryIds((prev) => [...prev, category.id])
		setNewCategoryTitle('')
		setCategoryModalOpen(false)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await onSubmit({
			name,
			slug,
			summary,
			description,
			images,
			price: Math.round(Number(price) * 100),
			...(discountAmount ? { discountAmount: Math.round(Number(discountAmount) * 100) } : {}),
			currency,
			countryOfOrigin,
			brandId,
			categoryIds: selectedCategoryIds,
		})
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{/* Basic info */}
			<div className='bg-surface border-border space-y-4 rounded-2xl border p-5'>
				<h2 className='text-foreground font-semibold'>Основное</h2>
				<Input label='Название' value={name} onChange={(e) => setName(e.target.value)} required />
				<Input
					label='Краткое описание'
					value={summary}
					onChange={(e) => setSummary(e.target.value)}
					required
				/>
				<Textarea
					label='Описание'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
			</div>

			{/* Pricing */}
			<div className='bg-surface border-border space-y-4 rounded-2xl border p-5'>
				<h2 className='text-foreground font-semibold'>Цена</h2>
				<div className='grid grid-cols-3 gap-3'>
					<Input
						label='Цена'
						type='number'
						min='0'
						step='0.01'
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
					<Input
						label='Цена со скидкой'
						type='number'
						min='0'
						step='0.01'
						value={discountAmount}
						onChange={(e) => setDiscountAmount(e.target.value)}
						hint='Итоговая цена после скидки'
					/>
					<Select
						label='Валюта'
						options={CURRENCIES}
						value={currency}
						onChange={(e) => setCurrency(e.target.value)}
					/>
				</div>
				<Input
					label='Страна производства'
					value={countryOfOrigin}
					onChange={(e) => setCountryOfOrigin(e.target.value)}
					required
				/>
			</div>

			{/* Brand & Categories */}
			<div className='bg-surface border-border space-y-4 rounded-2xl border p-5'>
				<h2 className='text-foreground font-semibold'>Классификация</h2>

				{/* Brand */}
				<div>
					<div className='mb-1.5 flex items-center justify-between'>
						<p className='text-foreground text-sm font-medium'>Бренд</p>
						<button
							type='button'
							onClick={() => setBrandModalOpen(true)}
							className='text-primary hover:text-primary/80 flex items-center gap-1 text-xs transition-colors'
						>
							<Plus className='h-3 w-3' />
							Добавить
						</button>
					</div>
					<Select
						placeholder='Выберите бренд'
						options={brands?.map((b) => ({ value: b.id, label: b.title })) ?? []}
						value={brandId}
						onChange={(e) => setBrandId(e.target.value)}
					/>
				</div>

				{/* Categories */}
				<div>
					<div className='mb-2 flex items-center justify-between'>
						<p className='text-foreground text-sm font-medium'>Категории</p>
						<button
							type='button'
							onClick={() => setCategoryModalOpen(true)}
							className='text-primary hover:text-primary/80 flex items-center gap-1 text-xs transition-colors'
						>
							<Plus className='h-3 w-3' />
							Добавить
						</button>
					</div>
					<div className='flex flex-wrap gap-2'>
						{categories?.map((cat) => {
							const selected = selectedCategoryIds.includes(cat.id)
							return (
								<button
									key={cat.id}
									type='button'
									onClick={() => toggleCategory(cat.id)}
									className={`rounded-full border px-3 py-1 text-sm transition-colors ${
										selected
											? 'bg-primary border-primary text-white'
											: 'border-border text-muted-foreground hover:border-primary/50'
									}`}
								>
									{cat.title}
								</button>
							)
						})}
						{(categories?.length ?? 0) === 0 && (
							<p className='text-muted-foreground text-sm'>Нет категорий — добавьте первую</p>
						)}
					</div>
				</div>
			</div>

			{/* Images */}
			<div className='bg-surface border-border space-y-4 rounded-2xl border p-5'>
				<h2 className='text-foreground font-semibold'>Изображения</h2>
				<MultiImageUploader images={images} onChange={setImages} maxFiles={10} />
			</div>

			{/* Quick-add modals */}
			<Modal open={brandModalOpen} onClose={() => setBrandModalOpen(false)} title='Новый бренд'>
				<div className='space-y-4'>
					<Input
						label='Название'
						value={newBrandTitle}
						onChange={(e) => setNewBrandTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								handleCreateBrand()
							}
						}}
						autoFocus
					/>
					<div className='flex gap-2'>
						<Button
							type='button'
							size='sm'
							loading={createBrand.isPending}
							onClick={handleCreateBrand}
							className='flex-1'
						>
							Создать
						</Button>
						<Button
							type='button'
							size='sm'
							variant='ghost'
							onClick={() => setBrandModalOpen(false)}
						>
							Отмена
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				open={categoryModalOpen}
				onClose={() => setCategoryModalOpen(false)}
				title='Новая категория'
			>
				<div className='space-y-4'>
					<Input
						label='Название'
						value={newCategoryTitle}
						onChange={(e) => setNewCategoryTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								handleCreateCategory()
							}
						}}
						autoFocus
					/>
					<div className='flex gap-2'>
						<Button
							type='button'
							size='sm'
							loading={createCategory.isPending}
							onClick={handleCreateCategory}
							className='flex-1'
						>
							Создать
						</Button>
						<Button
							type='button'
							size='sm'
							variant='ghost'
							onClick={() => setCategoryModalOpen(false)}
						>
							Отмена
						</Button>
					</div>
				</div>
			</Modal>

			{/* Actions */}
			<div className='flex items-center gap-3'>
				<Button type='submit' loading={isLoading} size='md'>
					{initial ? 'Сохранить' : 'Создать товар'}
				</Button>
				<Button
					type='button'
					variant='ghost'
					size='md'
					onClick={() => router.push(ROUTES.ADMIN.PRODUCTS)}
				>
					Отмена
				</Button>
				{initial && (
					<div className='ml-auto'>
						<Button
							type='button'
							variant='ghost'
							size='icon-sm'
							className='hover:text-red-500'
							onClick={() => router.push(ROUTES.ADMIN.PRODUCTS)}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				)}
			</div>
		</form>
	)
}
