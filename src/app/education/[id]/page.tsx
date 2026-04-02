'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { BookOpen, ChevronLeft, ExternalLink, Play } from 'lucide-react'

import { useEducationContent, usePublishContent } from '@/api/hooks/education/useEducation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function EducationDetailPage() {
	const params = useParams()
	const id = params.id as string
	const { isAdmin, isCosmetologist, isAuthenticated } = useAuth()
	const { data: item, isLoading, error } = useEducationContent(id)
	const publish = usePublishContent()

	if (!isAuthenticated || (!isCosmetologist && !isAdmin)) {
		return (
			<div className='mx-auto max-w-2xl px-4 py-16 text-center'>
				<h1 className='text-foreground mb-3 text-2xl font-bold'>Доступ ограничен</h1>
				<p className='text-muted-foreground mb-6'>
					У вас недостаточно прав для просмотра этого материала.
				</p>
				<Link href={ROUTES.EDUCATION}>
					<Button>Назад к списку</Button>
				</Link>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className='mx-auto max-w-3xl px-4 py-8'>
				<Skeleton className='mb-4 h-6 w-32' />
				<Skeleton className='mb-6 h-10 w-full' />
				<Skeleton className='mb-8 h-64 w-full rounded-2xl' />
				<Skeleton className='h-24 w-full' />
			</div>
		)
	}

	if (error || !item) {
		return (
			<div className='mx-auto max-w-2xl px-4 py-16 text-center'>
				<h1 className='text-foreground mb-3 text-2xl font-bold'>Материал не найден</h1>
				<Link href={ROUTES.EDUCATION}>
					<Button>К списку обучения</Button>
				</Link>
			</div>
		)
	}

	// Если материал не опубликован, разрешаем просмотр только админу
	if (!item.isPublished && !isAdmin) {
		return (
			<div className='mx-auto max-w-2xl px-4 py-16 text-center'>
				<h1 className='text-foreground mb-3 text-2xl font-bold'>Материал еще не опубликован</h1>
				<Link href={ROUTES.EDUCATION}>
					<Button>Назад к списку</Button>
				</Link>
			</div>
		)
	}

	const isFromAdmin =
		typeof document !== 'undefined' && document.referrer.includes('/admin/education')

	return (
		<div className='mx-auto max-w-3xl px-4 py-8 sm:px-6'>
			<Link
				href={isFromAdmin ? ROUTES.ADMIN.EDUCATION : ROUTES.EDUCATION}
				className='text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 text-sm transition-colors'
			>
				<ChevronLeft className='h-4 w-4' />
				{isFromAdmin ? 'Вернуться в админку' : 'Ко всем материалам'}
			</Link>

			<div className='mb-8'>
				<div className='mb-3 flex items-center gap-3'>
					<Badge variant='secondary'>
						{item.type === 'VIDEO' ? 'Видео' : item.type === 'ARTICLE' ? 'Статья' : 'Ссылка'}
					</Badge>
					{!item.isPublished && <Badge variant='outline'>Черновик</Badge>}
					{item.tags?.map((tag) => (
						<span key={tag} className='text-muted-foreground text-xs'>
							#{tag}
						</span>
					))}
				</div>
				<h1 className='text-foreground text-3xl leading-tight font-bold'>{item.title}</h1>
				{item.description && (
					<p className='text-muted-foreground mt-4 text-lg leading-relaxed'>{item.description}</p>
				)}
			</div>

			<div className='bg-surface border-border overflow-hidden rounded-2xl border'>
				{item.type === 'VIDEO' && item.url && (
					<div className='aspect-video w-full bg-black'>
						<video
							src={item.url}
							controls
							className='h-full w-full'
							poster={item.previewImageUrl}
						/>
					</div>
				)}

				{item.type === 'ARTICLE' && item.body && (
					<div className='prose prose-invert max-w-none p-6 sm:p-8'>
						<div className='text-foreground leading-relaxed whitespace-pre-wrap'>{item.body}</div>
					</div>
				)}

				{item.type === 'LINK' && item.url && (
					<div className='flex flex-col items-center gap-6 p-12 text-center'>
						<div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full'>
							<ExternalLink className='text-primary h-8 w-8' />
						</div>
						<div>
							<h3 className='text-foreground mb-2 text-xl font-semibold'>Внешний ресурс</h3>
							<p className='text-muted-foreground mb-6'>
								Этот материал находится на стороннем ресурсе. Нажмите кнопку ниже, чтобы перейти.
							</p>
							<a href={item.url} target='_blank' rel='noopener noreferrer'>
								<Button size='lg' className='gap-2'>
									Перейти <ExternalLink className='h-4 w-4' />
								</Button>
							</a>
						</div>
					</div>
				)}
			</div>

			{isAdmin && (
				<div className='mt-10 flex gap-4 border-t pt-8'>
					<Link href={ROUTES.ADMIN.EDUCATION}>
						<Button variant='outline'>К списку в админке</Button>
					</Link>
					<Button
						onClick={() => publish.mutate({ id: item.id, publish: !item.isPublished })}
						loading={publish.isPending}
					>
						{item.isPublished ? 'Снять с публикации' : 'Опубликовать'}
					</Button>
				</div>
			)}
		</div>
	)
}
