'use client'

import { useCallback, useEffect, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { getMediaSource } from '@/lib/utils/get-media-source'

interface ProductGalleryProps {
	images: string[]
	alt: string
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [lightboxIndex, setLightboxIndex] = useState(0)

	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

	const onSelect = useCallback(() => {
		if (!emblaApi) return
		setSelectedIndex(emblaApi.selectedScrollSnap())
	}, [emblaApi])

	useEffect(() => {
		if (!emblaApi) return
		emblaApi.on('select', onSelect)
		return () => {
			emblaApi.off('select', onSelect)
		}
	}, [emblaApi, onSelect])

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
	const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

	const openLightbox = (index: number) => {
		setLightboxIndex(index)
		setLightboxOpen(true)
	}

	const lightboxPrev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length)
	const lightboxNext = () => setLightboxIndex((i) => (i + 1) % images.length)

	useEffect(() => {
		if (!lightboxOpen) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setLightboxOpen(false)
			if (e.key === 'ArrowLeft') lightboxPrev()
			if (e.key === 'ArrowRight') lightboxNext()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [lightboxOpen, lightboxIndex])

	if (!images.length) return <div className='bg-muted aspect-square rounded-2xl' />

	return (
		<>
			{/* Carousel */}
			<div className='flex flex-col gap-3'>
				<div className='relative overflow-hidden rounded-2xl'>
					<div ref={emblaRef} className='overflow-hidden'>
						<div className='flex'>
							{images.map((img, i) => (
								<div
									key={i}
									className='relative aspect-square w-full shrink-0 cursor-zoom-in'
									onClick={() => openLightbox(i)}
								>
									<ImageWithFallback
										src={getMediaSource(img)}
										alt={`${alt} ${i + 1}`}
										fill
										priority={i === 0}
										sizes='(max-width: 768px) 100vw, 50vw'
										className='object-cover'
									/>
								</div>
							))}
						</div>
					</div>

					{images.length > 1 && (
						<>
							<button
								onClick={scrollPrev}
								className='absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white'
							>
								<ChevronLeft className='h-4 w-4' />
							</button>
							<button
								onClick={scrollNext}
								className='absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white'
							>
								<ChevronRight className='h-4 w-4' />
							</button>

							{/* Dots */}
							<div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5'>
								{images.map((_, i) => (
									<button
										key={i}
										onClick={() => scrollTo(i)}
										className={`h-1.5 rounded-full transition-all ${
											i === selectedIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
										}`}
									/>
								))}
							</div>
						</>
					)}
				</div>

				{/* Thumbnails */}
				{images.length > 1 && (
					<div className='flex gap-2 overflow-x-auto pb-1'>
						{images.map((img, i) => (
							<button
								key={i}
								onClick={() => {
									scrollTo(i)
									setSelectedIndex(i)
								}}
								className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
									i === selectedIndex
										? 'border-primary'
										: 'border-transparent opacity-60 hover:opacity-100'
								}`}
							>
								<ImageWithFallback
									src={getMediaSource(img)}
									alt={`${alt} ${i + 1}`}
									fill
									sizes='64px'
									className='object-cover'
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Lightbox */}
			{lightboxOpen && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/90'
					onClick={() => setLightboxOpen(false)}
				>
					<button
						className='absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20'
						onClick={() => setLightboxOpen(false)}
					>
						<X className='h-5 w-5' />
					</button>

					{images.length > 1 && (
						<>
							<button
								className='absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20'
								onClick={(e) => {
									e.stopPropagation()
									lightboxPrev()
								}}
							>
								<ChevronLeft className='h-5 w-5' />
							</button>
							<button
								className='absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20'
								onClick={(e) => {
									e.stopPropagation()
									lightboxNext()
								}}
							>
								<ChevronRight className='h-5 w-5' />
							</button>
						</>
					)}

					<div
						className='relative h-[80vw] max-h-[80vh] w-[80vw] max-w-[80vh]'
						onClick={(e) => e.stopPropagation()}
					>
						<ImageWithFallback
							src={getMediaSource(images[lightboxIndex])}
							alt={`${alt} ${lightboxIndex + 1}`}
							fill
							sizes='80vw'
							className='object-contain'
						/>
					</div>

					{/* Counter */}
					{images.length > 1 && (
						<p className='absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60'>
							{lightboxIndex + 1} / {images.length}
						</p>
					)}
				</div>
			)}
		</>
	)
}
