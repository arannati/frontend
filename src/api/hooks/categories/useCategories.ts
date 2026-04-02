import { useQuery } from '@tanstack/react-query'

import { getCategories, getCategoryBySlug } from '@/api/requests/categories'
import { queryKeys } from '@/constants/query-keys'

export function useCategories() {
	return useQuery({
		queryKey: queryKeys.categories.all,
		queryFn: getCategories,
		staleTime: 5 * 60 * 1000,
	})
}

export function useCategory(slug: string) {
	return useQuery({
		queryKey: queryKeys.categories.detail(slug),
		queryFn: () => getCategoryBySlug(slug),
		enabled: !!slug,
	})
}
