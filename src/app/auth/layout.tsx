import Link from 'next/link'

import { ROUTES } from '@/constants/routes'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='bg-background flex min-h-screen flex-col items-center justify-center px-4'>
			<div className='w-full max-w-sm'>
				<Link
					href={ROUTES.HOME}
					className='text-foreground mb-8 block text-center text-2xl font-bold'
				>
					Arannati
				</Link>
				{children}
			</div>
		</div>
	)
}
