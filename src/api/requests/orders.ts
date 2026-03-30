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
	currency: string
}

export interface Order {
	id: string
	userId: string
	status: OrderStatus
	shippingAddress: string
	totalAmount: number
	currency: string
	items: OrderItem[]
	createdAt: string
	updatedAt: string
}

export interface OrdersResponse {
	items: Order[]
	total: number
}

export const createOrder = (data: CreateOrderRequest) =>
	instance.post<Order>('/orders', data).then((r) => r.data)

export const getOrder = (id: string) => instance.get<Order>(`/orders/${id}`).then((r) => r.data)

export const getMyOrders = () => instance.get<OrdersResponse>('/orders').then((r) => r.data)

export const cancelOrder = (id: string) =>
	instance.delete<void>(`/orders/${id}`).then((r) => r.data)

// Admin
export const getAllOrders = (params?: { status?: OrderStatus; limit?: number; offset?: number }) =>
	instance.get<OrdersResponse>('/admin/orders', { params }).then((r) => r.data)

export const confirmOrder = (id: string) =>
	instance.patch<Order>(`/admin/orders/${id}/confirm`).then((r) => r.data)

export const shipOrder = (id: string) =>
	instance.patch<Order>(`/admin/orders/${id}/ship`).then((r) => r.data)

export const deliverOrder = (id: string) =>
	instance.patch<Order>(`/admin/orders/${id}/deliver`).then((r) => r.data)

export const adminCancelOrder = (id: string) =>
	instance.delete<void>(`/admin/orders/${id}/cancel`).then((r) => r.data)
