import Link from 'next/link'

import { ROUTES } from '@/constants/routes'

export function Footer() {
	return (
		<footer className='border-border bg-surface mt-auto border-t'>
			<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6'>
				{/* Main grid */}
				<div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
					{/* Company info */}
					<div className='col-span-2 md:col-span-1'>
						<p className='text-foreground text-lg font-bold'>Arannati</p>
						<p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
							Профессиональная косметика для косметологов и ценителей качества
						</p>
						<div className='text-muted-foreground mt-4 space-y-1 text-xs'>
							<p>ТОО &laquo;АРАННАТИ&raquo;</p>
							<p>БИН: 070740013455</p>
							<a
								href='tel:+77017786040'
								className='hover:text-foreground block transition-colors'
							>
								+7 701 778 60 40
							</a>
							<a
								href='mailto:support@arannati.kz'
								className='hover:text-foreground block transition-colors'
							>
								support@arannati.kz
							</a>
						</div>
					</div>

					{/* Магазин */}
					<div>
						<p className='text-foreground mb-3 text-sm font-semibold'>Магазин</p>
						<ul className='space-y-2'>
							<li>
								<Link
									href={ROUTES.CATALOG}
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Каталог
								</Link>
							</li>
							<li>
								<Link
									href={ROUTES.CATALOG}
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Бренды
								</Link>
							</li>
						</ul>
					</div>

					{/* Клиентам */}
					<div>
						<p className='text-foreground mb-3 text-sm font-semibold'>Клиентам</p>
						<ul className='space-y-2'>
							<li>
								<Link
									href={ROUTES.ACCOUNT.ORDERS}
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Мои заказы
								</Link>
							</li>
							<li>
								<Link
									href={ROUTES.ACCOUNT.UPGRADE_ROLE}
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Стать косметологом
								</Link>
							</li>
							<li>
								<Link
									href={`${ROUTES.PUBLIC_OFFER}#returns`}
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Правила возврата
								</Link>
							</li>
						</ul>
					</div>

					{/* Контакты */}
					<div>
						<p className='text-foreground mb-3 text-sm font-semibold'>Контакты</p>
						<ul className='space-y-2'>
							<li>
								<a
									href='https://t.me/arannati_bot'
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Telegram
								</a>
							</li>
							<li>
								<a
									href='https://instagram.com/s.a.lab_cosmetics'
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Instagram
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className='border-border mt-10 border-t pt-6'>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
						{/* Copyright + documents */}
						<div className='flex flex-col gap-1'>
							<div className='flex items-center gap-3'>
								<p className='text-muted-foreground text-xs'>
									© {new Date().getFullYear()} Arannati. Все права защищены.
								</p>
								<Link
									href={ROUTES.DEV}
									className='text-muted-foreground/30 hover:text-muted-foreground/60 text-xs transition-colors'
								>
									dev
								</Link>
							</div>
							<div className='flex flex-wrap gap-3'>
								<Link
									href={ROUTES.PRIVACY_POLICY}
									className='text-muted-foreground hover:text-foreground text-xs transition-colors'
								>
									Политика конфиденциальности
								</Link>
								<Link
									href={ROUTES.PUBLIC_OFFER}
									className='text-muted-foreground hover:text-foreground text-xs transition-colors'
								>
									Публичная оферта
								</Link>
							</div>
						</div>

						{/* Payment logos */}
						<div className='flex items-center gap-3'>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src='/Visa_2021.svg' alt='Visa' className='h-5 w-auto opacity-70' />
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src='/Mastercard_2019_logo.svg' alt='Mastercard' className='h-7 w-auto opacity-70' />
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
