export async function setCookie(name: string, value: string, days = 7) {
	if (typeof window === 'undefined') {
		const { cookies } = await import('next/headers')
		const cookieStore = await cookies()
		cookieStore.set(name, value, { maxAge: days * 86400, path: '/' })
		return
	}
	const expires = new Date(Date.now() + days * 864e5).toUTCString()

	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

export async function getCookie(name: string) {
	if (typeof window === 'undefined') {
		try {
			const { cookies } = await import('next/headers')
			const cookieStore = await cookies()
			return cookieStore.get(name)?.value ?? null
		} catch {
			return null
		}
	}
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))

	return match ? decodeURIComponent(match[2]) : null
}

export async function deleteCookie(name: string) {
	if (typeof window === 'undefined') {
		const { cookies } = await import('next/headers')
		const cookieStore = await cookies()
		cookieStore.delete(name)
		return
	}
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}
