'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createProduct, deleteProduct, updateProduct } from '@/api/requests/products'
import { queryKeys } from '@/constants/query-keys'

export function useCreateProduct() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createProduct,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
	})
}

export function useUpdateProduct() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateProduct>[1] }) =>
			updateProduct(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
	})
}

export function useDeleteProduct() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
	})
}
