import type { Metadata } from 'next'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
	title: 'О нас',
	description:
		'ТОО Arannati — с 2006 года лидер рынка космецевтики и эстетической косметологии Казахстана и Кыргызстана.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<main className='flex-1'>{children}</main>
			<Footer />
		</div>
	)
}
