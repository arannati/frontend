'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Suspense } from 'react'

import { useFinalizeTelegram } from '@/api/hooks/auth/useAuthMutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES } from '@/constants/routes'

function TgFinalizeContent() {
	const searchParams = useSearchParams()
	const sessionId = searchParams.get('sessionId') ?? ''
	const finalize = useFinalizeTelegram()

	const handleFinalize = () => {
		if (sessionId) finalize.mutate({ sessionId })
	}

	// Ожидание взаимодействия с ботом
	if (!finalize.isPending && !finalize.isSuccess) {
		return (
			<div className='bg-surface border-border flex flex-col gap-5 rounded-2xl border p-6 text-center shadow-sm'>
				<div>
					<p className='text-foreground text-lg font-semibold'>Откройте Telegram</p>
					<p className='text-muted-foreground mt-1 text-sm'>
						Мы открыли бота в новой вкладке. Следуйте инструкциям там, затем вернитесь сюда и
						нажмите кнопку ниже.
					</p>
				</div>

				{finalize.isError && (
					<p className='text-sm text-red-500'>
						Похоже, вы ещё не завершили шаги в боте. Попробуйте ещё раз после взаимодействия.
					</p>
				)}

				<Button onClick={handleFinalize} loading={finalize.isPending} disabled={!sessionId}>
					{finalize.isError ? 'Попробовать снова' : 'Я завершил в Telegram'}
				</Button>

				<Link
					href={ROUTES.AUTH.LOGIN}
					className='text-muted-foreground hover:text-foreground text-sm transition-colors'
				>
					← Вернуться ко входу
				</Link>
			</div>
		)
	}

	if (finalize.isPending) {
		return (
			<div className='bg-surface border-border flex flex-col items-center gap-4 rounded-2xl border p-8 text-center shadow-sm'>
				<Spinner size='lg' />
				<p className='text-foreground font-medium'>Завершаем вход...</p>
				<p className='text-muted-foreground text-sm'>Пожалуйста, подождите</p>
			</div>
		)
	}

	return null
}

export default function TgFinalizePage() {
	return (
		<Suspense fallback={<Spinner size='lg' />}>
			<TgFinalizeContent />
		</Suspense>
	)
}
