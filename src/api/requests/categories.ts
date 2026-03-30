import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/api/generated'

import { api, instance } from '../instance'

export interface Category {
	id: string
	title: string
	slug: string
	createdAt: string
	updatedAt: string
}

export const getCategories = () => api.get<Category[]>('/categories').then((r) => r.data)

export const getCategoryBySlug = (slug: string) =>
	api.get<Category>(`/categories/${slug}`).then((r) => r.data)

export const createCategory = (data: CreateCategoryRequest) =>
	instance.post<Category>('/categories', data).then((r) => r.data)

export const updateCategory = (id: string, data: UpdateCategoryRequest) =>
	instance.patch<Category>(`/categories/${id}`, data).then((r) => r.data)

export const deleteCategory = (id: string) =>
	instance.delete<void>(`/categories/${id}`).then((r) => r.data)
