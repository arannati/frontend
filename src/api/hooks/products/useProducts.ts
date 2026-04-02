import { useQuery } from '@tanstack/react-query'

import type { ProductControllerGetAllParams } from '@/api/generated'
import { getProductBySlug, getProducts } from '@/api/requests/products'
import { queryKeys } from '@/constants/query-keys'

export function useProducts(params?: ProductControllerGetAllParams) {
	return useQuery({
		queryKey: queryKeys.products.list(params ?? {}),
		queryFn: () => getProducts(params),
	})
}

export function useProduct(slug: string) {
	return useQuery({
		queryKey: queryKeys.products.detail(slug),
		queryFn: () => getProductBySlug(slug),
		enabled: !!slug,
	})
}
