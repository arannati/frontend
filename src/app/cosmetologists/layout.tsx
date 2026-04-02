import type { Metadata } from 'next'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
	title: 'Косметологам',
	description:
		'Станьте частью профессионального сообщества Arannati — получите специальные условия, доступ к образовательному контенту и персональные скидки.',
}

export default function CosmetologistsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<main className='flex-1'>{children}</main>
			<Footer />
		</div>
	)
}
