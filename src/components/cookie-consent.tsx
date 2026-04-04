'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { ROUTES } from '@/constants/routes'

const STORAGE_KEY = 'arannati_consent_accepted'

export function CookieConsent() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (!localStorage.getItem(STORAGE_KEY)) {
			setVisible(true)
		}
	}, [])

	function accept() {
		localStorage.setItem(STORAGE_KEY, '1')
		setVisible(false)
	}

	if (!visible) return null

	return (
		<div className='bg-surface border-border fixed right-0 bottom-0 left-0 z-50 border-t px-4 py-4 shadow-lg sm:px-6'>
			<div className='mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-muted-foreground text-sm leading-relaxed'>
					Продолжая пользоваться сайтом, вы соглашаетесь с{' '}
					<Link
						href={ROUTES.PRIVACY_POLICY}
						className='text-foreground underline underline-offset-4 transition-opacity hover:opacity-70'
					>
						политикой конфиденциальности
					</Link>{' '}
					и{' '}
					<Link
						href={ROUTES.PUBLIC_OFFER}
						className='text-foreground underline underline-offset-4 transition-opacity hover:opacity-70'
					>
						публичной офертой
					</Link>
					.
				</p>
				<button
					onClick={accept}
					className='bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-lg px-5 py-2 text-sm font-medium transition-colors'
				>
					Принять
				</button>
			</div>
		</div>
	)
}
