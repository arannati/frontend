import Link from 'next/link'

import { Award, Globe2, Heart, Microscope, ShieldCheck, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

const STATS = [
	{ value: '19', label: 'лет на рынке', suffix: '+' },
	{ value: '2', label: 'страны присутствия', suffix: '' },
	{ value: '50', label: 'мировых брендов', suffix: '+' },
	{ value: '10 000', label: 'довольных клиентов', suffix: '+' },
]

const VALUES = [
	{
		icon: ShieldCheck,
		title: 'Только оригинальная продукция',
		description:
			'Мы являемся официальным дистрибьютором и гарантируем подлинность каждого продукта. Никаких подделок — только сертифицированный товар напрямую от производителя.',
	},
	{
		icon: Microscope,
		title: 'Наука и инновации',
		description:
			'Отбираем бренды, стоящие за которыми — годы клинических исследований и доказанная эффективность. Только то, что действительно работает.',
	},
	{
		icon: Users,
		title: 'Профессиональное сообщество',
		description:
			'Мы работаем для косметологов и вместе с ними. Программа для профессионалов, образовательный контент и поддержка экспертов — всё в одном месте.',
	},
	{
		icon: Globe2,
		title: 'Казахстан и Кыргызстан',
		description:
			'Присутствуем в обеих странах и понимаем местный рынок. Быстрая доставка, локальная поддержка и актуальный ассортимент для каждого региона.',
	},
	{
		icon: Heart,
		title: 'Забота о клиенте',
		description:
			'Консультируем, подбираем, сопровождаем. Для нас важно не просто продать продукт, а помочь достичь результата.',
	},
	{
		icon: Award,
		title: 'Лидерство с 2006 года',
		description:
			'Почти два десятилетия мы задаём стандарты индустрии. Опыт и репутация — то, что нельзя купить, только заработать.',
	},
]

export default function AboutPage() {
	return (
		<div className='flex flex-col'>
			{/* Hero */}
			<section className='bg-surface relative overflow-hidden px-4 py-24 sm:py-32'>
				<div className='bg-primary/5 absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl' />
				<div className='bg-primary/5 absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl' />

				<div className='relative mx-auto max-w-5xl'>
					<div className='flex flex-col items-start gap-10 lg:flex-row lg:items-center'>
						<div className='flex-1'>
							<span className='text-primary mb-4 inline-block text-sm font-semibold tracking-widest uppercase'>
								С 2006 года
							</span>
							<h1 className='text-foreground mb-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl'>
								Лидер рынка
								<br />
								<span className='text-primary'>космецевтики</span>
								<br />
								Центральной Азии
							</h1>
							<p className='text-muted-foreground max-w-lg text-lg leading-relaxed'>
								ТОО Arannati — эксклюзивный дистрибьютор ведущих мировых брендов профессиональной
								косметики в Казахстане и Кыргызстане. Мы соединяем косметологов с лучшими
								инновационными решениями для ухода за кожей.
							</p>
							<div className='mt-8 flex flex-wrap gap-3'>
								<Link href={ROUTES.CATALOG}>
									<Button size='lg' variant='primary'>
										Перейти в каталог
									</Button>
								</Link>
								<Link href={ROUTES.CONTACTS}>
									<Button size='lg' variant='outline'>
										Связаться с нами
									</Button>
								</Link>
							</div>
						</div>

						{/* Год основания */}
						<div className='border-primary/20 bg-primary/5 flex shrink-0 flex-col items-center justify-center rounded-3xl border px-12 py-10 text-center'>
							<p
								className='text-[80px] leading-none font-extrabold tracking-tighter'
								style={{
									background:
										'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 50%, transparent) 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}
							>
								2006
							</p>
							<p className='text-muted-foreground mt-1 text-sm font-medium'>год основания</p>
						</div>
					</div>
				</div>
			</section>

			{/* Цифры */}
			<section className='border-border border-y px-4 py-14'>
				<div className='mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4'>
					{STATS.map((stat) => (
						<div key={stat.label} className='flex flex-col items-center text-center'>
							<p className='text-primary text-4xl font-extrabold tracking-tight sm:text-5xl'>
								{stat.value}
								{stat.suffix}
							</p>
							<p className='text-muted-foreground mt-1.5 text-sm'>{stat.label}</p>
						</div>
					))}
				</div>
			</section>

			{/* Миссия */}
			<section className='px-4 py-20 sm:py-24'>
				<div className='mx-auto max-w-3xl text-center'>
					<span className='text-primary mb-4 inline-block text-sm font-semibold tracking-widest uppercase'>
						Наша миссия
					</span>
					<blockquote className='text-foreground text-2xl leading-snug font-semibold sm:text-3xl'>
						«Предоставить косметологам и их клиентам доступ к лучшим мировым брендам и инновационным
						решениям для ухода за кожей.»
					</blockquote>
					<p className='text-muted-foreground mt-6 text-base leading-relaxed'>
						Мы верим, что профессиональный результат начинается с правильного продукта. Поэтому
						отбираем только то, что прошло проверку мировыми стандартами качества и доказало свою
						эффективность в клинической практике.
					</p>
				</div>
			</section>

			{/* Ценности */}
			<section className='bg-surface px-4 py-20 sm:py-24'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-14 text-center'>
						<span className='text-primary mb-4 inline-block text-sm font-semibold tracking-widest uppercase'>
							Почему Arannati
						</span>
						<h2 className='text-foreground text-3xl font-bold sm:text-4xl'>Наши принципы</h2>
					</div>

					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						{VALUES.map((item) => {
							const Icon = item.icon
							return (
								<div
									key={item.title}
									className='bg-background border-border rounded-2xl border p-6 transition-shadow hover:shadow-md'
								>
									<div className='bg-primary/10 mb-4 inline-flex rounded-xl p-3'>
										<Icon className='text-primary h-5 w-5' />
									</div>
									<h3 className='text-foreground mb-2 font-semibold'>{item.title}</h3>
									<p className='text-muted-foreground text-sm leading-relaxed'>
										{item.description}
									</p>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className='px-4 py-20 sm:py-24'>
				<div className='mx-auto max-w-3xl text-center'>
					<h2 className='text-foreground mb-4 text-3xl font-bold'>Готовы начать сотрудничество?</h2>
					<p className='text-muted-foreground mb-8 text-base'>
						Свяжитесь с нами — мы поможем подобрать нужные продукты и расскажем об условиях работы.
					</p>
					<div className='flex flex-wrap items-center justify-center gap-3'>
						<Link href={ROUTES.CONTACTS}>
							<Button size='lg' variant='primary'>
								Написать нам
							</Button>
						</Link>
						<Link href={ROUTES.COSMETOLOGISTS}>
							<Button size='lg' variant='outline'>
								Программа для косметологов
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	)
}
