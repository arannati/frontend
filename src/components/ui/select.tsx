import { type SelectHTMLAttributes, forwardRef } from 'react'

import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string
	error?: string
	options: { value: string; label: string }[]
	placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className, label, error, options, placeholder, id, ...props }, ref) => {
		const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

		return (
			<div className='flex w-full flex-col gap-1.5'>
				{label && (
					<label htmlFor={selectId} className='text-foreground text-sm leading-none font-medium'>
						{label}
					</label>
				)}
				<div className='relative'>
					<select
						ref={ref}
						id={selectId}
						className={cn(
							'border-border bg-surface text-foreground h-10 w-full appearance-none rounded-xl border px-3 pr-9 text-sm transition-colors outline-none',
							'focus:border-primary focus:ring-primary/20 focus:ring-2',
							error && 'border-red-500',
							'disabled:cursor-not-allowed disabled:opacity-50',
							className,
						)}
						{...props}
					>
						{placeholder && (
							<option value='' disabled>
								{placeholder}
							</option>
						)}
						{options.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
					<ChevronDown className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
				</div>
				{error && <p className='text-xs text-red-500'>{error}</p>}
			</div>
		)
	},
)

Select.displayName = 'Select'

export { Select }
