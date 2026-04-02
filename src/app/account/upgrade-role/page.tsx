'use client'

import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'

import Link from 'next/link'

import { AlertCircle, CheckCircle, ChevronLeft, Clock, FileUp, Upload, XCircle } from 'lucide-react'

import { useRequestRoleUpgrade, useRoleUpgradeStatus } from '@/api/hooks/user/useUser'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { translateError } from '@/lib/utils/error-map'

export default function UpgradeRolePage() {
	const { isCosmetologist } = useAuth()
	const { data: upgradeStatus, isLoading: statusLoading } = useRoleUpgradeStatus()
	const { mutate, isPending, isSuccess, error } = useRequestRoleUpgrade()
	const [file, setFile] = useState<File | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
		setFile(e.target.files?.[0] ?? null)
	}

	const handleSubmit = () => {
		if (file) mutate(file)
	}

	if (isCosmetologist) {
		return (
			<div className='flex flex-col gap-6'>
				<Link
					href='/account'
					className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors'
				>
					<ChevronLeft className='h-4 w-4' />
					Профиль
				</Link>
				<div className='flex flex-col items-center gap-4 py-8 text-center'>
					<CheckCircle className='text-primary h-12 w-12' />
					<h1 className='text-foreground text-xl font-semibold'>Вы уже косметолог</h1>
					<p className='text-muted-foreground text-sm'>
						У вас есть доступ ко всем профессиональным материалам и ценам.
					</p>
				</div>
			</div>
		)
	}

	if (statusLoading) {
		return (
			<div className='flex flex-col gap-4'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-24 w-full' />
			</div>
		)
	}

	// Заявка уже подана и ожидает рассмотрения
	if ((upgradeStatus?.status === 'PENDING' || isSuccess) && !error) {
		return (
			<div className='flex flex-col gap-6'>
				<Link
					href='/account'
					className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors'
				>
					<ChevronLeft className='h-4 w-4' />
					Профиль
				</Link>
				<div className='flex flex-col items-center gap-4 py-8 text-center'>
					<Clock className='h-12 w-12 text-amber-500' />
					<h1 className='text-foreground text-xl font-semibold'>Заявка на рассмотрении</h1>
					<p className='text-muted-foreground max-w-sm text-sm'>
						Мы рассмотрим ваш диплом и свяжемся с вами. Обычно это занимает 1–2 рабочих дня.
					</p>
				</div>
			</div>
		)
	}

	// Заявка отклонена
	if (upgradeStatus?.status === 'REJECTED') {
		return (
			<div className='flex flex-col gap-6'>
				<Link
					href='/account'
					className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors'
				>
					<ChevronLeft className='h-4 w-4' />
					Профиль
				</Link>
				<div className='bg-surface border-border flex flex-col gap-3 rounded-2xl border p-5'>
					<div className='flex items-center gap-3'>
						<XCircle className='h-6 w-6 shrink-0 text-red-500' />
						<div>
							<p className='text-foreground font-medium'>Заявка отклонена</p>
							{upgradeStatus.rejectionReason && (
								<p className='text-muted-foreground mt-0.5 text-sm'>
									{upgradeStatus.rejectionReason}
								</p>
							)}
						</div>
					</div>
				</div>

				<div>
					<h2 className='text-foreground text-lg font-semibold'>Подать повторную заявку</h2>
					<p className='text-muted-foreground mt-1 text-sm'>
						Загрузите новый документ, подтверждающий вашу квалификацию.
					</p>
				</div>

				<UploadForm
					file={file}
					inputRef={inputRef}
					onFileChange={handleFile}
					onSubmit={handleSubmit}
					isPending={isPending}
					error={error}
				/>
			</div>
		)
	}

	// Форма подачи заявки
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
				<h1 className='text-foreground text-xl font-semibold'>Стать косметологом</h1>
				<p className='text-muted-foreground mt-1 text-sm'>
					Загрузите диплом или сертификат, подтверждающий вашу квалификацию. После проверки вы
					получите доступ к профессиональным ценам и материалам.
				</p>
			</div>

			<UploadForm
				file={file}
				inputRef={inputRef}
				onFileChange={handleFile}
				onSubmit={handleSubmit}
				isPending={isPending}
				error={error}
			/>
		</div>
	)
}

function UploadForm({
	file,
	inputRef,
	onFileChange,
	onSubmit,
	isPending,
	error,
}: {
	file: File | null
	inputRef: React.RefObject<HTMLInputElement | null>
	onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
	onSubmit: () => void
	isPending: boolean
	error: unknown
}) {
	return (
		<div className='bg-surface border-border flex flex-col gap-4 rounded-2xl border p-5'>
			<button
				type='button'
				onClick={() => inputRef.current?.click()}
				className='border-border hover:border-primary flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors'
			>
				{file ? (
					<>
						<FileUp className='text-primary h-8 w-8' />
						<span className='text-foreground text-sm font-medium'>{file.name}</span>
						<span className='text-muted-foreground text-xs'>
							{(file.size / 1024 / 1024).toFixed(2)} МБ · нажмите чтобы заменить
						</span>
					</>
				) : (
					<>
						<Upload className='text-muted-foreground h-8 w-8' />
						<span className='text-foreground text-sm font-medium'>Выберите файл</span>
						<span className='text-muted-foreground text-xs'>JPG, PNG, WEBP или PDF · до 55 МБ</span>
					</>
				)}
			</button>

			<input
				ref={inputRef}
				type='file'
				accept='image/jpeg,image/png,image/webp,image/gif,application/pdf'
				className='hidden'
				onChange={onFileChange}
			/>

			<div className='flex gap-3'>
				<Button type='submit' className='flex-1' loading={isPending} disabled={!file}>
					Отправить запрос
				</Button>
				<Button type='button' variant='secondary'>
					Отмена
				</Button>
			</div>

			{!!error && (
				<div className='flex items-center gap-2 text-sm text-red-500'>
					<AlertCircle className='h-4 w-4 shrink-0' />
					<span>{translateError((error as any)?.response?.data?.message)}</span>
				</div>
			)}
		</div>
	)
}
