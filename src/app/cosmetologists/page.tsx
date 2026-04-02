'use client'

import Link from 'next/link'

import {
	BadgeCheck,
	BookOpen,
	ChevronRight,
	Gift,
	Percent,
	ShieldCheck,
	Sparkles,
	Star,
	Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

const BENEFITS = [
	{
		icon: Percent,
		title: 'Профессиональные цены',
		description:
			'Специальные оптовые условия на весь ассортимент — недоступные для обычных покупателей.',
	},
	{
		icon: BookOpen,
		title: 'Образовательный контент',
		description: 'Эксклюзивные видеоуроки, статьи и материалы от ведущих специалистов индустрии.',
	},
	{
		icon: ShieldCheck,
		title: 'Верифицированный статус',
		description: 'Значок косметолога в профиле — ваши отзывы видны как экспертные.',
	},
	{
		icon: Gift,
		title: 'Приоритетный доступ',
		description: 'Первыми узнавайте о новинках и акциях раньше остальных покупателей.',
	},
	{
		icon: Users,
		title: 'Профессиональное сообщество',
		description: 'Общайтесь с коллегами, делитесь опытом и обменивайтесь знаниями.',
	},
	{
		icon: Star,
		title: 'Персональный менеджер',
		description: 'Индивидуальная поддержка при подборе продуктов для ваших клиентов.',
	},
]

const STEPS = [
	{
		number: '01',
		title: 'Создайте аккаунт',
		description:
			'Зарегистрируйтесь на Arannati по номеру телефона или email — это займёт меньше минуты.',
	},
	{
		number: '02',
		title: 'Подайте заявку',
		description:
			'В личном кабинете перейдите в раздел «Стать косметологом» и заполните короткую форму.',
	},
	{
		number: '03',
		title: 'Пройдите верификацию',
		description: 'Наш менеджер свяжется с вами и подтвердит профессиональный статус.',
	},
	{
		number: '04',
		title: 'Получите доступ',
		description: 'Статус косметолога активируется — все преимущества доступны сразу.',
	},
]

export default function CosmetologistsPage() {
	const { isAuthenticated, isCosmetologist } = useAuth()

	return (
		<div className='flex flex-col'>
			{/* Баннер для действующих косметологов */}
			{isCosmetologist && (
				<section className='bg-primary/5 border-primary/10 border-b px-4 py-10'>
					<div className='mx-auto max-w-4xl'>
						<div className='flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left'>
							<div className='bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl'>
								<BadgeCheck className='text-primary h-8 w-8' />
							</div>
							<div className='flex-1'>
								<div className='mb-1 flex items-center justify-center gap-2 sm:justify-start'>
									<Sparkles className='text-primary h-4 w-4' />
									<span className='text-primary text-sm font-semibold tracking-wide uppercase'>
										Активный статус
									</span>
								</div>
								<h2 className='text-foreground text-2xl font-bold'>Вы уже косметолог Arannati</h2>
								<p className='text-muted-foreground mt-1 text-sm'>
									Все преимущества программы активны. Вам доступны профессиональные цены,
									верифицированный статус в отзывах и эксклюзивный образовательный контент.
								</p>
							</div>
							<Link href={ROUTES.EDUCATION} className='shrink-0'>
								<Button size='lg' variant='primary' className='gap-2'>
									<BookOpen className='h-4 w-4' />
									Перейти к обучению
								</Button>
							</Link>
						</div>
					</div>
				</section>
			)}

			{/* Hero */}
			<section className='bg-surface relative overflow-hidden px-4 py-24 text-center sm:py-32'>
				{/* Декоративные кружки */}
				<div className='bg-primary/5 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl' />
				<div className='bg-primary/5 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl' />

				<div className='relative mx-auto max-w-3xl'>
					<span className='bg-primary/10 text-primary mb-6 inline-block rounded-full px-4 py-1.5 text-sm font-medium'>
						Программа для профессионалов
					</span>
					<h1 className='text-foreground mb-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl'>
						Всё для косметологов —
						<br />
						<span className='text-primary'>в одном месте</span>
					</h1>
					<p className='text-muted-foreground mx-auto mb-10 max-w-xl text-lg'>
						Получите профессиональный статус и откройте доступ к специальным ценам, эксклюзивным
						материалам и сообществу экспертов.
					</p>
					<div className='flex flex-wrap items-center justify-center gap-3'>
						{isAuthenticated ? (
							<Link href={ROUTES.ACCOUNT.UPGRADE_ROLE}>
								<Button size='lg' variant='primary' className='gap-2'>
									Получить статус косметолога
									<ChevronRight className='h-4 w-4' />
								</Button>
							</Link>
						) : (
							<Link href={ROUTES.AUTH.LOGIN}>
								<Button size='lg' variant='primary' className='gap-2'>
									Начать — это бесплатно
									<ChevronRight className='h-4 w-4' />
								</Button>
							</Link>
						)}
						<Link href={ROUTES.CATALOG}>
							<Button size='lg' variant='outline'>
								Смотреть каталог
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Преимущества */}
			<section className='px-4 py-20 sm:py-24'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-14 text-center'>
						<h2 className='text-foreground text-3xl font-bold sm:text-4xl'>Что вы получаете</h2>
						<p className='text-muted-foreground mt-3 text-base'>
							Статус косметолога открывает возможности, недоступные обычным покупателям
						</p>
					</div>

					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						{BENEFITS.map((benefit) => {
							const Icon = benefit.icon
							return (
								<div
									key={benefit.title}
									className='bg-surface border-border group rounded-2xl border p-6 transition-shadow hover:shadow-md'
								>
									<div className='bg-primary/10 mb-4 inline-flex rounded-xl p-3'>
										<Icon className='text-primary h-5 w-5' />
									</div>
									<h3 className='text-foreground mb-2 font-semibold'>{benefit.title}</h3>
									<p className='text-muted-foreground text-sm leading-relaxed'>
										{benefit.description}
									</p>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Как получить статус */}
			<section className='bg-surface px-4 py-20 sm:py-24'>
				<div className='mx-auto max-w-4xl'>
					<div className='mb-14 text-center'>
						<h2 className='text-foreground text-3xl font-bold sm:text-4xl'>Как получить статус</h2>
						<p className='text-muted-foreground mt-3 text-base'>
							Четыре простых шага — и вы часть профессионального сообщества
						</p>
					</div>

					<div className='grid gap-8 sm:grid-cols-2'>
						{STEPS.map((step, i) => (
							<div key={step.number} className='flex gap-5'>
								<div className='flex flex-col items-center'>
									<div
										className={cn(
											'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold',
											'bg-primary text-white',
										)}
									>
										{step.number}
									</div>
									{i < STEPS.length - 1 && (
										<div className='bg-border mt-2 hidden w-px flex-1 sm:block' />
									)}
								</div>
								<div className='pb-8'>
									<h3 className='text-foreground mb-1.5 font-semibold'>{step.title}</h3>
									<p className='text-muted-foreground text-sm leading-relaxed'>
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className='px-4 py-20 sm:py-24'>
				<div className='bg-primary mx-auto max-w-3xl rounded-3xl px-8 py-14 text-center'>
					<BadgeCheck className='mx-auto mb-4 h-12 w-12 text-white/80' />
					<h2 className='mb-3 text-3xl font-bold text-white'>Готовы стать частью сообщества?</h2>
					<p className='mb-8 text-white/70'>
						Регистрация бесплатна. Статус косметолога подтверждается в течение 24 часов.
					</p>
					{isAuthenticated ? (
						<Link href={ROUTES.ACCOUNT.UPGRADE_ROLE}>
							<Button
								size='lg'
								className='text-primary gap-2 bg-white font-semibold hover:bg-white/90'
							>
								Подать заявку
								<ChevronRight className='h-4 w-4' />
							</Button>
						</Link>
					) : (
						<Link href={ROUTES.AUTH.LOGIN}>
							<Button
								size='lg'
								className='text-primary gap-2 bg-white font-semibold hover:bg-white/90'
							>
								Зарегистрироваться
								<ChevronRight className='h-4 w-4' />
							</Button>
						</Link>
					)}
				</div>
			</section>
		</div>
	)
}
