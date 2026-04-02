import type { Metadata } from 'next'

import { OtpForm } from '@/components/auth/otp-form'
import { TelegramButton } from '@/components/auth/telegram-button'

export const metadata: Metadata = { title: 'Войти' }

export default function LoginPage() {
	return (
		<div className='bg-surface border-border flex flex-col gap-6 rounded-2xl border p-6 shadow-sm'>
			<div className='text-center'>
				<h1 className='text-foreground text-xl font-semibold'>Войти в аккаунт</h1>
				<p className='text-muted-foreground mt-1 text-sm'>
					{process.env.NEXT_PUBLIC_PHONE_AUTH_ENABLED === 'true'
						? 'Введите номер телефона или email'
						: 'Введите email'}
				</p>
			</div>

			<OtpForm />

			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<div className='border-border w-full border-t' />
				</div>
				<div className='relative flex justify-center'>
					<span className='bg-surface text-muted-foreground px-2 text-xs'>или</span>
				</div>
			</div>

			<TelegramButton />
		</div>
	)
}
