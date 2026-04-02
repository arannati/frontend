'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const { isAuthenticated, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace(ROUTES.AUTH.LOGIN)
		}
	}, [isLoading, isAuthenticated, router])

	if (isLoading || !isAuthenticated) return null

	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<main className='mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6'>{children}</main>
			<Footer />
		</div>
	)
}
