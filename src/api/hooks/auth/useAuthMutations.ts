'use client'

import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { resetRefreshState } from '@/api/instance'
import { finalizeTelegram, initTelegram, logout, sendOtp, verifyOtp } from '@/api/requests/auth'
import { queryKeys } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { deleteCookie, setCookie } from '@/lib/cookies'

export function useSendOtp() {
	return useMutation({ mutationFn: sendOtp })
}

export function useVerifyOtp() {
	const router = useRouter()

	return useMutation({
		mutationFn: verifyOtp,
		onSuccess: (data) => {
			resetRefreshState()
			setCookie('accessToken', data.accessToken)
			router.push(ROUTES.ACCOUNT.ROOT)
		},
	})
}

export function useLogout() {
	const router = useRouter()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: logout,
		onSettled: () => {
			deleteCookie('accessToken')
			queryClient.clear()
			router.push(ROUTES.HOME)
		},
	})
}

export function useInitTelegram() {
	return useMutation({
		mutationFn: initTelegram,
		onSuccess: (data) => {
			window.location.href = data.url
		},
	})
}

export function useFinalizeTelegram() {
	const router = useRouter()

	return useMutation({
		mutationFn: finalizeTelegram,
		onSuccess: (data) => {
			resetRefreshState()
			setCookie('accessToken', data.accessToken)
			router.push(ROUTES.ACCOUNT.ROOT)
		},
	})
}
