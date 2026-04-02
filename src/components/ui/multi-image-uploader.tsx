'use client'

import React, { useCallback, useState } from 'react'

import NextImage from 'next/image'

import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	rectSortingStrategy,
	sortableKeyboardCoordinates,
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Crop, Loader2, Maximize2, Upload, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Cropper, { Area } from 'react-easy-crop'

import { uploadProductImage } from '@/api/requests/media'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { getCroppedImg } from '@/lib/utils/crop-image'
import { getMediaSource } from '@/lib/utils/get-media-source'

interface SortableItemProps {
	id: string
	imageUrl: string
	onRemove: () => void
}

function SortableItem({ id, imageUrl, onRemove }: SortableItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 2 : 1,
		opacity: isDragging ? 0.5 : 1,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className='group border-border relative h-24 w-24 overflow-hidden rounded-xl border'
		>
			<NextImage
				src={imageUrl}
				alt='uploaded'
				fill
				sizes='96px'
				className='pointer-events-none object-cover'
				draggable={false}
			/>
			<div
				{...attributes}
				{...listeners}
				className='absolute inset-0 z-10 cursor-grab active:cursor-grabbing'
			/>
			<button
				type='button'
				onPointerDown={(e) => e.stopPropagation()}
				onClick={(e) => {
					e.stopPropagation()
					onRemove()
				}}
				className='absolute top-1 right-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80'
			>
				<X className='h-4 w-4 text-white' />
			</button>
		</div>
	)
}

interface ImageUploaderProps {
	images: string[]
	onChange: (images: string[]) => void
	maxFiles?: number
}

interface CropQueueItem {
	id: string
	file: File
	preview: string
}

export function MultiImageUploader({ images, onChange, maxFiles = 10 }: ImageUploaderProps) {
	const [uploading, setUploading] = useState(false)
	const [cropQueue, setCropQueue] = useState<CropQueueItem[]>([])
	const [progress, setProgress] = useState(0)

	// Crop state
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (over && active.id !== over.id) {
			const oldIndex = images.indexOf(active.id as string)
			const newIndex = images.indexOf(over.id as string)
			onChange(arrayMove(images, oldIndex, newIndex))
		}
	}

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const newItems = acceptedFiles.map((file) => ({
			id: Math.random().toString(36).substring(7),
			file,
			preview: URL.createObjectURL(file),
		}))
		setCropQueue((prev) => [...prev, ...newItems])
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { 'image/*': [] },
		maxFiles: maxFiles - images.length,
		disabled: uploading || images.length >= maxFiles,
	})

	const removeImage = (idxToRemove: number) => {
		onChange(images.filter((_, idx) => idx !== idxToRemove))
	}

	const currentCropItem = cropQueue[0]

	const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
		setCroppedAreaPixels(croppedPixels)
	}, [])

	const handleConfirmCrop = async () => {
		if (!currentCropItem || !croppedAreaPixels) return

		setUploading(true)
		setProgress(0)
		try {
			const croppedFile = await getCroppedImg(
				currentCropItem.preview,
				croppedAreaPixels,
				currentCropItem.file.name,
			)

			if (croppedFile) {
				const res = await uploadProductImage(croppedFile, (e) => {
					if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
				})
				onChange([...images, res.key])
			}
		} catch (e) {
			console.error('Failed to crop/upload image', e)
		} finally {
			URL.revokeObjectURL(currentCropItem.preview)
			setCropQueue((prev) => prev.slice(1))
			setUploading(false)
			setProgress(0)
			setCrop({ x: 0, y: 0 })
			setZoom(1)
		}
	}

	const handleSkipCrop = async () => {
		if (!currentCropItem) return
		setUploading(true)
		setProgress(0)
		try {
			const res = await uploadProductImage(currentCropItem.file, (e) => {
				if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
			})
			onChange([...images, res.key])
		} catch (e) {
			console.error('Upload failed', e)
		} finally {
			URL.revokeObjectURL(currentCropItem.preview)
			setCropQueue((prev) => prev.slice(1))
			setUploading(false)
			setProgress(0)
		}
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-wrap gap-3'>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={images} strategy={rectSortingStrategy}>
						{images.map((key, idx) => (
							<SortableItem
								key={key}
								id={key}
								imageUrl={getMediaSource(key)}
								onRemove={() => removeImage(idx)}
							/>
						))}
					</SortableContext>
				</DndContext>

				{images.length < maxFiles && (
					<div
						{...getRootProps()}
						className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-xs transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border text-muted-foreground hover:border-primary/50'} ${uploading ? 'pointer-events-none opacity-50' : ''} `}
					>
						<input {...getInputProps()} />
						{uploading ? (
							<div className='flex flex-col items-center gap-1'>
								<Loader2 className='h-4 w-4 animate-spin' />
								<span className='text-[10px]'>{progress}%</span>
							</div>
						) : (
							<>
								<Upload className='h-5 w-5' />
								<span className='px-1 text-center text-[10px] leading-tight'>
									{isDragActive ? 'Отпустите' : 'Добавить'}
								</span>
							</>
						)}
					</div>
				)}
			</div>

			<Modal open={!!currentCropItem} onClose={() => {}} title='Редактирование изображения'>
				{currentCropItem && (
					<div className='space-y-4'>
						<div className='relative h-[400px] w-full overflow-hidden rounded-xl bg-black/5'>
							<Cropper
								image={currentCropItem.preview}
								crop={crop}
								zoom={zoom}
								aspect={1}
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
		</div>
	)
}
