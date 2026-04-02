import { AxiosProgressEvent } from 'axios'

import { instance } from '../instance'

export interface UploadResponse {
	key: string
}

export const uploadProductImage = (
	file: File,
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
	const formData = new FormData()
	formData.append('file', file)
	return instance
		.post<UploadResponse>('/media/product-image', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			onUploadProgress,
		})
		.then((r) => r.data)
}
