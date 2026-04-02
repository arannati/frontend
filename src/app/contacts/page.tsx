import Link from 'next/link'

import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'

const SCHEDULE = [
	{ day: 'Понедельник – Пятница', hours: '9:00 – 18:00', working: true },
	{ day: 'Суббота', hours: '10:00 – 16:00', working: true },
	{ day: 'Воскресенье', hours: 'Выходной', working: false },
]

const MAP_URL =
	'https://2gis.kz/almaty/firm/70000001063341055/76.921355%2C43.262689?m=76.921028%2C43.262755%2F19.19'

export default function ContactsPage() {
	return (
		<div className='flex flex-col'>
			{/* Hero */}
			<section className='bg-surface border-border border-b px-4 py-16 sm:py-20'>
				<div className='mx-auto max-w-3xl text-center'>
					<span className='text-primary mb-4 inline-block text-sm font-semibold tracking-widest uppercase'>
						Мы на связи
					</span>
					<h1 className='text-foreground mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
						Контакты
					</h1>
					<p className='text-muted-foreground text-lg'>
						Свяжитесь с нами любым удобным способом — ответим быстро.
					</p>
				</div>
			</section>

			{/* Контакты + режим работы */}
			<section className='px-4 py-16 sm:py-20'>
				<div className='mx-auto grid max-w-5xl gap-6 lg:grid-cols-2'>
					{/* Карточки контактов */}
					<div className='flex flex-col gap-4'>
						<h2 className='text-foreground mb-2 text-xl font-bold'>Как связаться</h2>

						<a
							href='tel:+77011118254'
							className='bg-surface border-border hover:border-primary group flex items-center gap-4 rounded-2xl border p-5 transition-colors'
						>
							<div className='bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'>
								<Phone className='text-primary h-5 w-5' />
							</div>
							<div>
								<p className='text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase'>
									Телефон
								</p>
								<p className='text-foreground group-hover:text-primary font-semibold transition-colors'>
									+7 (701) 111 82 54
								</p>
							</div>
						</a>

						<a
							href='https://wa.me/77017786040'
							target='_blank'
							rel='noopener noreferrer'
							className='bg-surface border-border hover:border-primary group flex items-center gap-4 rounded-2xl border p-5 transition-colors'
						>
							<div className='bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'>
								<MessageCircle className='text-primary h-5 w-5' />
							</div>
							<div>
								<p className='text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase'>
									WhatsApp
								</p>
								<p className='text-foreground group-hover:text-primary font-semibold transition-colors'>
									+7 (701) 778 60 40
								</p>
							</div>
						</a>

						<a
							href='mailto:support@arannati.kz'
							className='bg-surface border-border hover:border-primary group flex items-center gap-4 rounded-2xl border p-5 transition-colors'
						>
							<div className='bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'>
								<Mail className='text-primary h-5 w-5' />
							</div>
							<div>
								<p className='text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase'>
									Email
								</p>
								<p className='text-foreground group-hover:text-primary font-semibold transition-colors'>
									support@arannati.kz
								</p>
							</div>
						</a>

						<div className='bg-surface border-border flex items-start gap-4 rounded-2xl border p-5'>
							<div className='bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'>
								<MapPin className='text-primary h-5 w-5' />
							</div>
							<div>
								<p className='text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase'>
									Адрес
								</p>
								<p className='text-foreground leading-snug font-semibold'>
									г. Алматы, ул. Макатаева 127/11
								</p>
								<p className='text-muted-foreground mt-0.5 text-sm'>Блок 2, офис 426 / офис 469</p>
							</div>
						</div>
					</div>

					{/* Режим работы */}
					<div className='flex flex-col gap-4'>
						<h2 className='text-foreground mb-2 text-xl font-bold'>Режим работы</h2>

						<div className='bg-surface border-border rounded-2xl border p-5'>
							<div className='mb-4 flex items-center gap-3'>
								<div className='bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'>
									<Clock className='text-primary h-5 w-5' />
								</div>
								<div>
									<p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
										Часы работы
									</p>
									<p className='text-foreground text-sm font-medium'>Алматы (UTC+5)</p>
								</div>
							</div>

							<div className='divide-border divide-y'>
								{SCHEDULE.map(({ day, hours, working }) => (
									<div key={day} className='flex items-center justify-between py-3'>
										<span className='text-foreground text-sm'>{day}</span>
										<span
											className={
												working
													? 'text-foreground text-sm font-semibold'
													: 'text-muted-foreground text-sm'
											}
										>
											{hours}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Быстрый ответ */}
						<div className='bg-primary/5 border-primary/15 rounded-2xl border p-5'>
							<p className='text-foreground mb-1 font-semibold'>Нужен быстрый ответ?</p>
							<p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
								Напишите в WhatsApp или на email — постараемся ответить в течение одного рабочего
								часа.
							</p>
							<div className='flex flex-wrap gap-2'>
								<a href='https://wa.me/77017786040' target='_blank' rel='noopener noreferrer'>
									<Button variant='primary' size='sm'>
										WhatsApp
									</Button>
								</a>
								<a href='mailto:support@arannati.kz'>
									<Button variant='outline' size='sm'>
										Email
									</Button>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Карта */}
			<section className='px-4 pb-20 sm:pb-24'>
				<div className='mx-auto max-w-5xl'>
					<h2 className='text-foreground mb-4 text-xl font-bold'>Мы на карте</h2>
					<a
						href={MAP_URL}
						target='_blank'
						rel='noopener noreferrer'
						className='bg-surface border-border hover:border-primary group relative flex min-h-[220px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border transition-colors'
					>
						{/* Сетка-имитация карты */}
						<div
							className='absolute inset-0 opacity-[0.04]'
							style={{
								backgroundImage:
									'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
								backgroundSize: '40px 40px',
							}}
						/>
						{/* Декоративный круг-пинг */}
						<div className='relative flex flex-col items-center gap-3'>
							<div className='relative'>
								<div className='bg-primary/20 absolute -inset-4 animate-ping rounded-full' />
								<div className='bg-primary relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg'>
									<MapPin className='h-6 w-6 text-white' />
								</div>
							</div>
							<div className='text-center'>
								<p className='text-foreground font-semibold'>г. Алматы, ул. Макатаева 127/11</p>
								<p className='text-muted-foreground text-sm'>Блок 2, офис 426 / офис 469</p>
							</div>
							<span className='border-border bg-background group-hover:border-primary flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors'>
								<ExternalLink className='h-3.5 w-3.5' />
								Открыть в 2GIS
							</span>
						</div>
					</a>
				</div>
			</section>
		</div>
	)
}
