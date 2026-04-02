import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
	{
		variants: {
			variant: {
				primary: 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]',
				secondary:
					'bg-surface text-foreground border border-border hover:bg-border active:scale-[0.98]',
				ghost: 'hover:bg-muted text-foreground active:scale-[0.98]',
				outline:
					'border border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98]',
				destructive: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
				link: 'text-primary underline-offset-4 hover:underline rounded-none',
			},
			size: {
				sm: 'text-sm px-3 py-1.5 h-8',
				md: 'text-sm px-5 py-2.5 h-10',
				lg: 'text-base px-7 py-3 h-12',
				xl: 'text-base px-9 py-4 h-14',
				icon: 'h-10 w-10',
				'icon-sm': 'h-8 w-8',
				'icon-lg': 'h-12 w-12',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	},
)

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, loading, disabled, children, ...props }, ref) => {
		const isIcon = size?.startsWith('icon')

		return (
			<button
				ref={ref}
				className={cn(buttonVariants({ variant, size }), className)}
				disabled={disabled || loading}
				{...props}
			>
				{loading && (
					<span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
				)}
				{(!loading || !isIcon) && children}
			</button>
		)
	},
)

Button.displayName = 'Button'

export { Button, buttonVariants }
