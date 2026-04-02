import type { Metadata } from 'next'
import Link from 'next/link'

import { ChevronLeft } from 'lucide-react'

import { CheckoutForm } from '@/components/checkout/checkout-form'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = { title: 'Оформление заказа' }

export default function CheckoutPage() {
	return (
		<div className='mx-auto max-w-lg px-4 py-8 sm:px-6'>
			<Link
				href={ROUTES.CART}
				className='text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 text-sm transition-colors'
			>
				<ChevronLeft className='h-4 w-4' />
				Корзина
			</Link>
			<h1 className='text-foreground mb-6 text-2xl font-bold'>Оформление заказа</h1>
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<CheckoutForm />
			</div>
		</div>
	)
}
