'use client'

import { use } from 'react'

import Link from 'next/link'

import { ArrowLeft, Package } from 'lucide-react'

import { useCancelOrder, useOrder } from '@/api/hooks/orders/useOrders'
import type { OrderStatus } from '@/api/requests/orders'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { formatPrice } from '@/lib/utils/format-price'

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

interface Props {
	params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: Props) {
	const { id } = use(params)
	const { data: order, isLoading } = useOrder(id)
	const cancelOrder = useCancelOrder()

	if (isLoading) {
		return (
			<div className='flex flex-col gap-4'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-4 w-32' />
				<Skeleton className='h-24 w-full rounded-2xl' />
				<Skeleton className='h-32 w-full rounded-2xl' />
			</div>
		)
	}

	if (!order) {
		return (
			<div className='flex flex-col items-center gap-3 py-16 text-center'>
				<Package className='text-muted-foreground h-12 w-12' />
				<p className='text-foreground font-medium'>Заказ не найден</p>
				<Link href={ROUTES.ACCOUNT.ORDERS}>
					<Button variant='secondary' size='sm'>
						← К заказам
					</Button>
				</Link>
			</div>
		)
	}

	const status = STATUS_CONFIG[order.status] ?? {
		label: order.status,
		variant: 'secondary' as const,
	}

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex items-center gap-3'>
				<Link
					href={ROUTES.ACCOUNT.ORDERS}
					className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors'
				>
					<ArrowLeft className='h-4 w-4' />
					Назад
				</Link>
			</div>

			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-foreground text-xl font-bold'>
						Заказ #{order.id.slice(-8).toUpperCase()}
					</h1>
					<p className='text-muted-foreground text-sm'>
						{new Date(order.createdAt).toLocaleDateString('ru-RU', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						})}
					</p>
				</div>
				<Badge variant={status.variant}>{status.label}</Badge>
			</div>

			{/* Items */}
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<p className='text-foreground mb-3 text-sm font-medium'>Товары</p>
				<div className='flex flex-col gap-3'>
					{(order.items ?? []).map((item) => (
						<div key={item.id} className='flex items-center justify-between gap-4'>
							<div className='min-w-0'>
								<Link
									href={ROUTES.PRODUCTS.SINGLE(item.productSlug)}
									className='text-foreground hover:text-primary text-sm font-medium transition-colors'
								>
									{item.productName}
								</Link>
								<p className='text-muted-foreground text-xs'>× {item.quantity}</p>
							</div>
							<p className='text-foreground shrink-0 text-sm font-semibold'>
								{formatPrice(item.price * item.quantity, item.currency)}
							</p>
						</div>
					))}
				</div>
				<div className='border-border mt-4 flex items-center justify-between border-t pt-4'>
					<p className='text-foreground text-sm font-medium'>Итого</p>
					<p className='text-foreground text-base font-bold'>
						{formatPrice(order.totalAmount, order.currency)}
					</p>
				</div>
			</div>

			{/* Shipping */}
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<p className='text-foreground mb-2 text-sm font-medium'>Адрес доставки</p>
				<p className='text-muted-foreground text-sm'>{order.shippingAddress}</p>
			</div>

			{/* Actions */}
			{order.status === 'PENDING' && (
				<Button
					variant='destructive'
					onClick={() => cancelOrder.mutate(order.id)}
					loading={cancelOrder.isPending}
				>
					Отменить заказ
				</Button>
			)}
		</div>
	)
}
