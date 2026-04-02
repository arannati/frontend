import type { SavePaymentMethodRequest } from '@/api/generated'

import { instance } from '../instance'

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
export type PaymentMethodType = 'CARD' | 'WALLET'

export interface Payment {
	id: string
	orderId: string
	userId: string
	amount: number
	currency: string
	status: PaymentStatus
	provider: string
	paymentUrl?: string
	createdAt: string
}

export interface PaymentMethod {
	id: string
	userId: string
	type: PaymentMethodType
	last4?: string
	expiryDate?: string
	isDefault: boolean
}

export interface CreatePaymentRequest {
	orderId: string
	amount: number
	currency: string
	methodId?: string
}

export const createPayment = (data: CreatePaymentRequest) =>
	instance.post<Payment>('/payments', data).then((r) => r.data)

export const getPayment = (id: string) =>
	instance.get<Payment>(`/payments/${id}`).then((r) => r.data)

export const getMyPayments = () => instance.get<Payment[]>('/payments').then((r) => r.data)

export const savePaymentMethod = (data: SavePaymentMethodRequest) =>
	instance.post<PaymentMethod>('/payment-methods', data).then((r) => r.data)

export const getPaymentMethods = () =>
	instance.get<PaymentMethod[]>('/payment-methods').then((r) => r.data)

export const setDefaultPaymentMethod = (id: string) =>
	instance.patch<PaymentMethod>(`/payment-methods/${id}/default`).then((r) => r.data)

export const deletePaymentMethod = (id: string) =>
	instance.delete<void>(`/payment-methods/${id}`).then((r) => r.data)
