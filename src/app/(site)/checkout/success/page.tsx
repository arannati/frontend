import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = { title: 'Заказ оформлен' }

export default function CheckoutSuccessPage() {
	return (
		<div className='flex flex-col items-center gap-5 py-24 text-center'>
			<div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full'>
				<svg className='text-primary h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
				</svg>
			</div>
			<div>
				<h1 className='text-foreground text-2xl font-bold'>Заказ оформлен!</h1>
				<p className='text-muted-foreground mt-2 text-sm'>Мы уведомим вас о статусе заказа</p>
			</div>
			<div className='flex gap-3'>
				<Link href={ROUTES.ACCOUNT.ORDERS}>
					<Button variant='secondary'>Мои заказы</Button>
				</Link>
				<Link href={ROUTES.CATALOG}>
					<Button>Продолжить покупки</Button>
				</Link>
			</div>
		</div>
	)
}
