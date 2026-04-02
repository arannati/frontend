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
	brand?: { id: string; title: string; slug: string }
	categories?: { id: string; title: string; slug: string }[]
	createdAt: string
	updatedAt: string
}

export interface ProductsResponse {
	products: Product[]
	total?: number
}

export const getProducts = (params?: ProductControllerGetAllParams) =>
	api.get<ProductsResponse>('/products', { params: { offset: 0, ...params } }).then((r) => r.data)

export const getProductBySlug = (slug: string) =>
	api.get<{ product: Product }>(`/products/${slug}`).then((r) => r.data.product)

export const createProduct = (data: CreateProductRequest) =>
	instance.post<Product>('/products', data).then((r) => r.data)

export const updateProduct = (id: string, data: UpdateProductRequest) =>
	instance.patch<Product>(`/products/${id}`, data).then((r) => r.data)

export const deleteProduct = (id: string) =>
	instance.delete<void>(`/products/${id}`).then((r) => r.data)
