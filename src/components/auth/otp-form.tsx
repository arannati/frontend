'use client'

import { useCallback, useEffect, useState } from 'react'

import Link from 'next/link'

import { useForm } from '@tanstack/react-form'
import { ArrowLeft } from 'lucide-react'
import { z } from 'zod/v4'

import { useSendOtp, useVerifyOtp } from '@/api/hooks/auth/useAuthMutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { translateError } from '@/lib/utils/error-map'

const phoneAuthEnabled = process.env.NEXT_PUBLIC_PHONE_AUTH_ENABLED === 'true'

const identifierSchema = z.object({
	identifier: phoneAuthEnabled
		? z
				.string()
				.min(1, 'Введите номер телефона или email')
				.refine(
					(v) => /^[+\d][\d\s\-()]{6,}$/.test(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
					'Введите корректный телефон или email',
				)
		: z
				.string()
				.min(1, 'Введите email')
				.refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Введите корректный email'),
})

const codeSchema = z.object({
	code: z.string().length(6, 'Код состоит из 6 цифр'),
})

export function OtpForm() {
	const [step, setStep] = useState<'identifier' | 'code'>('identifier')
	const [identifier, setIdentifier] = useState('')
	const [countdown, setCountdown] = useState(0)
	const sendOtp = useSendOtp()
	const verifyOtp = useVerifyOtp()

	const startCountdown = useCallback(() => {
		setCountdown(120)
	}, [])

	useEffect(() => {
		let timer: NodeJS.Timeout
		if (countdown > 0) {
			timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
		}
		return () => clearTimeout(timer)
	}, [countdown])

	const identifierForm = useForm({
		defaultValues: { identifier: '' },
		onSubmit: async ({ value }) => {
			const type = value.identifier.includes('@') ? 'email' : 'phone'
			await sendOtp.mutateAsync({ identifier: value.identifier, type })
			setIdentifier(value.identifier)
			setStep('code')
			startCountdown()
		},
	})

	const codeForm = useForm({
		defaultValues: { code: '' },
		onSubmit: async ({ value }) => {
			const type = identifier.includes('@') ? 'email' : 'phone'
			await verifyOtp.mutateAsync({ identifier, type, code: value.code })
		},
	})

	if (step === 'code') {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault()
					codeForm.handleSubmit()
				}}
				className='flex flex-col gap-4'
			>
				<p className='text-muted-foreground text-sm'>
					Код отправлен на <span className='text-foreground font-medium'>{identifier}</span>
				</p>

				<codeForm.Field name='code' validators={{ onSubmit: codeSchema.shape.code }}>
					{(field) => (
						<Input
							label='Код подтверждения'
							placeholder='000000'
							maxLength={6}
							inputMode='numeric'
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.errors[0]?.message}
						/>
					)}
				</codeForm.Field>

				{verifyOtp.error && (
					<p className='text-sm text-red-500'>
						{translateError((verifyOtp.error as any)?.response?.data?.message)}
					</p>
				)}

				<Button type='submit' loading={verifyOtp.isPending} className='w-full'>
					Подтвердить
				</Button>

				<Button
					type='button'
					variant='secondary'
					disabled={countdown > 0 || sendOtp.isPending}
					onClick={async () => {
						const type = identifier.includes('@') ? 'email' : 'phone'
						await sendOtp.mutateAsync({ identifier, type })
						startCountdown()
					}}
					className='w-full'
				>
					{countdown > 0
						? `Отправить код еще раз (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
						: 'Отправить код еще раз'}
				</Button>

				<button
					type='button'
					onClick={() => {
						setStep('identifier')
						setCountdown(0)
					}}
					className='text-muted-foreground hover:text-foreground mt-2 text-sm transition-colors'
				>
					← Изменить {!phoneAuthEnabled || identifier.includes('@') ? 'email' : 'телефон'}
				</button>
			</form>
		)
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				identifierForm.handleSubmit()
			}}
			className='flex flex-col gap-4'
		>
			<identifierForm.Field
				name='identifier'
				validators={{ onSubmit: identifierSchema.shape.identifier }}
			>
				{(field) => (
					<Input
						label={phoneAuthEnabled ? 'Телефон или email' : 'Email'}
						placeholder={phoneAuthEnabled ? '+996 700 000 000' : 'example@mail.com'}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						error={field.state.meta.errors[0]?.message}
					/>
				)}
			</identifierForm.Field>

			{sendOtp.error && (
				<p className='text-sm text-red-500'>
					{translateError((sendOtp.error as any)?.response?.data?.message)}
				</p>
			)}

			<Button type='submit' loading={sendOtp.isPending} className='w-full'>
				Отправить код
			</Button>

			<Link
				href='/'
				className='text-muted-foreground hover:text-foreground mt-2 inline-flex items-center justify-center gap-2 text-center text-sm transition-colors'
			>
				<ArrowLeft className='h-4 w-4' />
				Вернуться на главную
			</Link>
		</form>
	)
}
