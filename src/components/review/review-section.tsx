'use client'

import { useState } from 'react'

import { CheckCircle, MessageSquare, ShieldCheck, Star, ThumbsUp, Trash2 } from 'lucide-react'

import {
	useAddReply,
	useCreateReview,
	useDeleteReply,
	useDeleteReview,
	useLikeReview,
	useProductRating,
	useProductReviews,
	useUnlikeReview,
} from '@/api/hooks/reviews/useReviews'
import type { UserRole } from '@/api/requests/reviews'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { translateError } from '@/lib/utils/error-map'

function RoleBadge({ role }: { role?: UserRole }) {
	if (role === 'ADMIN') {
		return (
			<span className='text-primary inline-flex items-center gap-1 text-xs font-semibold'>
				<ShieldCheck className='h-3 w-3' />
				Администратор
			</span>
		)
	}
	if (role === 'COSMETOLOGIST') {
		return (
			<span className='inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
				<ShieldCheck className='h-3 w-3' />
				Косметолог
			</span>
		)
	}
	return null
}

// Поддерживает дробные значения (0.5 шаг), только display-режим
function StarDisplay({ value }: { value: number }) {
	return (
		<div className='flex gap-0.5'>
			{[1, 2, 3, 4, 5].map((star) => {
				const filled = value >= star
				const half = !filled && value >= star - 0.5
				return (
					<span key={star} className='relative h-5 w-5'>
						{/* Empty star (base) */}
						<Star className='text-muted-foreground absolute inset-0 h-5 w-5' />
						{/* Full or half fill */}
						{(filled || half) && (
							<span
								className='absolute inset-0 overflow-hidden'
								style={{ width: filled ? '100%' : '50%' }}
							>
								<Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
							</span>
						)}
					</span>
				)
			})}
		</div>
	)
}

// Интерактивные звёзды для формы (только целые)
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
	const [hovered, setHovered] = useState(0)

	return (
		<div className='flex gap-0.5'>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type='button'
					onClick={() => onChange(star)}
					onMouseEnter={() => setHovered(star)}
					onMouseLeave={() => setHovered(0)}
					className='cursor-pointer'
				>
					<Star
						className={`h-5 w-5 transition-colors ${
							star <= (hovered || value)
								? 'fill-yellow-400 text-yellow-400'
								: 'text-muted-foreground'
						}`}
					/>
				</button>
			))}
		</div>
	)
}

function ReviewForm({ productId }: { productId: string }) {
	const [rating, setRating] = useState(0)
	const [text, setText] = useState('')
	const createReview = useCreateReview()

	if (createReview.isSuccess) {
		return (
			<div className='bg-surface border-border flex items-center gap-3 rounded-2xl border p-5'>
				<CheckCircle className='text-primary h-5 w-5 shrink-0' />
				<p className='text-foreground text-sm font-medium'>Спасибо за ваш отзыв!</p>
			</div>
		)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!rating || !text.trim()) return
		createReview.mutate({ productId, rating, text })
	}

	return (
		<form onSubmit={handleSubmit} className='bg-surface border-border rounded-2xl border p-5'>
			<p className='text-foreground mb-4 text-sm font-medium'>Написать отзыв</p>

			<div className='mb-3'>
				<p className='text-muted-foreground mb-1.5 text-xs'>Оценка</p>
				<StarPicker value={rating} onChange={setRating} />
			</div>

			<Textarea
				placeholder='Поделитесь впечатлением о товаре'
				value={text}
				onChange={(e) => setText(e.target.value)}
				rows={3}
				className='mb-3'
			/>

			{createReview.error && (
				<p className='mb-3 text-sm text-red-500'>
					{translateError((createReview.error as any)?.response?.data?.message)}
				</p>
			)}

			<Button
				type='submit'
				loading={createReview.isPending}
				disabled={!rating || !text.trim()}
				size='sm'
			>
				Отправить
			</Button>
		</form>
	)
}

interface ReviewSectionProps {
	productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
	const { isAuthenticated, account, isAdmin } = useAuth()
	const { data: reviews, isLoading: reviewsLoading } = useProductReviews(productId)
	const { data: rating } = useProductRating(productId)
	const deleteReview = useDeleteReview(productId)
	const likeReview = useLikeReview(productId)
	const unlikeReview = useUnlikeReview(productId)
	const addReply = useAddReply(productId)
	const deleteReply = useDeleteReply(productId)

	const [replyingTo, setReplyingTo] = useState<string | null>(null)
	const [replyText, setReplyText] = useState('')

	const alreadyReviewed = reviews?.some((r) => r.userId === account?.id)

	const handleReply = (reviewId: string) => {
		if (!replyText.trim()) return
		addReply.mutate(
			{ reviewId, text: replyText },
			{
				onSuccess: () => {
					setReplyingTo(null)
					setReplyText('')
				},
			},
		)
	}

