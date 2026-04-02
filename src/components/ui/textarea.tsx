import { type TextareaHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	error?: string
	hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, label, error, hint, id, ...props }, ref) => {
		const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

		return (
			<div className='flex w-full flex-col gap-1.5'>
				{label && (
					<label htmlFor={textareaId} className='text-foreground text-sm leading-none font-medium'>
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={textareaId}
					className={cn(
						'border-border bg-surface text-foreground placeholder:text-muted-foreground min-h-[100px] w-full resize-y rounded-xl border px-3 py-2.5 text-sm transition-colors outline-none',
						'focus:border-primary focus:ring-primary/20 focus:ring-2',
						error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
						'disabled:cursor-not-allowed disabled:opacity-50',
						className,
					)}
					{...props}
				/>
				{error && <p className='text-xs text-red-500'>{error}</p>}
				{hint && !error && <p className='text-muted-foreground text-xs'>{hint}</p>}
			</div>
		)
	},
)

Textarea.displayName = 'Textarea'

export { Textarea }
