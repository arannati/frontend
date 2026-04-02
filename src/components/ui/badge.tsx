import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
	'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-primary/10 text-primary',
				secondary: 'bg-muted text-muted-foreground',
				accent: 'bg-accent/20 text-accent',
				destructive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
				success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
				warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
				outline: 'border border-border text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
