'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { verifyTelegram } from '@/api/requests/auth'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES } from '@/constants/routes'
import { setCookie } from '@/lib/cookies'

// После авторизации Telegram редиректит на return_to#tgAuthResult=<base64>
// Данные приходят как хэш-фрагмент (#tgAuthResult=...), не как query-параметр
function extractTgAuthResult(): string {
	if (typeof window === 'undefined') return ''
	const hash = window.location.hash // '#tgAuthResult=<base64>'
	const match = hash.match(/[#&]tgAuthResult=([^&]*)/)
	return match ? decodeURIComponent(match[1]) : ''
}

export default function TelegramCallbackPage() {
	const router = useRouter()
	const [error, setError] = useState(false)

	useEffect(() => {
		const tgAuthResult = extractTgAuthResult()

		if (!tgAuthResult) {
			// Нет данных — пользователь попал сюда напрямую, не через Telegram
			router.replace(ROUTES.AUTH.LOGIN)
			return
		}

		verifyTelegram({ tgAuthResult })
			.then((data) => {
				if (data.accessToken) {
					setCookie('accessToken', data.accessToken)
					router.replace(ROUTES.ACCOUNT.ROOT)
				} else if (data.url) {
					// Новый пользователь — нужно взаимодействие с ботом
					// data.url = https://t.me/BOT?start=sessionId
					const sessionId = new URL(data.url).searchParams.get('start')
					if (sessionId) {
						// Открываем бота в новой вкладке и показываем страницу финализации
						window.open(data.url, '_blank')
						router.replace(`${ROUTES.AUTH.TG_FINALIZE}?sessionId=${sessionId}`)
					} else {
						window.location.href = data.url
					}
				} else {
					setError(true)
				}
			})
			.catch(() => setError(true))
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	if (error) {
		return (
			<div className='bg-surface border-border flex flex-col items-center gap-4 rounded-2xl border p-6 text-center shadow-sm'>
				<p className='text-foreground font-medium'>Ошибка авторизации</p>
				<p className='text-muted-foreground text-sm'>
					Не удалось подтвердить данные Telegram. Попробуйте ещё раз.
				</p>
				<Link href={ROUTES.AUTH.LOGIN} className='text-primary text-sm hover:underline'>
					← Вернуться ко входу
				</Link>
			</div>
		)
	}

	return (
		<div className='bg-surface border-border flex flex-col items-center gap-4 rounded-2xl border p-8 text-center shadow-sm'>
			<Spinner size='lg' />
			<p className='text-foreground font-medium'>Авторизация через Telegram...</p>
			<p className='text-muted-foreground text-sm'>Пожалуйста, подождите</p>
		</div>
	)
}
