import type {
	SendOtpRequest,
	TelegramFinalizeRequest,
	TelegramVerifyRequest,
	VerifyOtpRequest,
} from '@/api/generated'

import { api } from '../instance'

export type { SendOtpRequestType, VerifyOtpRequestType } from '@/api/generated'

export interface AuthTokensResponse {
	accessToken: string
}

export const sendOtp = (data: SendOtpRequest) =>
	api.post<void>('/auth/otp/send', data).then((r) => r.data)

export const verifyOtp = (data: VerifyOtpRequest) =>
	api.post<AuthTokensResponse>('/auth/otp/verify', data).then((r) => r.data)

export const refresh = () => api.post<AuthTokensResponse>('/auth/refresh').then((r) => r.data)

export const logout = () => api.post<void>('/auth/logout').then((r) => r.data)

export const initTelegram = () => api.get<{ url: string }>('/auth/telegram').then((r) => r.data)

export const verifyTelegram = (data: TelegramVerifyRequest) =>
	api
		.post<{ url?: string } & Partial<AuthTokensResponse>>('/auth/telegram/verify', data)
		.then((r) => r.data)

export const finalizeTelegram = (data: TelegramFinalizeRequest) =>
	api.post<AuthTokensResponse>('/auth/telegram/finalize', data).then((r) => r.data)