	return (
		<div className='flex flex-col gap-5'>
			{/* Rating summary */}
			{rating && rating.total > 0 && (
				<div className='flex items-center gap-3'>
					<p className='text-foreground text-4xl font-bold'>{rating.average.toFixed(1)}</p>
					<div>
						<StarDisplay value={rating.average} />
						<p className='text-muted-foreground mt-1 text-xs'>
							{rating.total}{' '}
							{rating.total === 1 ? 'отзыв' : rating.total < 5 ? 'отзыва' : 'отзывов'}
						</p>
					</div>
				</div>
			)}

			{/* Write review */}
			{isAuthenticated && !alreadyReviewed && <ReviewForm productId={productId} />}

			{/* Reviews list */}
			{reviewsLoading && (
				<div className='flex flex-col gap-3'>
					{[1, 2].map((i) => (
						<Skeleton key={i} className='h-24 rounded-2xl' />
					))}
				</div>
			)}

			{!reviewsLoading && reviews && reviews.length > 0 && (
				<div className='flex flex-col gap-3'>
					{reviews.map((review) => (
						<div key={review.id} className='bg-surface border-border rounded-2xl border p-4'>
							<div className='mb-2 flex items-start justify-between gap-2'>
								<div>
									<StarDisplay value={review.rating} />
									<div className='mt-1 flex items-center gap-2'>
										<p className='text-muted-foreground text-xs'>
											{new Date(review.createdAt).toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'long',
												year: 'numeric',
											})}
										</p>
										<RoleBadge role={review.role} />
									</div>
								</div>
								<div className='flex items-center gap-1'>
									<button
										type='button'
										onClick={() =>
											review.likedByMe
												? unlikeReview.mutate(review.id)
												: likeReview.mutate(review.id)
										}
										className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors ${
											review.likedByMe
												? 'text-primary'
												: 'text-muted-foreground hover:text-foreground'
										}`}
									>
										<ThumbsUp className='h-3.5 w-3.5' />
										{review.likeCount > 0 && review.likeCount}
									</button>
									{isAdmin && (
										<button
											type='button'
											onClick={() => {
												setReplyingTo(replyingTo === review.id ? null : review.id)
												setReplyText('')
											}}
											className='text-muted-foreground hover:text-primary rounded-full p-1 transition-colors'
											title='Ответить'
										>
											<MessageSquare className='h-3.5 w-3.5' />
										</button>
									)}
									{(account?.id === review.userId || isAdmin) && (
										<button
											type='button'
											onClick={() => deleteReview.mutate(review.id)}
											className='text-muted-foreground rounded-full p-1 transition-colors hover:text-red-500'
											title='Удалить отзыв'
										>
											<Trash2 className='h-3.5 w-3.5' />
										</button>
									)}
								</div>
							</div>
							<p className='text-foreground text-sm leading-relaxed'>{review.text}</p>

							{review.replies.length > 0 && (
								<div className='border-border mt-3 flex flex-col gap-2 border-t pt-3'>
									{review.replies.map((reply) => {
										const hasRoleBadge = reply.role === 'ADMIN' || reply.role === 'COSMETOLOGIST'
										return (
											<div
												key={reply.id}
												className={
													hasRoleBadge
														? 'bg-primary/5 border-primary/20 rounded-xl border px-3 py-2.5'
														: 'bg-muted rounded-xl px-3 py-2.5'
												}
											>
												<div className='mb-1 flex items-center justify-between gap-2'>
													<RoleBadge role={reply.role} />
													{isAdmin && (
														<button
															type='button'
															onClick={() =>
																deleteReply.mutate({ reviewId: review.id, replyId: reply.id })
															}
															className='text-muted-foreground shrink-0 rounded-full p-0.5 transition-colors hover:text-red-500'
														>
															<Trash2 className='h-3 w-3' />
														</button>
													)}
												</div>
												<p className='text-foreground text-xs leading-relaxed'>{reply.text}</p>
												<p className='text-muted-foreground mt-1 text-xs'>
													{new Date(reply.createdAt).toLocaleDateString('ru-RU')}
												</p>
											</div>
										)
									})}
								</div>
							)}

							{replyingTo === review.id && (
								<div className='mt-3 flex flex-col gap-2'>
									<Textarea
										placeholder='Ответ администратора...'
										value={replyText}
										onChange={(e) => setReplyText(e.target.value)}
										rows={2}
										autoFocus
									/>
									<div className='flex gap-2'>
										<Button
											size='sm'
											loading={addReply.isPending}
											disabled={!replyText.trim()}
											onClick={() => handleReply(review.id)}
										>
											Отправить
										</Button>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => {
												setReplyingTo(null)
												setReplyText('')
											}}
										>
											Отмена
										</Button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{!reviewsLoading && (!reviews || reviews.length === 0) && (
				<p className='text-muted-foreground text-sm'>Отзывов пока нет. Будьте первым!</p>
			)}
		</div>
	)
}
