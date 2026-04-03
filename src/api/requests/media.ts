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
                .post<UploadResponse>('/api-upload/media/product-image', formData, {
                        baseURL: '', // Disable default baseURL so it hits the domain root NextJS rewrites
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress,
                })
		.then((r) => r.data)
}
