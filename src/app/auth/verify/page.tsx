'use client'

import { Suspense, useState } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { ChevronLeft } from 'lucide-react'

import { useVerifyOtp } from '@/api/hooks/auth/useAuthMutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES } from '@/constants/routes'
import { translateError } from '@/lib/utils/error-map'

function VerifyContent() {
	const searchParams = useSearchParams()
	const identifier = searchParams.get('identifier') ?? ''
	const type = identifier.includes('@') ? ('email' as const) : ('phone' as const)

	const [code, setCode] = useState('')
	const verifyOtp = useVerifyOtp()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (code.length !== 6) return
		verifyOtp.mutate({ identifier, type, code })
	}

	return (
		<div className='bg-surface border-border flex flex-col gap-5 rounded-2xl border p-6 shadow-sm'>
			<div className='text-center'>
				<Link
					href={ROUTES.AUTH.LOGIN}
					className='text-muted-foreground hover:text-foreground mb-1 flex items-center justify-center gap-1 text-sm transition-colors'
				>
					<ChevronLeft className='h-4 w-4' />
					Войти
				</Link>
				<h1 className='text-foreground text-xl font-semibold'>Введите код</h1>
				<p className='text-muted-foreground mt-1 text-sm'>
					Мы отправили код на{' '}
					<span className='text-foreground font-medium'>{identifier || '...'}</span>
				</p>
			</div>

			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<Input
					label='Код подтверждения'
					placeholder='000000'
					maxLength={6}
					inputMode='numeric'
					value={code}
					onChange={(e) => setCode(e.target.value)}
				/>

				{verifyOtp.error && (
					<p className='text-sm text-red-500'>
						{translateError((verifyOtp.error as any)?.response?.data?.message)}
					</p>
				)}

				<Button
					type='submit'
					className='w-full'
					loading={verifyOtp.isPending}
					disabled={code.length !== 6}
				>
					Подтвердить
				</Button>
			</form>
		</div>
	)
}

export default function VerifyPage() {
	return (
		<Suspense fallback={<Spinner size='lg' />}>
			<VerifyContent />
		</Suspense>
	)
}
