import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [/^\/account(\/.*)?$/, /^\/cart$/, /^\/checkout(\/.*)?$/]
const ADMIN_ROUTES = [/^\/admin(\/.*)?$/]
const AUTH_ROUTES = [/^\/auth(\/.*)?$/]

function getRoleFromToken(token: string): string | null {
	try {
		const parts = token.split('.')
		if (parts.length < 2) return null
		const payload = JSON.parse(atob(parts[1]))
		return payload.role ?? null
	} catch {
		return null
	}
}

export function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl
	const accessToken = req.cookies.get('accessToken')?.value

	const isProtected = PROTECTED_ROUTES.some((r) => r.test(pathname))
	const isAdminRoute = ADMIN_ROUTES.some((r) => r.test(pathname))
	const isAuthRoute = AUTH_ROUTES.some((r) => r.test(pathname))

	if (!accessToken && (isProtected || isAdminRoute)) {
		const loginUrl = req.nextUrl.clone()
		loginUrl.pathname = '/auth/login'
		return NextResponse.redirect(loginUrl)
	}

	if (accessToken && isAdminRoute) {
		const role = getRoleFromToken(accessToken)
		if (role !== 'ADMIN') {
			const homeUrl = req.nextUrl.clone()
			homeUrl.pathname = '/'
			return NextResponse.redirect(homeUrl)
		}
	}

	if (accessToken && isAuthRoute) {
		const accountUrl = req.nextUrl.clone()
		accountUrl.pathname = '/account'
		return NextResponse.redirect(accountUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/auth/:path*', '/account/:path*', '/cart', '/checkout/:path*', '/admin/:path*'],
}
