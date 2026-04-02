import type { AxiosRequestConfig, CreateAxiosDefaults } from 'axios'
import axios from 'axios'

import { deleteCookie, getCookie, setCookie } from '@/lib/cookies'

import { refresh } from './requests/auth'

const baseURL =
	typeof window === 'undefined' ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_URL

const options: CreateAxiosDefaults = {
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
}

const api = axios.create(options)
const instance = axios.create(options)

api.interceptors.request.use(async (config) => {
	const accessToken = await getCookie('accessToken')

	if (config?.headers && accessToken) config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

let isRefreshing = false
let refreshFailed = false
let failedQueue: Array<{
	resolve: (token: string) => void
	reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token!)
		}
	})
	failedQueue = []
}

instance.interceptors.request.use(async (config) => {
	const accessToken = await getCookie('accessToken')

	if (config?.headers && accessToken) config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

instance.interceptors.response.use(
	(res) => res,
	async (err) => {
		const isServer = typeof window === 'undefined'
		const originalRequest = err.config

		if (!originalRequest) return Promise.reject(err)

		if (err?.response?.status === 401 && !originalRequest._isRetry && !refreshFailed) {
			if (isRefreshing) {
				return new Promise<string>((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then((token) => {
						if (!originalRequest.headers) originalRequest.headers = {}
						originalRequest.headers.Authorization = `Bearer ${token}`
						return instance(originalRequest)
					})
					.catch((error) => Promise.reject(error))
			}

			// На сервере не делаем refresh во избежание бесконечных циклов в Node.js
			if (isServer) {
				return Promise.reject(err)
			}

			originalRequest._isRetry = true
			isRefreshing = true

			try {
				const response = await refresh()
				const newToken = response?.accessToken

				if (!newToken) throw new Error('No access token in refresh response')

				setCookie('accessToken', newToken)
				instance.defaults.headers.common.Authorization = `Bearer ${newToken}`
				processQueue(null, newToken)

				if (!originalRequest.headers) originalRequest.headers = {}
				originalRequest.headers.Authorization = `Bearer ${newToken}`
				return instance(originalRequest)
			} catch (refreshError) {
				processQueue(refreshError, null)
				deleteCookie('accessToken')
				refreshFailed = true

				return Promise.reject(refreshError)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(err)
	},
)

// Orval v8 mutator — используется сгенерированными запросами (unwraps .data)
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
	const source = axios.CancelToken.source()
	const promise = instance({
		...config,
		cancelToken: source.token,
	}).then(({ data }) => data as T)

	// @ts-ignore
	promise.cancel = () => source.cancel('Query was cancelled')

	return promise
}

export const resetRefreshState = () => {
	refreshFailed = false
}

export { api, instance }
