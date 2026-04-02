import { type InputHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, label, error, hint, id, ...props }, ref) => {
		const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

		return (
			<div className='flex w-full flex-col gap-1.5'>
				{label && (
					<label htmlFor={inputId} className='text-foreground text-sm leading-none font-medium'>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={cn(
						'border-border bg-surface text-foreground placeholder:text-muted-foreground h-10 w-full rounded-xl border px-3 text-sm transition-colors outline-none',
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

Input.displayName = 'Input'

export { Input }
