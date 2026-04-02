'use client'

import React, { useCallback, useRef, useState } from 'react'

import Image from 'next/image'

import { Camera, Crop, Loader2, User as UserIcon } from 'lucide-react'
import Cropper, { Area } from 'react-easy-crop'

import { uploadAvatar } from '@/api/requests/user'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { getCroppedImg } from '@/lib/utils/crop-image'
import { getMediaSource } from '@/lib/utils/get-media-source'

interface SingleImageUploaderProps {
	currentImageKey?: string | null
	userName?: string
	onChangeComplete: () => void
}

export function SingleImageUploader({
	currentImageKey,
	userName,
	onChangeComplete,
}: SingleImageUploaderProps) {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)

	const [selectedFile, setSelectedFile] = useState<{ file: File; preview: string } | null>(null)

	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

	const inputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setSelectedFile({
				file,
				preview: URL.createObjectURL(file),
			})
		}
	}

	const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
		setCroppedAreaPixels(croppedPixels)
	}, [])

	const handleUpload = async (fileToUpload: File) => {
		setUploading(true)
		setProgress(0)
		try {
			await uploadAvatar(fileToUpload, (e) => {
				if (e.total) {
					setProgress(Math.round((e.loaded * 100) / e.total))
				}
			})
			onChangeComplete()
			setSelectedFile(null)
			setCrop({ x: 0, y: 0 })
			setZoom(1)
		} catch (e) {
			console.error('Failed to upload avatar', e)
		} finally {
			setUploading(false)
		}
	}

	const handleConfirmCrop = async () => {
		if (!selectedFile || !croppedAreaPixels) return

		try {
			const croppedFile = await getCroppedImg(
				selectedFile.preview,
				croppedAreaPixels,
				selectedFile.file.name,
			)

			if (croppedFile) {
				await handleUpload(croppedFile)
			}
		} catch (e) {
			console.error('Error cropping image', e)
		}
	}

	const handleSkipCrop = async () => {
		if (selectedFile) {
			await handleUpload(selectedFile.file)
		}
	}

	const handleCloseModal = () => {
		if (selectedFile) URL.revokeObjectURL(selectedFile.preview)
		setSelectedFile(null)
	}

	return (
		<>
			<div className='flex items-center gap-4'>
				<div className='group relative h-16 w-16 shrink-0'>
					{currentImageKey ? (
						<Image
							src={getMediaSource(currentImageKey)}
							alt='Аватар'
							fill
							sizes='64px'
							className='rounded-full object-cover'
						/>
					) : (
						<div className='bg-muted flex h-16 w-16 items-center justify-center rounded-full'>
							<UserIcon className='text-muted-foreground h-7 w-7' />
						</div>
					)}
					<button
						type='button'
						disabled={uploading}
						onClick={() => inputRef.current?.click()}
						className='bg-primary/80 hover:bg-primary absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50'
					>
						<Camera className='h-6 w-6 text-white' />
					</button>

					{/* Always-visible small badge button as fallback */}
					<button
						type='button'
						disabled={uploading}
						onClick={() => inputRef.current?.click()}
						className='bg-primary absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full disabled:opacity-50'
					>
						<Camera className='h-3 w-3 text-white' />
					</button>

					{uploading && (
						<div className='bg-background/50 absolute inset-0 flex flex-col items-center justify-center rounded-full'>
							<Loader2 className='h-4 w-4 animate-spin' />
							<span className='text-[10px] font-medium'>{progress}%</span>
						</div>
					)}
				</div>
				<div>
					<p className='text-foreground text-sm font-medium'>{userName ?? '—'}</p>
					<button
						type='button'
						disabled={uploading}
						onClick={() => inputRef.current?.click()}
						className='text-primary text-sm hover:underline disabled:opacity-50'
					>
						{uploading ? 'Загрузка...' : 'Изменить фото'}
					</button>
				</div>
			</div>

			<input
				ref={inputRef}
				type='file'
				accept='image/jpeg,image/png,image/webp'
				className='hidden'
				onChange={handleFileChange}
			/>

			<Modal open={!!selectedFile} onClose={handleCloseModal} title='Обрезка фото'>
				{selectedFile && (
					<div className='space-y-4'>
						<div className='relative h-[400px] w-full overflow-hidden rounded-xl bg-black/5'>
							<Cropper
								image={selectedFile.preview}
								crop={crop}
								zoom={zoom}
								aspect={1}
								cropShape='round'
								showGrid={false}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={handleCropComplete}
							/>
						</div>
						<div className='mx-auto flex w-full max-w-sm flex-col gap-2'>
							<span className='text-muted-foreground flex items-center justify-between text-xs'>
								Масштаб (Zoom): {zoom.toFixed(1)}x
							</span>
							<input
								type='range'
								value={zoom}
								min={1}
								max={3}
								step={0.1}
								aria-label='Zoom'
								onChange={(e) => setZoom(Number(e.target.value))}
								className='accent-primary w-full'
							/>
						</div>
						<div className='flex justify-end gap-2 pt-2'>
							<Button type='button' variant='ghost' disabled={uploading} onClick={handleSkipCrop}>
								{uploading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Без обрезки'}
							</Button>
							<Button
								type='button'
								disabled={uploading}
								onClick={handleConfirmCrop}
								className='gap-2'
							>
								{uploading ? (
									<Loader2 className='mr-1 h-4 w-4 animate-spin' />
								) : (
									<Crop className='h-4 w-4' />
								)}
								Обрезать и загрузить
							</Button>
						</div>
					</div>
				)}
			</Modal>
		</>
	)
}
