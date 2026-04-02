'use client'

import { Suspense } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { CreditCard, Lock, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

function formatAmount(amount: string | null, currency: string | null) {
	if (!amount || !currency) return '—'
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: currency,
		maximumFractionDigits: 0,
	}).format(Number(amount) / 100)
}

function MockCardInput({
	label,
	placeholder,
	className = '',
}: {
	label: string
	placeholder: string
	className?: string
}) {
	return (
		<div className={`flex flex-col gap-1.5 ${className}`}>
			<label className='text-foreground text-xs font-medium'>{label}</label>
			<input
				type='text'
				placeholder={placeholder}
				disabled
				className='border-border bg-muted text-muted-foreground placeholder:text-muted-foreground/50 rounded-xl border px-3 py-2.5 text-sm outline-none'
			/>
		</div>
	)
}

function PaymentPageContent() {
	const router = useRouter()
	const params = useSearchParams()

	const orderId = params.get('orderId')
	const amount = params.get('amount')
	const currency = params.get('currency')

	const handlePay = () => {
		router.push(ROUTES.CHECKOUT.SUCCESS)
	}

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950'>
			<div className='w-full max-w-md'>
				{/* Заголовок с замком */}
				<div className='mb-6 flex flex-col items-center gap-2 text-center'>
					<div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
						<Lock className='text-primary h-5 w-5' />
					</div>
					<h1 className='text-foreground text-xl font-bold'>Оплата заказа</h1>
					<p className='text-muted-foreground text-sm'>
						Заказ №{' '}
						<span className='font-mono text-xs'>{orderId?.slice(0, 8).toUpperCase() ?? '—'}</span>
					</p>
				</div>

				{/* Карточка оплаты */}
				<div className='bg-background border-border overflow-hidden rounded-2xl border shadow-sm'>
					{/* Тестовый режим — убрать после подключения Paybox */}
					<div className='flex items-center justify-center gap-2 bg-amber-50 px-4 py-2.5 dark:bg-amber-950/40'>
						<span className='h-2 w-2 animate-pulse rounded-full bg-amber-500' />
						<p className='text-xs font-medium text-amber-700 dark:text-amber-400'>
							Тестовый режим — оплата не списывается
						</p>
					</div>

					<div className='p-6'>
						{/* Сумма */}
						<div className='border-border mb-6 flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3.5 dark:bg-gray-900'>
							<span className='text-muted-foreground text-sm'>К оплате</span>
							<span className='text-foreground text-2xl font-bold'>
								{formatAmount(amount, currency)}
							</span>
						</div>

						{/* Форма карты (визуальная) */}
						<div className='mb-5 flex flex-col gap-4'>
							<div className='flex flex-col gap-1.5'>
								<label className='text-foreground text-xs font-medium'>Номер карты</label>
								<div className='border-border bg-muted relative rounded-xl border px-3 py-2.5'>
									<span className='text-muted-foreground/50 font-mono text-sm'>
										•••• •••• •••• ••••
									</span>
									<CreditCard className='text-muted-foreground/40 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
								</div>
							</div>

							<div className='grid grid-cols-2 gap-3'>
								<MockCardInput label='Срок действия' placeholder='MM / ГГ' />
								<MockCardInput label='CVV' placeholder='•••' />
							</div>

							<MockCardInput label='Имя на карте' placeholder='IVAN IVANOV' />
						</div>

						{/* Кнопка оплаты */}
						<Button size='lg' className='w-full' onClick={handlePay}>
							<Lock className='mr-2 h-4 w-4' />
							Оплатить {formatAmount(amount, currency)}
						</Button>

						{/* Безопасность */}
						<div className='mt-4 flex items-center justify-center gap-1.5'>
							<ShieldCheck className='text-muted-foreground h-3.5 w-3.5' />
							<p className='text-muted-foreground text-xs'>Защищено шифрованием SSL</p>
						</div>
					</div>
				</div>

				{/* Отмена */}
				<div className='mt-4 text-center'>
					<Link
						href={ROUTES.ACCOUNT.ORDERS}
						className='text-muted-foreground hover:text-foreground text-sm transition-colors'
					>
						Отменить и вернуться к заказам
					</Link>
				</div>
			</div>
		</div>
	)
}

export default function MockPaymentPage() {
	return (
		<Suspense>
			<PaymentPageContent />
		</Suspense>
	)
}
