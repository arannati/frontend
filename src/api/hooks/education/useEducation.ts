'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
	createContent,
	deleteContent,
	getAllContent,
	getContentById,
	getMyContent,
	getPublicContent,
	publishContent,
	updateContent,
} from '@/api/requests/education'
import type { ContentType } from '@/api/requests/education'
import { queryKeys } from '@/constants/query-keys'

export function usePublicEducation(params?: { type?: string; limit?: number; offset?: number }) {
	return useQuery({
		queryKey: queryKeys.education.all(params),
		queryFn: () => getPublicContent(params ? { type: params.type ?? '' } : undefined),
	})
}

export function useMyEducation() {
	return useQuery({
		queryKey: [...queryKeys.education.all(), 'my'],
		queryFn: getMyContent,
	})
}

export function useEducationContent(id: string) {
	return useQuery({
		queryKey: queryKeys.education.detail(id),
		queryFn: () => getContentById(id),
		enabled: !!id,
	})
}

// Admin
export function useAllEducation(params?: { type?: ContentType; limit?: number; offset?: number }) {
	return useQuery({
		queryKey: [...queryKeys.education.all(params), 'admin'],
		queryFn: () => getAllContent(params),
	})
}

export function useCreateContent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createContent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.education.all() })
		},
	})
}

export function useUpdateContent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateContent>[1] }) =>
			updateContent(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.education.all() })
			queryClient.invalidateQueries({ queryKey: queryKeys.education.detail(id) })
		},
	})
}

export function useDeleteContent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteContent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.education.all() })
		},
	})
}

export function usePublishContent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, publish }: { id: string; publish: boolean }) => publishContent(id, publish),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.education.all() })
			queryClient.invalidateQueries({ queryKey: queryKeys.education.detail(id) })
		},
	})
}
