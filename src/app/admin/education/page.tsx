'use client'

import { useState } from 'react'

import Link from 'next/link'

import {
	BookOpen,
	ExternalLink,
	Eye,
	EyeOff,
	FileText,
	Film,
	Globe,
	Plus,
	Trash2,
} from 'lucide-react'

import {
	useAllEducation,
	useDeleteContent,
	usePublishContent,
} from '@/api/hooks/education/useEducation'
import type { ContentType } from '@/api/requests/education'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'

const TYPE_LABEL: Record<ContentType, string> = {
	VIDEO: 'Видео',
	ARTICLE: 'Статья',
	LINK: 'Ссылка',
}

const TYPE_ICON: Record<ContentType, any> = {
	VIDEO: Film,
	ARTICLE: FileText,
	LINK: Globe,
}

export default function AdminEducationPage() {
	const { data, isLoading } = useAllEducation()
	const deleteContent = useDeleteContent()
	const publishContent = usePublishContent()
	const [publishingId, setPublishingId] = useState<string | null>(null)

	return (
		<div>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-foreground text-2xl font-bold'>Образовательный контент</h1>
				<Link href={ROUTES.ADMIN.EDUCATION_NEW}>
					<Button size='sm'>
						<Plus className='mr-1.5 h-4 w-4' />
						Добавить
					</Button>
				</Link>
			</div>

			<div className='bg-surface border-border rounded-2xl border'>
				{isLoading &&
					Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className='border-border flex gap-4 border-b px-4 py-3 last:border-0'>
							<Skeleton className='h-4 w-48' />
							<Skeleton className='h-4 w-16' />
							<Skeleton className='h-4 w-16' />
						</div>
					))}

				{!isLoading && (!data?.items || data.items.length === 0) && (
					<div className='flex flex-col items-center gap-3 py-12 text-center'>
						<BookOpen className='text-muted-foreground h-10 w-10' />
						<p className='text-muted-foreground text-sm'>Контента нет</p>
						<Link href={ROUTES.ADMIN.EDUCATION_NEW}>
							<Button size='sm' variant='secondary'>
								Добавить первый материал
							</Button>
						</Link>
					</div>
				)}

				{data?.items?.map((item) => (
					<div
						key={item.id}
						className='border-border grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b px-4 py-3 last:border-0'
					>
						<div>
							<div className='flex items-center gap-2'>
								<div className='bg-muted flex h-8 w-8 items-center justify-center rounded-lg'>
									{(() => {
										const Icon = TYPE_ICON[item.type]
										return <Icon className='text-muted-foreground h-4 w-4' />
									})()}
								</div>
								<div>
									<p className='text-foreground text-sm font-medium'>{item.title}</p>
									<div className='mt-0.5 flex items-center gap-2'>
										<span className='text-muted-foreground text-xs'>{TYPE_LABEL[item.type]}</span>
										{item.tags?.length > 0 && (
											<span className='text-muted-foreground text-xs'>
												· {item.tags.join(', ')}
											</span>
										)}
									</div>
								</div>
							</div>
						</div>

						<Badge variant={item.isPublished ? 'success' : 'secondary'}>
							{item.isPublished ? 'Опубликован' : 'Черновик'}
						</Badge>

						<Link href={ROUTES.EDUCATION_SINGLE(item.id)}>
							<Button size='sm' variant='ghost' title='Предпросмотр'>
								<ExternalLink className='h-4 w-4' />
							</Button>
						</Link>

						<Button
							size='sm'
							variant='ghost'
							onClick={async () => {
								setPublishingId(item.id)
								try {
									await publishContent.mutateAsync({ id: item.id, publish: !item.isPublished })
								} finally {
									setPublishingId(null)
								}
							}}
							loading={publishingId === item.id}
							title={item.isPublished ? 'Снять с публикации' : 'Опубликовать'}
						>
							{item.isPublished ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
						</Button>

						<Button
							size='sm'
							variant='ghost'
							className='text-red-500 hover:text-red-600'
							onClick={() => {
								if (confirm('Удалить этот материал?')) {
									deleteContent.mutate(item.id)
								}
							}}
							loading={deleteContent.isPending}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				))}
			</div>

			{data && data.total > 0 && (
				<p className='text-muted-foreground mt-3 text-right text-sm'>Всего: {data.total}</p>
			)}
		</div>
	)
}
