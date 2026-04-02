import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
	confirmEmailChange,
	confirmPhoneChange,
	getMe,
	getRoleUpgradeStatus,
	initEmailChange,
	initPhoneChange,
	requestRoleUpgrade,
	updateUser,
	uploadAvatar,
} from '@/api/requests/user'
import { queryKeys } from '@/constants/query-keys'

export function useMe() {
	return useQuery({
		queryKey: queryKeys.me,
		queryFn: getMe,
		retry: false,
	})
}

export function useUpdateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.account })
			queryClient.invalidateQueries({ queryKey: queryKeys.me })
		},
	})
}

export function useUploadAvatar() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (file: File) => uploadAvatar(file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.account })
			queryClient.invalidateQueries({ queryKey: queryKeys.me })
		},
	})
}

export function useInitEmailChange() {
	return useMutation({ mutationFn: initEmailChange })
}

export function useConfirmEmailChange() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: confirmEmailChange,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.me })
		},
	})
}

export function useInitPhoneChange() {
	return useMutation({ mutationFn: initPhoneChange })
}

export function useConfirmPhoneChange() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: confirmPhoneChange,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.me })
		},
	})
}

export function useRoleUpgradeStatus() {
	return useQuery({
		queryKey: queryKeys.roleUpgrade,
		queryFn: getRoleUpgradeStatus,
		retry: false,
	})
}

export function useRequestRoleUpgrade() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: requestRoleUpgrade,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.roleUpgrade })
		},
	})
}
