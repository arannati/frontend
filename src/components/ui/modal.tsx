'use client'

import { useEffect } from 'react'

import { X } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

interface ModalProps {
	open: boolean
	onClose: () => void
	title: string
	children: React.ReactNode
	className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [open, onClose])

	if (!open) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div className='absolute inset-0 bg-black/40' onClick={onClose} />
			<div
				className={cn(
					'bg-surface border-border relative z-10 w-full max-w-sm rounded-2xl border p-6 shadow-xl',
					className,
				)}
			>
				<div className='mb-4 flex items-center justify-between'>
					<h3 className='text-foreground font-semibold'>{title}</h3>
					<button
						type='button'
						onClick={onClose}
						className='text-muted-foreground hover:text-foreground transition-colors'
					>
						<X className='h-4 w-4' />
					</button>
				</div>
				{children}
			</div>
		</div>
	)
}
