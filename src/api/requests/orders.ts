import type { CreateOrderRequest } from '@/api/generated'

import { instance } from '../instance'

export type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
	id: string
	productId: string
	productName: string
	productSlug: string
	price: number
	quantity: number
	originalQuantity: number
	currency: string
}

export interface Order {
	id: string
	userId: string
	user?: { id: string; email?: string; phone?: string; name?: string }
	status: OrderStatus
	shippingAddress?: string
	totalAmount: number
	currency: string
	items?: OrderItem[]
	createdAt: string
	updatedAt?: string
}

export interface OrdersResponse {
	items: Order[]
	total: number
}

export const createOrder = (data: CreateOrderRequest) =>
	instance.post<Order>('/orders', data).then((r) => r.data)

export const getOrder = (id: string) => instance.get<Order>(`/orders/${id}`).then((r) => r.data)

export const getMyOrders = () =>
	instance
		.get<{ orders: Order[]; totalCount: number }>('/orders')
		.then((r) => ({ items: r.data.orders ?? [], total: r.data.totalCount ?? 0 }))

export const cancelOrder = (id: string) =>
	instance.delete<void>(`/orders/${id}`).then((r) => r.data)

// Admin
export const getAllOrders = (params?: { status?: OrderStatus; limit?: number; offset?: number }) =>
	instance
		.get<{ orders: Order[]; totalCount: number }>('/admin/orders', { params })
		.then((r) => ({ items: r.data.orders ?? [], total: r.data.totalCount ?? 0 }))

export const confirmOrder = (id: string) =>
	instance.post<Order>(`/admin/orders/${id}/confirm`).then((r) => r.data)

export const shipOrder = (id: string) =>
	instance.post<Order>(`/admin/orders/${id}/ship`).then((r) => r.data)

export const deliverOrder = (id: string) =>
	instance.post<Order>(`/admin/orders/${id}/deliver`).then((r) => r.data)

export const adminCancelOrder = (id: string) =>
	instance.post<void>(`/admin/orders/${id}/cancel`).then((r) => r.data)

export const removeOrderItem = ({ orderId, productId }: { orderId: string; productId: string }) =>
	instance.delete<Order>(`/admin/orders/${orderId}/items/${productId}`).then((r) => r.data)

export const updateOrderItemQuantity = ({
	orderId,
	productId,
	quantity,
}: {
	orderId: string
	productId: string
	quantity: number
}) =>
	instance
		.post<Order>(`/admin/orders/${orderId}/items/${productId}/quantity`, { quantity })
		.then((r) => r.data)
