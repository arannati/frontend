import { instance } from '../instance'

export interface UploadResponse {
	key: string
}

export const uploadProductImage = (file: File) => {
	const formData = new FormData()
	formData.append('file', file)
	return instance
		.post<UploadResponse>('/media/product-image', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		.then((r) => r.data)
}
