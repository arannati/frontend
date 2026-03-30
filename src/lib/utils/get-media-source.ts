export function getMediaSource(key: string) {
	return `${process.env.NEXT_PUBLIC_MEDIA_URL}/${key}`
}
