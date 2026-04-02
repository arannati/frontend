'use client'

import { useState } from 'react'

import Image, { type ImageProps } from 'next/image'

import { ImageOff } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
	fallbackClassName?: string
}

export function ImageWithFallback({
	className,
	fallbackClassName,
	alt,
	...props
}: ImageWithFallbackProps) {
	const [error, setError] = useState(false)

	if (error) {
		return (
			<div
				className={cn('bg-muted flex items-center justify-center', fallbackClassName ?? className)}
			>
				<ImageOff className='text-muted-foreground h-6 w-6' />
			</div>
		)
	}

	return <Image className={className} alt={alt} onError={() => setError(true)} {...props} />
}
