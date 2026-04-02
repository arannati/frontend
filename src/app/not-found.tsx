import Link from 'next/link'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
	return (
		<div className='flex min-h-screen flex-col'>
			<Header />

			<main className='flex flex-1 items-center justify-center px-4 py-20'>
				<div className='flex flex-col items-center text-center'>
					{/* Большая цифра */}
					<p
						className='text-[160px] leading-none font-extrabold tracking-tighter select-none sm:text-[200px]'
						style={{
							background:
								'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 40%, transparent) 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						404
					</p>

					<h1 className='text-foreground mt-2 text-2xl font-bold sm:text-3xl'>
						Страница не найдена
					</h1>
					<p className='text-muted-foreground mt-3 max-w-sm text-base'>
						Возможно, ссылка устарела или страница была удалена.
					</p>

					<div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
						<Link href={ROUTES.HOME}>
							<Button size='lg'>На главную</Button>
						</Link>
						<Link href={ROUTES.CATALOG}>
							<Button size='lg' variant='outline'>
								Каталог
							</Button>
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}
