import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
	/^\/account(\/.*)?$/,
	/^\/cart$/,
	/^\/checkout(\/.*)?$/,
	/^\/admin(\/.*)?$/,
]
const AUTH_ROUTES = [/^\/auth(\/.*)?$/]

export function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl
	const accessToken = req.cookies.get('accessToken')?.value

	const isProtected = PROTECTED_ROUTES.some((r) => r.test(pathname))
	const isAuthRoute = AUTH_ROUTES.some((r) => r.test(pathname))

	if (!accessToken && isProtected) {
		const loginUrl = req.nextUrl.clone()
		loginUrl.pathname = '/auth/login'
		return NextResponse.redirect(loginUrl)
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
