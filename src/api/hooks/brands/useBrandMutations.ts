'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type Brand, createBrand, deleteBrand, updateBrand } from '@/api/requests/brands'
import { queryKeys } from '@/constants/query-keys'

export function useCreateBrand() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createBrand,
		onSuccess: (newBrand) => {
			queryClient.setQueryData<Brand[]>(queryKeys.brands.all, (old) => [...(old ?? []), newBrand])
		},
	})
}

export function useUpdateBrand() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateBrand>[1] }) =>
			updateBrand(id, data),
		onSuccess: (updatedBrandData, { id, data }) => {
			queryClient.setQueryData<Brand[]>(queryKeys.brands.all, (old) => {
				if (!old) return old
				return old.map((b) => (b.id === id ? { ...b, ...updatedBrandData } : b))
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.brands.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all, exact: false })
		},
	})
}

export function useDeleteBrand() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteBrand,
		onSuccess: (_, deletedId) => {
			queryClient.setQueryData<Brand[]>(queryKeys.brands.all, (old) => {
				if (!old) return old
				return old.filter((b) => b.id !== deletedId)
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.brands.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all, exact: false })
		},
	})
}
