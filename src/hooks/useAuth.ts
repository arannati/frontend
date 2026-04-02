'use client'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { getAccount } from '@/api/requests/user'
import { queryKeys } from '@/constants/query-keys'
import { getCookie } from '@/lib/cookies'

export function useAuth() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const hasToken = mounted ? !!getCookie('accessToken') : false

	const { data: account, isLoading } = useQuery({
		queryKey: queryKeys.account,
		queryFn: getAccount,
		enabled: hasToken,
		retry: false,
		staleTime: 30_000,
		refetchOnWindowFocus: true,
	})

	return {
		account,
		// До монтирования считаем loading=true, чтобы не было ложного редиректа
		isLoading: !mounted || (hasToken && isLoading),
		isAuthenticated: !!account,
		isAdmin: account?.role === 'ADMIN',
		isCosmetologist: account?.role === 'COSMETOLOGIST' || account?.role === 'ADMIN',
	}
}
