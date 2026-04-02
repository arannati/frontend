import type { AddReplyRequest, CreateReviewRequest } from '@/api/generated'

import { api, instance } from '../instance'

export type UserRole = 'USER' | 'ADMIN' | 'COSMETOLOGIST'

export interface ReviewReply {
	id: string
	userId: string
	role?: UserRole
	text: string
	createdAt: string
}

export interface Review {
	id: string
	userId: string
	role?: UserRole
	productId: string
	rating: number
	text: string
	likeCount: number
	likedByMe: boolean
	replies: ReviewReply[]
	createdAt: string
}

export interface RatingStats {
	average: number
	total: number
}

export const createReview = (data: CreateReviewRequest) =>
	instance.post<Review>('/reviews', data).then((r) => r.data)

export const getProductReviews = (productId: string) =>
	api.get<{ reviews: Review[]; totalCount: number }>(`/reviews/products/${productId}`).then((r) =>
		(r.data.reviews ?? []).map((review) => ({
			...review,
			replies: review.replies ?? [],
		})),
	)

export const getProductRating = (productId: string) =>
	api
		.get<{ averageRating: number; totalReviews: number }>(`/reviews/products/${productId}/rating`)
		.then(
			(r) =>
				({
					average: r.data.averageRating,
					total: r.data.totalReviews,
				}) satisfies RatingStats,
		)

export const deleteReview = (id: string) =>
	instance.delete<void>(`/reviews/${id}`).then((r) => r.data)

export const addReply = (reviewId: string, data: AddReplyRequest) =>
	instance.post<Review>(`/reviews/${reviewId}/replies`, data).then((r) => r.data)

export const deleteReply = (reviewId: string, replyId: string) =>
	instance.delete<void>(`/reviews/${reviewId}/replies/${replyId}`).then((r) => r.data)

export const likeReview = (id: string) =>
	instance.post<void>(`/reviews/${id}/like`).then((r) => r.data)

export const unlikeReview = (id: string) =>
	instance.delete<void>(`/reviews/${id}/like`).then((r) => r.data)
