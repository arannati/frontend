import { useQuery } from '@tanstack/react-query'

import { getBrandBySlug, getBrands } from '@/api/requests/brands'
import { queryKeys } from '@/constants/query-keys'

export function useBrands() {
	return useQuery({
		queryKey: queryKeys.brands.all,
		queryFn: getBrands,
		staleTime: 5 * 60 * 1000,
	})
}

export function useBrand(slug: string) {
	return useQuery({
		queryKey: queryKeys.brands.detail(slug),
		queryFn: () => getBrandBySlug(slug),
		enabled: !!slug,
	})
}
