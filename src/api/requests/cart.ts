import type { AddCartItemRequest } from '@/api/generated'

import { instance } from '../instance'

export interface CartItem {
	productId: string
	quantity: number
}

export interface Cart {
	userId: string
	items: CartItem[]
}

export const getCart = () => instance.get<Cart>('/cart').then((r) => r.data)

export const addCartItem = (data: AddCartItemRequest) =>
	instance.post<Cart>('/cart/items', data).then((r) => r.data)

export const removeCartItem = (productId: string) =>
	instance.delete<Cart>(`/cart/items/${productId}`).then((r) => r.data)

export const clearCart = () => instance.delete<void>('/cart').then((r) => r.data)
