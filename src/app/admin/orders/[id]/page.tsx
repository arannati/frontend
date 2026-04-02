'use client'

import { use } from 'react'

import Link from 'next/link'

import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'

import {
	useAdminCancelOrder,
	useConfirmOrder,
	useDeliverOrder,
	useRemoveOrderItem,
	useShipOrder,
	useUpdateOrderItemQuantity,
} from '@/api/hooks/orders/useAdminOrders'
import { useOrder } from '@/api/hooks/orders/useOrders'
import type { OrderStatus } from '@/api/requests/orders'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { formatPrice } from '@/lib/utils/format-price'

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

interface Props {
	params: Promise<{ id: string }>
}

export default function AdminOrderDetailPage({ params }: Props) {
	const { id } = use(params)
	const { data: order, isLoading } = useOrder(id)
	const confirm = useConfirmOrder()
	const ship = useShipOrder()
	const deliver = useDeliverOrder()
	const cancel = useAdminCancelOrder()
	const removeItem = useRemoveOrderItem()
	const updateQuantity = useUpdateOrderItemQuantity()

	if (isLoading) {
		return (
			<div className='flex flex-col gap-4'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-32 w-full rounded-2xl' />
				<Skeleton className='h-24 w-full rounded-2xl' />
			</div>
		)
	}

	if (!order) {
		return (
			<div className='flex flex-col items-center gap-3 py-16 text-center'>
				<p className='text-foreground font-medium'>Заказ не найден</p>
				<Link href={ROUTES.ADMIN.ORDERS}>
					<Button variant='secondary' size='sm'>
						← К заказам
					</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex items-center gap-3'>
				<Link
					href={ROUTES.ADMIN.ORDERS}
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
					<p className='text-muted-foreground mt-1 text-xs'>
						Пользователь:{' '}
						{order.user?.email || order.user?.phone || order.user?.name || order.userId}
					</p>
				</div>
				<span
					className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[order.status]}`}
				>
					{STATUS_LABEL[order.status]}
				</span>
			</div>

			{/* Items */}
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<p className='text-foreground mb-3 text-sm font-medium'>Товары</p>
				<div className='flex flex-col gap-3'>
					{(order.items ?? []).map((item) => (
						<div key={item.id} className='flex items-center justify-between gap-4'>
							<div className='min-w-0 flex-1'>
								<p className='text-foreground text-sm font-medium'>{item.productName}</p>
								<div className='mt-1 flex items-center gap-2'>
									{order.status === 'PAID' ? (
										<div className='border-border flex w-fit items-center rounded-md border'>
											<Button
												variant='ghost'
												size='icon'
												className='border-border hover:bg-muted/50 h-6 w-6 rounded-none border-r'
												disabled={updateQuantity.isPending}
												onClick={() =>
													updateQuantity.mutate({
														orderId: order.id,
														productId: item.productId,
														quantity: item.quantity - 1,
													})
												}
											>
												<Minus className='h-3 w-3' />
											</Button>
											<span className='min-w-[2rem] px-3 text-center text-xs font-medium'>
												{item.quantity}
											</span>
											<Button
												variant='ghost'
												size='icon'
												className='border-border hover:bg-muted/50 h-6 w-6 rounded-none border-l'
												disabled={
													updateQuantity.isPending || item.quantity >= item.originalQuantity
												}
												onClick={() =>
													updateQuantity.mutate({
														orderId: order.id,
														productId: item.productId,
														quantity: item.quantity + 1,
													})
												}
											>
												<Plus className='h-3 w-3' />
											</Button>
										</div>
									) : (
										<p className='text-muted-foreground text-xs'>× {item.quantity}</p>
									)}
								</div>
							</div>
							<div className='flex shrink-0 items-center gap-3'>
								<p className='text-foreground text-sm font-semibold'>
									{formatPrice(item.price * item.quantity, item.currency)}
								</p>
								{order.status === 'PAID' && (
									<Button
										variant='ghost'
										size='icon'
										className='text-destructive hover:bg-destructive/10 h-8 w-8'
										onClick={() =>
											removeItem.mutate({ orderId: order.id, productId: item.productId })
										}
										loading={removeItem.isPending}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								)}
							</div>
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
			<div className='flex flex-wrap gap-2'>
				{order.status === 'PAID' && (
					<Button onClick={() => confirm.mutate(order.id)} loading={confirm.isPending}>
						Подтвердить
					</Button>
				)}
				{order.status === 'CONFIRMED' && (
					<Button onClick={() => ship.mutate(order.id)} loading={ship.isPending}>
						Отправить
					</Button>
				)}
				{order.status === 'SHIPPED' && (
					<Button onClick={() => deliver.mutate(order.id)} loading={deliver.isPending}>
						Доставлен
					</Button>
				)}
				{!['DELIVERED', 'CANCELLED'].includes(order.status) && (
					<Button
						variant='destructive'
						onClick={() => cancel.mutate(order.id)}
						loading={cancel.isPending}
					>
						Отменить
					</Button>
				)}
			</div>
		</div>
	)
}
