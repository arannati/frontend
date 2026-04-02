import Link from 'next/link'

import { ROUTES } from '@/constants/routes'

export function Footer() {
	return (
		<footer className='border-border bg-surface mt-auto border-t'>
			<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6'>
				<div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
					<div className='col-span-2 md:col-span-1'>
						<p className='text-foreground text-lg font-bold'>Arannati</p>
						<p className='text-muted-foreground mt-2 text-sm'>
							Профессиональная косметика для косметологов и ценителей качества
						</p>
					</div>

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
						</ul>
					</div>

					<div>
						<p className='text-foreground mb-3 text-sm font-semibold'>Контакты</p>
						<ul className='space-y-2'>
							<li>
								<a
									href='https://t.me/arannati'
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Telegram
								</a>
							</li>
							<li>
								<a
									href='https://instagram.com/arannati'
									className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								>
									Instagram
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className='border-border mt-10 border-t pt-6'>
					<p className='text-muted-foreground text-center text-xs'>
						© {new Date().getFullYear()} Arannati. Все права защищены.
					</p>
				</div>
			</div>
		</footer>
	)
}
