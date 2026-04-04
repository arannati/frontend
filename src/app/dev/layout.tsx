import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: '@cclxxi — Full-Stack Developer',
	description: 'Developer portfolio page for arannati.kz',
	robots: { index: false },
}

export default function DevLayout({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
			{children}
		</div>
	)
}
