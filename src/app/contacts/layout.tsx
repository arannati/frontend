import type { Metadata } from 'next'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
	title: 'Контакты',
	description: 'Свяжитесь с Arannati: телефон, email, адрес офиса в Алматы и режим работы.',
}

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<main className='flex-1'>{children}</main>
			<Footer />
		</div>
	)
}
