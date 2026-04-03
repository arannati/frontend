'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ChevronLeft } from 'lucide-react'
import { ExternalLink, Loader2, Upload, X } from 'lucide-react'

import { CreateContentRequestType } from '@/api/generated'
import { useCreateContent } from '@/api/hooks/education/useEducation'
import { uploadEducationMaterial } from '@/api/requests/education'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ROUTES } from '@/constants/routes'
import { translateError } from '@/lib/utils/error-map'
import { getMediaSource } from '@/lib/utils/get-media-source'

const TYPE_OPTIONS = [
	{ value: CreateContentRequestType.ARTICLE, label: 'Статья' },
	{ value: CreateContentRequestType.VIDEO, label: 'Видео' },
	{ value: CreateContentRequestType.LINK, label: 'Ссылка' },
]

export default function AdminEducationNewPage() {
	const router = useRouter()
	const createContent = useCreateContent()

	const [type, setType] = useState<string>(CreateContentRequestType.ARTICLE)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [body, setBody] = useState('')
	const [url, setUrl] = useState('')
	const [tags, setTags] = useState('')

        const [videoFile, setVideoFile] = useState<File | null>(null)
        const [isUploading, setIsUploading] = useState(false)
        const [uploadProgress, setUploadProgress] = useState(0)

        const handleTypeChange = (newType: string) => {
                setType(newType)
                setUrl('')
                setVideoFile(null)
        }

        const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (!file) return
                setVideoFile(file)
                setUrl(URL.createObjectURL(file))
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()

                let finalUrl = url

                if (type === CreateContentRequestType.VIDEO && videoFile) {
                        setIsUploading(true)
                        setUploadProgress(0)
                        try {
                                const res = await uploadEducationMaterial(videoFile, (progressEvent) => {
                                        if (progressEvent.total) {
                                                setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                                        }
                                })
                                finalUrl = getMediaSource(res.key)
                        } catch (error) {
                                console.error('Failed to upload video', error)
                                setIsUploading(false)
                                return
                        }
                        setIsUploading(false)
                }

                createContent.mutate(
                        {
                                type: type as (typeof CreateContentRequestType)[keyof typeof CreateContentRequestType],
                                title,
                                description: description || '',
                                ...(body && { body }),
                                ...(finalUrl && { url: finalUrl }),
				...(tags && {
					tags: tags
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean),
				}),
			},
			{
				onSuccess: () => router.push(ROUTES.ADMIN.EDUCATION),
			},
		)
	}

	return (
		<div>
			<Link
				href={ROUTES.ADMIN.EDUCATION}
				className='text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 text-sm transition-colors'
			>
				<ChevronLeft className='h-4 w-4' />
				Обучение
			</Link>
			<h1 className='text-foreground mb-6 text-2xl font-bold'>Добавить материал</h1>

			<form onSubmit={handleSubmit} className='flex max-w-2xl flex-col gap-5'>
				<Select
					label='Тип контента'
					options={TYPE_OPTIONS}
					value={type}
					onChange={(e) => handleTypeChange(e.target.value)}
				/>

				<Input
					label='Заголовок'
					placeholder='Название материала'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>

				<Textarea
					label='Описание'
					placeholder='Краткое описание'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={3}
				/>

				{type === CreateContentRequestType.ARTICLE && (
					<Textarea
						label='Текст статьи'
						placeholder='Полный текст материала'
						value={body}
						onChange={(e) => setBody(e.target.value)}
						rows={8}
					/>
				)}

				{type === CreateContentRequestType.VIDEO && (
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Видеофайл</label>
						{!url ? (
							<div className='relative'>
                                                                <input
                                                                        type='file'
                                                                        accept='video/*'
                                                                        onChange={handleVideoSelect}
                                                                        className='absolute inset-0 cursor-pointer opacity-0'
                                                                        disabled={isUploading}
                                                                />
								<div className='border-muted-foreground/25 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:bg-black/5'>
									{isUploading ? (
										<>
											<Loader2 className='mb-2 h-8 w-8 animate-spin text-blue-500' />
											<p className='text-sm text-gray-500'>Загрузка... {uploadProgress}%</p>
										</>
									) : (
										<>
											<Upload className='text-muted-foreground mb-2 h-8 w-8' />
											<p className='text-sm text-gray-500'>
												Нажмите или перетащите файл для загрузки
											</p>
											<p className='mt-1 text-xs text-gray-400'>
												MP4, WEBM, AVI, MKV (макс. 100MB)
											</p>
										</>
									)}
								</div>
							</div>
						) : (
							<div className='bg-muted/30 flex items-center justify-between rounded-lg border p-3'>
								<div className='flex items-center gap-3 overflow-hidden'>
									<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-100'>
										<Upload className='h-5 w-5 text-blue-600' />
									</div>
                                                                        <div className='flex flex-col overflow-hidden'>
                                                                                <span className='truncate text-sm font-medium'>
                                                                                        {videoFile ? 'Видео выбрано' : 'Видео загружено'}
                                                                                </span>
                                                                                <span className='truncate text-xs text-gray-500'>
                                                                                        {videoFile ? videoFile.name : url}
                                                                                </span>
                                                                        </div>
								</div>
								<div className='flex items-center gap-2'>
									<Link href={url} target='_blank'>
										<Button type='button' variant='ghost' size='icon' className='h-8 w-8'>
											<ExternalLink className='h-4 w-4' />
										</Button>
									</Link>
                                                                        <Button
                                                                                type='button'
                                                                                variant='ghost'
                                                                                size='icon'
                                                                                onClick={() => {
                                                                                        setUrl('')
                                                                                        setVideoFile(null)
                                                                                }}
                                                                                className='h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600'
                                                                        >
										<X className='h-4 w-4' />
									</Button>
								</div>
							</div>
						)}
					</div>
				)}

				{type === CreateContentRequestType.LINK && (
					<Input
						label='URL'
						placeholder='https://...'
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						type='url'
					/>
				)}

				<Input
					label='Теги (через запятую)'
					placeholder='косметология, уход, кожа'
					value={tags}
					onChange={(e) => setTags(e.target.value)}
				/>

				{createContent.error && (
					<p className='text-sm text-red-500'>
						{translateError((createContent.error as any)?.response?.data?.message)}
					</p>
				)}

                                <div className='flex gap-3'>
                                        <Button
                                                type='submit'
                                                loading={createContent.isPending || isUploading}
                                                disabled={
                                                        !title.trim() || isUploading || (type === CreateContentRequestType.VIDEO && !url)
                                                }
                                        >
                                                {isUploading ? `Загрузка... ${uploadProgress}%` : 'Создать'}
                                        </Button>
					<Button
						type='button'
						variant='secondary'
						onClick={() => router.push(ROUTES.ADMIN.EDUCATION)}
					>
						Отмена
					</Button>
				</div>
			</form>
		</div>
	)
}
