import type { CreateBrandRequest, UpdateBrandRequest } from '@/api/generated'

import { api, instance } from '../instance'

export interface Brand {
	id: string
	title: string
	slug: string
	createdAt: string
	updatedAt: string
}

export const getBrands = () => api.get<Brand[]>('/brands').then((r) => r.data)

export const getBrandBySlug = (slug: string) =>
	api.get<Brand>(`/brands/${slug}`).then((r) => r.data)

export const createBrand = (data: CreateBrandRequest) =>
	instance.post<Brand>('/brands', data).then((r) => r.data)

export const updateBrand = (id: string, data: UpdateBrandRequest) =>
	instance.patch<Brand>(`/brands/${id}`, data).then((r) => r.data)

export const deleteBrand = (id: string) =>
	instance.delete<void>(`/brands/${id}`).then((r) => r.data)
