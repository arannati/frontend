import type { CreateContentRequest, EducationControllerListPublicParams } from '@/api/generated'

import { api, instance } from '../instance'

export type ContentType = 'VIDEO' | 'ARTICLE' | 'LINK'

export interface EducationContent {
	id: string
	type: ContentType
	title: string
	description?: string
	tags: string[]
	isPublished: boolean
	mediaId?: string
	durationSeconds?: number
	body?: string
	url?: string
	previewImageUrl?: string
	createdAt: string
	updatedAt: string
}

export interface EducationListResponse {
	items: EducationContent[]
	total: number
}

export const getPublicContent = (params?: EducationControllerListPublicParams) =>
	api.get<EducationListResponse>('/education/content', { params }).then((r) => r.data)

export const getMyContent = () =>
	instance.get<EducationListResponse>('/education/my-content').then((r) => r.data)

export const getContentById = (id: string) =>
	api.get<EducationContent>(`/education/content/${id}`).then((r) => r.data)

// Admin
export const getAllContent = (params?: { type?: ContentType; limit?: number; offset?: number }) =>
	instance.get<EducationListResponse>('/education/content/all', { params }).then((r) => r.data)

export const createContent = (data: CreateContentRequest) =>
	instance.post<EducationContent>('/education/content', data).then((r) => r.data)

export const updateContent = (id: string, data: Partial<CreateContentRequest>) =>
	instance.patch<EducationContent>(`/education/content/${id}`, data).then((r) => r.data)

export const publishContent = (id: string, publish: boolean) =>
	instance
		.patch<EducationContent>(`/education/content/${id}/publish`, { publish })
		.then((r) => r.data)

export const deleteContent = (id: string) =>
	instance.delete<void>(`/education/content/${id}`).then((r) => r.data)
