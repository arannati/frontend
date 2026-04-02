import type {
	ConfirmEmailChangeRequest,
	ConfirmPhoneChangeRequest,
	GetMeResponse,
	InitEmailChangeRequest,
	InitPhoneChangeRequest,
	PatchUserRequest,
	ReviewRoleUpgradeRequest,
} from '@/api/generated'

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

// gRPC proto-loader без enums:String возвращает enum как число (USER=0, ADMIN=1, COSMETOLOGIST=2)
const ROLE_MAP: Record<string | number, UserRole> = {
	0: 'USER',
	1: 'ADMIN',
	2: 'COSMETOLOGIST',
	USER: 'USER',
	ADMIN: 'ADMIN',
	COSMETOLOGIST: 'COSMETOLOGIST',
}

const normalizeRole = (role: unknown): UserRole => ROLE_MAP[role as string | number] ?? 'USER'

export type User = GetMeResponse

export const getMe = () => instance.get<User>('/user/@me').then((r) => r.data)

export const getAccount = () =>
	instance.get<AccountInfo>('/account/me').then((r) => ({
		...r.data,
		role: normalizeRole(r.data.role),
	}))

export const updateUser = (data: PatchUserRequest) =>
	instance.patch<User>('/user/@me', data).then((r) => r.data)

export const uploadAvatar = (file: File, onUploadProgress?: (progressEvent: any) => void) => {
	const formData = new FormData()
	formData.append('file', file)
	return instance
		.patch<User>('/user/@me/avatar', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			onUploadProgress,
		})
		.then((r) => r.data)
}

export const initEmailChange = (data: InitEmailChangeRequest) =>
	instance.post<void>('/account/email/init', data).then((r) => r.data)

export const confirmEmailChange = (data: ConfirmEmailChangeRequest) =>
	instance.post<void>('/account/email/confirm', data).then((r) => r.data)

export const initPhoneChange = (data: InitPhoneChangeRequest) =>
	instance.post<void>('/account/phone/init', data).then((r) => r.data)

export const confirmPhoneChange = (data: ConfirmPhoneChangeRequest) =>
	instance.post<void>('/account/phone/confirm', data).then((r) => r.data)

export type RoleUpgradeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface RoleUpgradeStatus {
	status: RoleUpgradeRequestStatus
	rejectionReason?: string
	documentKey?: string
}

export interface AdminUser {
	id: string
	phone?: string
	email?: string
	role: UserRole
	name?: string
	isPhoneVerified: boolean
	isEmailVerified: boolean
	createdAt: string
	roleUpgradeRequest?: RoleUpgradeStatus
}

export interface AdminUsersResponse {
	items: AdminUser[]
	total: number
}

export const getRoleUpgradeStatus = () =>
	instance.get<RoleUpgradeStatus>('/user/@me/role-upgrade').then((r) => r.data)

export const getAllUsers = (params?: { filterRequestStatus?: RoleUpgradeRequestStatus }) =>
	instance
		.get<{
			accounts: (Omit<AdminUser, 'roleUpgradeRequest'> & {
				cosmetologistRequest?: RoleUpgradeStatus
				createdAt?: string
			})[]
			total: number
		}>('/admin/users', { params })
		.then((r) => ({
			items: (r.data.accounts ?? []).map((u) => ({
				...u,
				role: normalizeRole(u.role),
				roleUpgradeRequest: u.cosmetologistRequest,
				createdAt: u.createdAt ?? '',
			})),
			total: r.data.total ?? 0,
		}))

export const getRoleUpgradeDocument = (userId: string) =>
	instance
		.get<Blob>(`/admin/users/${userId}/role-upgrade/document`, { responseType: 'blob' })
		.then((r) => r.data)

export const reviewRoleUpgrade = (userId: string, data: ReviewRoleUpgradeRequest) =>
	instance.post<void>(`/admin/users/${userId}/role-upgrade/review`, data).then((r) => r.data)

export const requestRoleUpgrade = (diplomaFile: File) => {
	const formData = new FormData()
	formData.append('file', diplomaFile)
	return instance
		.post<void>('/user/@me/upgrade-role', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		.then((r) => r.data)
}
