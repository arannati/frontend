'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { addCartItem, clearCart, getCart, removeCartItem } from '@/api/requests/cart'
import { queryKeys } from '@/constants/query-keys'

export function useCart() {
	return useQuery({
		queryKey: queryKeys.cart,
		queryFn: getCart,
		retry: false,
	})
}

export function useAddToCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: addCartItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cart })
		},
	})
}

export function useRemoveFromCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: removeCartItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cart })
		},
	})
}

export function useDecrementCartItem() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ productId, currentQty }: { productId: string; currentQty: number }) => {
			await removeCartItem(productId)
			if (currentQty > 1) {
				await addCartItem({ productId, quantity: currentQty - 1 })
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cart })
		},
	})
}

export function useClearCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: clearCart,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cart })
		},
	})
}
