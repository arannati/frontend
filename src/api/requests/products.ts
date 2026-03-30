import type {
	CreateProductRequest,
	ProductControllerGetAllParams,
	UpdateProductRequest,
} from '@/api/generated'

import { api, instance } from '../instance'

export interface Product {
	id: string
	name: string
	slug: string
	summary: string
	description: string
	images: string[]
	price: number
	discountAmount?: number
	currency: string
	countryOfOrigin: string
	brandId: string
	brand?: Brand
	categories?: Category[]
	createdAt: string
	updatedAt: string
}

export interface Brand {
	id: string
	title: string
	slug: string
}

export interface Category {
	id: string
	title: string
	slug: string
}

export interface ProductsResponse {
	items: Product[]
	total: number
}

export const getProducts = (params?: ProductControllerGetAllParams) =>
	api.get<ProductsResponse>('/products', { params }).then((r) => r.data)

export const getProductBySlug = (slug: string) =>
	api.get<Product>(`/products/${slug}`).then((r) => r.data)

export const createProduct = (data: CreateProductRequest) =>
	instance.post<Product>('/products', data).then((r) => r.data)

export const updateProduct = (id: string, data: UpdateProductRequest) =>
	instance.patch<Product>(`/products/${id}`, data).then((r) => r.data)

export const deleteProduct = (id: string) =>
	instance.delete<void>(`/products/${id}`).then((r) => r.data)
