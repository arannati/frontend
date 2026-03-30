import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import '@/assets/styles/globals.css'
import { ReactQueryProvider } from '@/providers/react-query'
import { ThemeProvider } from '@/providers/theme'

const geist = Geist({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-geist',
})

export const metadata: Metadata = {
	title: {
		absolute: 'Arannati',
		template: '%s — Arannati',
	},
	description: 'Профессиональная косметика для косметологов и ценителей качества',
	openGraph: {
		type: 'website',
		locale: 'ru_RU',
		siteName: 'Arannati',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<body className={geist.variable}>
				<ThemeProvider>
					<ReactQueryProvider>{children}</ReactQueryProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
