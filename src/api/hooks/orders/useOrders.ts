import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cancelOrder, createOrder, getMyOrders, getOrder } from '@/api/requests/orders'
import { queryKeys } from '@/constants/query-keys'

export function useMyOrders() {
	return useQuery({
		queryKey: queryKeys.orders.all,
		queryFn: getMyOrders,
	})
}

export function useOrder(id: string) {
	return useQuery({
		queryKey: queryKeys.orders.detail(id),
		queryFn: () => getOrder(id),
		enabled: !!id,
	})
}

export function useCreateOrder() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.cart })
		},
	})
}

export function useCancelOrder() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: cancelOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
		},
	})
}
