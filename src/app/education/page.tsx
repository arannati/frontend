'use client'

import type { Metadata } from 'next'
import Link from 'next/link'

import { BookOpen, Link as LinkIcon, Lock, Play } from 'lucide-react'

import { useMyEducation, usePublicEducation } from '@/api/hooks/education/useEducation'
import type { ContentType } from '@/api/requests/education'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

const TYPE_ICON: Record<ContentType, typeof BookOpen> = {
	VIDEO: Play,
	ARTICLE: BookOpen,
	LINK: LinkIcon,
}

const TYPE_LABEL: Record<ContentType, string> = {
	VIDEO: 'Видео',
	ARTICLE: 'Статья',
	LINK: 'Ссылка',
}

function ContentCard({
	item,
}: {
	item: {
		id: string
		type: ContentType
		title: string
		description?: string
		tags: string[]
		durationSeconds?: number
	}
}) {
	const Icon = TYPE_ICON[item.type]

	return (
		<Link href={ROUTES.EDUCATION_SINGLE(item.id)}>
			<div className='bg-surface border-border hover:border-primary flex h-full flex-col gap-3 rounded-2xl border p-5 transition-colors'>
				<div className='flex items-start gap-3'>
					<div className='bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl'>
						<Icon className='text-primary h-4 w-4' />
					</div>
					<div className='min-w-0 flex-1'>
						<div className='mb-1 flex items-center gap-2'>
							<Badge variant='secondary'>{TYPE_LABEL[item.type]}</Badge>
							{item.durationSeconds && (
								<span className='text-muted-foreground text-xs'>
									{Math.round(item.durationSeconds / 60)} мин
								</span>
							)}
						</div>
						<h3 className='text-foreground leading-snug font-semibold'>{item.title}</h3>
						{item.description && (
							<p className='text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed'>
								{item.description}
							</p>
						)}
					</div>
				</div>
				{item.tags?.length > 0 && (
					<div className='mt-auto flex flex-wrap gap-1'>
						{item.tags.map((tag) => (
							<span
								key={tag}
								className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs'
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</Link>
	)
}

export default function EducationPage() {
	const { isCosmetologist, isAuthenticated } = useAuth()
	const publicQuery = usePublicEducation()
	const myQuery = useMyEducation()

	const isLoading = isCosmetologist ? myQuery.isLoading : publicQuery.isLoading
	const items = isCosmetologist ? (myQuery.data?.items ?? []) : (publicQuery.data?.items ?? [])

	if (!isAuthenticated) {
		return (
			<div className='mx-auto max-w-2xl px-4 py-16 text-center'>
				<div className='bg-primary/10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full'>
					<Lock className='text-primary h-8 w-8' />
				</div>
				<h1 className='text-foreground mb-3 text-2xl font-bold'>Образовательный контент</h1>
				<p className='text-muted-foreground mb-6 text-sm'>
					Профессиональные материалы для косметологов. Войдите и подайте заявку на роль косметолога,
					чтобы получить доступ.
				</p>
				<Link href={ROUTES.AUTH.LOGIN}>
					<Button>Войти</Button>
				</Link>
			</div>
		)
	}

	if (!isCosmetologist) {
		return (
			<div className='mx-auto max-w-2xl px-4 py-16 text-center'>
				<div className='bg-primary/10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full'>
					<Lock className='text-primary h-8 w-8' />
				</div>
				<h1 className='text-foreground mb-3 text-2xl font-bold'>Для косметологов</h1>
				<p className='text-muted-foreground mb-6 text-sm'>
					Этот раздел доступен только подтверждённым косметологам. Загрузите диплом или сертификат,
					чтобы получить доступ.
				</p>
				<Link href={ROUTES.ACCOUNT.UPGRADE_ROLE}>
					<Button>Стать косметологом</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className='mx-auto max-w-4xl px-4 py-8 sm:px-6'>
			<div className='mb-6'>
				<h1 className='text-foreground text-2xl font-bold'>Образовательный контент</h1>
				<p className='text-muted-foreground mt-1 text-sm'>
					Профессиональные материалы для косметологов
				</p>
			</div>

			{isLoading && (
				<div className='grid gap-4 sm:grid-cols-2'>
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className='h-36 rounded-2xl' />
					))}
				</div>
			)}

			{!isLoading && items.length === 0 && (
				<div className='flex flex-col items-center gap-3 py-16 text-center'>
					<BookOpen className='text-muted-foreground h-12 w-12' />
					<p className='text-foreground font-medium'>Контент пока не добавлен</p>
					<p className='text-muted-foreground text-sm'>Загляните позже</p>
				</div>
			)}

			{!isLoading && items.length > 0 && (
				<div className='grid gap-4 sm:grid-cols-2'>
					{items.map((item) => (
						<ContentCard key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	)
}
