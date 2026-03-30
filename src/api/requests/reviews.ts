import type { AddReplyRequest, CreateReviewRequest } from '@/api/generated'

import { api, instance } from '../instance'

export interface ReviewReply {
	id: string
	userId: string
	text: string
	createdAt: string
}

export interface Review {
	id: string
	userId: string
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
	distribution: Record<string, number>
}

export const createReview = (data: CreateReviewRequest) =>
	instance.post<Review>('/reviews', data).then((r) => r.data)

export const getProductReviews = (productId: string) =>
	api.get<Review[]>(`/products/${productId}/reviews`).then((r) => r.data)

export const getProductRating = (productId: string) =>
	api.get<RatingStats>(`/products/${productId}/rating`).then((r) => r.data)

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
