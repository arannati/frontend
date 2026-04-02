'use client'

import { useState } from 'react'

import Link from 'next/link'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp } from 'lucide-react'

import {
	useAdminCancelOrder,
	useAdminOrders,
	useConfirmOrder,
	useDeliverOrder,
	useShipOrder,
} from '@/api/hooks/orders/useAdminOrders'
import { getOrder } from '@/api/requests/orders'
import type { OrderStatus } from '@/api/requests/orders'
import type { Order } from '@/api/requests/orders'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { formatPrice } from '@/lib/utils/format-price'

const STATUS_OPTIONS: { value: string; label: string }[] = [
	{ value: '', label: 'Все статусы' },
	{ value: 'PENDING', label: 'Ожидает оплаты' },
	{ value: 'PAID', label: 'Оплачен' },
	{ value: 'CONFIRMED', label: 'Подтверждён' },
	{ value: 'SHIPPED', label: 'В доставке' },
	{ value: 'DELIVERED', label: 'Доставлен' },
	{ value: 'CANCELLED', label: 'Отменён' },
]

const STATUS_BADGE: Record<OrderStatus, string> = {
	PENDING: 'bg-yellow-100 text-yellow-800',
	PAID: 'bg-blue-100 text-blue-800',
	CONFIRMED: 'bg-indigo-100 text-indigo-800',
	SHIPPED: 'bg-purple-100 text-purple-800',
	DELIVERED: 'bg-green-100 text-green-800',
	CANCELLED: 'bg-red-100 text-red-800',
}

const STATUS_LABEL: Record<OrderStatus, string> = {
	PENDING: 'Ожидает оплаты',
	PAID: 'Оплачен',
	CONFIRMED: 'Подтверждён',
	SHIPPED: 'В доставке',
	DELIVERED: 'Доставлен',
	CANCELLED: 'Отменён',
}

function OrderRow({ order }: { order: Order }) {
	const [expanded, setExpanded] = useState(false)
	const confirm = useConfirmOrder()
	const ship = useShipOrder()
	const deliver = useDeliverOrder()
	const cancel = useAdminCancelOrder()

	const { data: details, isLoading: detailsLoading } = useQuery({
		queryKey: ['orders', 'detail', order.id],
		queryFn: () => getOrder(order.id),
		enabled: expanded,
		staleTime: 30_000,
	})

	return (
		<div className='border-border border-b last:border-0'>
			<div
				className='hover:bg-muted/30 grid cursor-pointer grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3'
				onClick={() => setExpanded((v) => !v)}
			>
				<div>
					<p className='text-foreground text-sm font-medium'>
						#{order.id.slice(0, 8).toUpperCase()}
					</p>
					<p className='text-muted-foreground text-xs'>
						{new Date(order.createdAt).toLocaleDateString('ru-RU')}
					</p>
				</div>
				<span
					className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[order.status]}`}
				>
					{STATUS_LABEL[order.status]}
				</span>
				<span className='text-foreground text-sm font-medium'>
					{formatPrice(order.totalAmount, order.currency)}
				</span>
				{expanded ? (
					<ChevronUp className='text-muted-foreground h-4 w-4' />
				) : (
					<ChevronDown className='text-muted-foreground h-4 w-4' />
				)}
			</div>

			{expanded && (
				<div className='bg-muted/20 px-4 pb-4'>
					{detailsLoading ? (
						<div className='mb-3 space-y-1'>
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-3/4' />
						</div>
					) : (
						<>
							{/* Items */}
							<div className='mb-3 space-y-1'>
								{(details?.items ?? []).map((item) => (
									<div key={item.id} className='flex justify-between text-sm'>
										<span className='text-foreground'>
											{item.productName} × {item.quantity}
										</span>
										<span className='text-muted-foreground'>
											{formatPrice(item.price * item.quantity, item.currency)}
										</span>
									</div>
								))}
							</div>

							{/* Address */}
							<p className='text-muted-foreground mb-1 text-xs'>
								Пользователь:{' '}
								{details?.user?.email ||
									details?.user?.phone ||
									details?.user?.name ||
									order.userId}
							</p>
							<p className='text-muted-foreground mb-1 text-xs'>
								Адрес: {details?.shippingAddress || '—'}
							</p>
							<p className='text-muted-foreground mb-3 text-xs'>ID: {order.id}</p>
						</>
					)}

					{/* Actions */}
					<div className='flex flex-wrap items-center gap-2'>
						{order.status === 'PAID' && (
							<Link href={`${ROUTES.ADMIN.ORDERS}/${order.id}`}>
								<Button size='sm' variant='outline'>
									Обзор и подтверждение
								</Button>
							</Link>
						)}
						{order.status === 'CONFIRMED' && (
							<Button size='sm' onClick={() => ship.mutate(order.id)} loading={ship.isPending}>
								Отправить
							</Button>
						)}
						{order.status === 'SHIPPED' && (
							<Button
								size='sm'
								onClick={() => deliver.mutate(order.id)}
								loading={deliver.isPending}
							>
								Доставлен
							</Button>
						)}
						{!['DELIVERED', 'CANCELLED'].includes(order.status) && (
							<Button
								size='sm'
								variant='destructive'
								onClick={() => cancel.mutate(order.id)}
								loading={cancel.isPending}
							>
								Отменить
							</Button>
						)}
						{order.status !== 'PAID' && (
							<Link href={`${ROUTES.ADMIN.ORDERS}/${order.id}`}>
								<Button size='sm' variant='ghost'>
									Подробнее
								</Button>
							</Link>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default function AdminOrdersPage() {
	const [statusFilter, setStatusFilter] = useState<string>('')
	const { data, isLoading } = useAdminOrders(
		statusFilter ? { status: statusFilter as OrderStatus } : undefined,
	)

	return (
		<div>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-foreground text-2xl font-bold'>Заказы</h1>
				<div className='w-48'>
					<Select
						options={STATUS_OPTIONS}
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					/>
				</div>
			</div>

			<div className='bg-surface border-border rounded-2xl border'>
				{isLoading &&
					Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className='border-border flex gap-4 border-b px-4 py-3 last:border-0'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-4 w-20' />
							<Skeleton className='h-4 w-16' />
						</div>
					))}

				{!isLoading && (!data?.items || data.items.length === 0) && (
					<p className='text-muted-foreground px-4 py-8 text-center text-sm'>Заказов нет</p>
				)}

				{data?.items?.map((order) => (
					<OrderRow key={order.id} order={order} />
				))}
			</div>

			{data && data.total > 0 && (
				<p className='text-muted-foreground mt-3 text-right text-sm'>Всего: {data.total}</p>
			)}
		</div>
	)
}
