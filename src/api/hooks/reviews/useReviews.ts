'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
	addReply,
	createReview,
	deleteReply,
	deleteReview,
	getProductRating,
	getProductReviews,
	likeReview,
	unlikeReview,
} from '@/api/requests/reviews'
import { queryKeys } from '@/constants/query-keys'

export function useProductReviews(productId: string) {
	return useQuery({
		queryKey: queryKeys.reviews.product(productId),
		queryFn: () => getProductReviews(productId),
		enabled: !!productId,
	})
}

export function useProductRating(productId: string) {
	return useQuery({
		queryKey: queryKeys.reviews.rating(productId),
		queryFn: () => getProductRating(productId),
		enabled: !!productId,
	})
}

export function useCreateReview() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createReview,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(variables.productId) })
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews.rating(variables.productId) })
		},
	})
}

export function useDeleteReview(productId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteReview,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) })
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews.rating(productId) })
		},
	})
}

export function useLikeReview(productId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => likeReview(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) })
		},
	})
}

export function useUnlikeReview(productId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => unlikeReview(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) })
		},
	})
}

export function useAddReply(productId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ reviewId, text }: { reviewId: string; text: string }) =>
			addReply(reviewId, { text }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) })
		},
	})
}

export function useDeleteReply(productId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ reviewId, replyId }: { reviewId: string; replyId: string }) =>
			deleteReply(reviewId, replyId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) })
		},
	})
}
