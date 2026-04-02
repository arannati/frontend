import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const BACKEND = process.env.API_BASE_URL!

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
	const url = `${BACKEND}/${path.join('/')}${req.nextUrl.search}`

	const headers = new Headers(req.headers)
	headers.delete('host')

	const upstream = await fetch(url, {
		method: req.method,
		headers,
		body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body,
		// @ts-ignore — required for streaming body in Node.js fetch
		duplex: 'half',
	})

	const resHeaders = new Headers(upstream.headers)

	// Strip Domain attribute from Set-Cookie so the browser stores the cookie
	// for the current origin (localhost) instead of the production domain.
	const cookies = resHeaders.getSetCookie?.() ?? []
	if (cookies.length > 0) {
		resHeaders.delete('set-cookie')
		for (const raw of cookies) {
			const stripped = raw
				.split(';')
				.map((s) => s.trim())
				.filter((s) => !s.toLowerCase().startsWith('domain='))
				.join('; ')
			resHeaders.append('set-cookie', stripped)
		}
	}

	return new NextResponse(upstream.body, {
		status: upstream.status,
		statusText: upstream.statusText,
		headers: resHeaders,
	})
}

type Ctx = { params: Promise<{ path: string[] }> }

export async function GET(req: NextRequest, ctx: Ctx) {
	return proxy(req, (await ctx.params).path)
}
export async function POST(req: NextRequest, ctx: Ctx) {
	return proxy(req, (await ctx.params).path)
}
export async function PUT(req: NextRequest, ctx: Ctx) {
	return proxy(req, (await ctx.params).path)
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
	return proxy(req, (await ctx.params).path)
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
	return proxy(req, (await ctx.params).path)
}
