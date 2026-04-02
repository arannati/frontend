'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	type Category,
	createCategory,
	deleteCategory,
	updateCategory,
} from '@/api/requests/categories'
import { queryKeys } from '@/constants/query-keys'

export function useCreateCategory() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createCategory,
		onSuccess: (newCategory) => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (old) => [
				...(old ?? []),
				newCategory,
			])
		},
	})
}

export function useUpdateCategory() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateCategory>[1] }) =>
			updateCategory(id, data),
		onSuccess: (updatedCategoryData, { id, data }) => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (old) => {
				if (!old) return old
				return old.map((c) => (c.id === id ? { ...c, ...updatedCategoryData } : c))
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all, exact: false })
		},
	})
}

export function useDeleteCategory() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteCategory,
		onSuccess: (_, deletedId) => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (old) => {
				if (!old) return old
				return old.filter((c) => c.id !== deletedId)
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all, exact: false })
		},
	})
}
