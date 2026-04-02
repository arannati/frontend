'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
	adminCancelOrder,
	confirmOrder,
	deliverOrder,
	getAllOrders,
	removeOrderItem,
	shipOrder,
	updateOrderItemQuantity,
} from '@/api/requests/orders'
import type { OrderStatus } from '@/api/requests/orders'
import { queryKeys } from '@/constants/query-keys'

export function useAdminOrders(params?: { status?: OrderStatus; limit?: number; offset?: number }) {
	return useQuery({
		queryKey: queryKeys.orders.adminAll(params ?? {}),
		queryFn: () => getAllOrders(params),
	})
}

export function useConfirmOrder() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: confirmOrder,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.id) })
		},
	})
}

export function useShipOrder() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: shipOrder,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.id) })
		},
	})
}

export function useDeliverOrder() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deliverOrder,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.id) })
		},
	})
}

export function useAdminCancelOrder() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: adminCancelOrder,
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
		},
	})
}

export function useRemoveOrderItem() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: removeOrderItem,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.id) })
		},
	})
}

export function useUpdateOrderItemQuantity() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateOrderItemQuantity,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.id) })
		},
	})
}
