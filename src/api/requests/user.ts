import type { GetMeResponse, PatchUserRequest } from '@/api/generated'

import { instance } from '../instance'

export type UserRole = 'USER' | 'ADMIN' | 'COSMETOLOGIST'

export interface AccountInfo {
	id: string
	phone?: string
	email?: string
	isPhoneVerified: boolean
	isEmailVerified: boolean
	role: UserRole
}

export type User = GetMeResponse

export const getMe = () => instance.get<User>('/user/me').then((r) => r.data)

export const getAccount = () => instance.get<AccountInfo>('/account/me').then((r) => r.data)

export const updateUser = (data: PatchUserRequest) =>
	instance.patch<User>('/user', data).then((r) => r.data)

export const uploadAvatar = (file: File) => {
	const formData = new FormData()
	formData.append('file', file)
	return instance
		.patch<User>('/user/avatar', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		.then((r) => r.data)
}

export const requestRoleUpgrade = (document: string) =>
	instance.post<void>('/account/role-upgrade', { document }).then((r) => r.data)
