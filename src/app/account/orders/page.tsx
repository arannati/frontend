'use client'

import Link from 'next/link'

import { ChevronLeft, Package } from 'lucide-react'

import { useMyOrders } from '@/api/hooks/orders/useOrders'
import type { OrderStatus } from '@/api/requests/orders'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'

const STATUS_CONFIG: Record<
	OrderStatus,
	{ label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }
> = {
	PENDING: { label: 'Ожидает оплаты', variant: 'warning' },
	PAID: { label: 'Оплачен', variant: 'default' },
	CONFIRMED: { label: 'Подтверждён', variant: 'default' },
	SHIPPED: { label: 'В доставке', variant: 'default' },
	DELIVERED: { label: 'Доставлен', variant: 'success' },
	CANCELLED: { label: 'Отменён', variant: 'destructive' },
}

export default function OrdersPage() {
	const { data, isLoading } = useMyOrders()
	const orders = data?.items ?? []

	if (isLoading) {
		return (
			<div className='flex flex-col gap-3'>
				<Skeleton className='mb-4 h-8 w-32' />
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className='h-24 w-full rounded-2xl' />
				))}
			</div>
		)
	}

	if (orders.length === 0) {
		return (
			<div className='flex flex-col gap-3'>
				<div>
					<Link
						href='/account'
						className='text-muted-foreground hover:text-foreground mb-1 flex items-center gap-1 text-sm transition-colors'
					>
						<ChevronLeft className='h-4 w-4' />
						Профиль
					</Link>
					<h1 className='text-foreground mb-2 text-2xl font-bold'>Мои заказы</h1>
				</div>
				<div className='flex flex-col items-center gap-3 py-16 text-center'>
					<Package className='text-muted-foreground h-12 w-12' />
					<p className='text-foreground font-medium'>Заказов пока нет</p>
					<p className='text-muted-foreground text-sm'>Ваши заказы будут отображаться здесь</p>
				</div>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-3'>
			<div>
				<Link
					href='/account'
					className='text-muted-foreground hover:text-foreground mb-1 flex items-center gap-1 text-sm transition-colors'
				>
					<ChevronLeft className='h-4 w-4' />
					Профиль
				</Link>
				<h1 className='text-foreground mb-2 text-2xl font-bold'>Мои заказы</h1>
			</div>
			{orders.map((order) => {
				const status = STATUS_CONFIG[order.status] ?? {
					label: order.status,
					variant: 'secondary' as const,
				}
				return (
					<Link
						key={order.id}
						href={ROUTES.ACCOUNT.ORDER(order.id)}
						className='bg-surface border-border hover:border-primary flex flex-col gap-2 rounded-2xl border p-4 transition-colors'
					>
						<div className='flex items-center justify-between'>
							<p className='text-foreground text-sm font-medium'>
								Заказ #{order.id.slice(-8).toUpperCase()}
							</p>
							<Badge variant={status.variant}>{status.label}</Badge>
						</div>
						<p className='text-muted-foreground text-xs'>
							{new Date(order.createdAt).toLocaleDateString('ru-RU', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</p>
						<p className='text-foreground text-sm font-semibold'>
							{(order.totalAmount / 100).toLocaleString('ru-RU')} {order.currency}
						</p>
					</Link>
				)
			})}
		</div>
	)
}
