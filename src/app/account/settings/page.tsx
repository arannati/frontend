'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'

import {
	useConfirmEmailChange,
	useConfirmPhoneChange,
	useInitEmailChange,
	useInitPhoneChange,
	useMe,
	useUpdateUser,
} from '@/api/hooks/user/useUser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SingleImageUploader } from '@/components/ui/single-image-uploader'
import { translateError } from '@/lib/utils/error-map'

export default function SettingsPage() {
	const { data: user, isLoading } = useMe()
	const queryClient = useQueryClient()
	const updateUser = useUpdateUser()
	const initEmail = useInitEmailChange()
	const confirmEmail = useConfirmEmailChange()
	const initPhone = useInitPhoneChange()
	const confirmPhone = useConfirmPhoneChange()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [emailCode, setEmailCode] = useState('')
	const [emailStep, setEmailStep] = useState<'input' | 'code'>('input')
	const [phone, setPhone] = useState('')
	const [phoneCode, setPhoneCode] = useState('')
	const [phoneStep, setPhoneStep] = useState<'input' | 'code'>('input')

	useEffect(() => {
		if (user) {
			setName(user.name ?? '')
			setEmail(user.email ?? '')
			setPhone(user.phone ?? '')
		}
	}, [user])

	const handleSaveName = (e: React.FormEvent) => {
		e.preventDefault()
		updateUser.mutate({ name })
	}

	const handleInitEmail = (e: React.FormEvent) => {
		e.preventDefault()
		initEmail.mutate({ email }, { onSuccess: () => setEmailStep('code') })
	}

	const handleConfirmEmail = (e: React.FormEvent) => {
		e.preventDefault()
		confirmEmail.mutate({ email, code: emailCode }, { onSuccess: () => setEmailStep('input') })
	}

	const handleInitPhone = (e: React.FormEvent) => {
		e.preventDefault()
		initPhone.mutate({ phone }, { onSuccess: () => setPhoneStep('code') })
	}

	const handleConfirmPhone = (e: React.FormEvent) => {
		e.preventDefault()
		confirmPhone.mutate({ phone, code: phoneCode }, { onSuccess: () => setPhoneStep('input') })
	}

	if (isLoading) {
		return <div className='bg-surface border-border h-48 animate-pulse rounded-2xl border' />
	}

	return (
		<div className='flex flex-col gap-6'>
			<div>
				<Link
					href='/account'
					className='text-muted-foreground hover:text-foreground mb-1 flex items-center gap-1 text-sm transition-colors'
				>
					<ChevronLeft className='h-4 w-4' />
					Профиль
				</Link>
				<h1 className='text-foreground text-xl font-semibold'>Настройки</h1>
			</div>

			{/* Avatar */}
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<p className='text-foreground mb-4 text-sm font-medium'>Фото профиля</p>
				<SingleImageUploader
					currentImageKey={user?.avatar}
					userName={user?.name ?? '—'}
					onChangeComplete={() => queryClient.invalidateQueries({ queryKey: ['me'] })}
				/>
			</div>

			{/* Name */}
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<p className='text-foreground mb-4 text-sm font-medium'>Имя</p>
				<form onSubmit={handleSaveName} className='flex flex-col gap-3'>
					<Input placeholder='Ваше имя' value={name} onChange={(e) => setName(e.target.value)} />
					{updateUser.error && (
						<p className='text-sm text-red-500'>
							{translateError((updateUser.error as any)?.response?.data?.message)}
						</p>
					)}
					{updateUser.isSuccess && <p className='text-sm text-green-600'>Сохранено</p>}
					<Button
						type='submit'
						variant='primary'
						loading={updateUser.isPending}
						disabled={!name.trim()}
					>
						Сохранить
					</Button>
				</form>
			</div>

			{/* Email */}
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<p className='text-foreground mb-1 text-sm font-medium'>Email</p>
				{user?.email && emailStep === 'input' && (
					<p className='text-muted-foreground mb-4 text-sm'>Текущий: {user.email}</p>
				)}

				{emailStep === 'input' ? (
					<form onSubmit={handleInitEmail} className='flex flex-col gap-3'>
						<Input
							placeholder='example@mail.com'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						{initEmail.error && (
							<p className='text-sm text-red-500'>
								{translateError((initEmail.error as any)?.response?.data?.message)}
							</p>
						)}
						<Button
							type='submit'
							variant='primary'
							loading={initEmail.isPending}
							disabled={!email.trim()}
						>
							{user?.email ? 'Изменить email' : 'Добавить email'}
						</Button>
					</form>
				) : (
					<form onSubmit={handleConfirmEmail} className='flex flex-col gap-3'>
						<p className='text-muted-foreground text-sm'>
							Код отправлен на <span className='text-foreground font-medium'>{email}</span>
						</p>
						<Input
							placeholder='000000'
							maxLength={6}
							inputMode='numeric'
							value={emailCode}
							onChange={(e) => setEmailCode(e.target.value)}
						/>
						{confirmEmail.error && (
							<p className='text-sm text-red-500'>
								{translateError((confirmEmail.error as any)?.response?.data?.message)}
							</p>
						)}
						{confirmEmail.isSuccess && <p className='text-sm text-green-600'>Email обновлён</p>}
						<Button
							type='submit'
							variant='primary'
							loading={confirmEmail.isPending}
							disabled={emailCode.length !== 6}
						>
							Подтвердить
						</Button>
						<button
							type='button'
							onClick={() => {
								setEmailStep('input')
								setEmailCode('')
							}}
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							← Изменить email
						</button>
					</form>
				)}
			</div>

			{/* Phone */}
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<p className='text-foreground mb-1 text-sm font-medium'>Номер телефона</p>
				{user?.phone && phoneStep === 'input' && (
					<p className='text-muted-foreground mb-4 text-sm'>Текущий: {user.phone}</p>
				)}

				{phoneStep === 'input' ? (
					<form onSubmit={handleInitPhone} className='flex flex-col gap-3'>
						<Input
							placeholder='+996 700 000 000'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
						{initPhone.error && (
							<p className='text-sm text-red-500'>
								{translateError((initPhone.error as any)?.response?.data?.message)}
							</p>
						)}
						<Button
							type='submit'
							variant='primary'
							loading={initPhone.isPending}
							disabled={!phone.trim()}
						>
							{user?.phone ? 'Изменить номер' : 'Добавить номер'}
						</Button>
					</form>
				) : (
					<form onSubmit={handleConfirmPhone} className='flex flex-col gap-3'>
						<p className='text-muted-foreground text-sm'>
							Код отправлен на <span className='text-foreground font-medium'>{phone}</span>
						</p>
						<Input
							placeholder='000000'
							maxLength={6}
							inputMode='numeric'
							value={phoneCode}
							onChange={(e) => setPhoneCode(e.target.value)}
						/>
						{confirmPhone.error && (
							<p className='text-sm text-red-500'>
								{translateError((confirmPhone.error as any)?.response?.data?.message)}
							</p>
						)}
						{confirmPhone.isSuccess && <p className='text-sm text-green-600'>Номер обновлён</p>}
						<Button
							type='submit'
							variant='primary'
							loading={confirmPhone.isPending}
							disabled={phoneCode.length !== 6}
						>
							Подтвердить
						</Button>
						<button
							type='button'
							onClick={() => {
								setPhoneStep('input')
								setPhoneCode('')
							}}
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							← Изменить номер
						</button>
					</form>
				)}
			</div>
		</div>
	)
}
