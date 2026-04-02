import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
	return (
		<div className='bg-surface border-border overflow-hidden rounded-2xl border'>
			<Skeleton className='aspect-square w-full rounded-none' />
			<div className='flex flex-col gap-2 p-3'>
				<Skeleton className='h-3 w-16' />
				<Skeleton className='h-4 w-full' />
				<Skeleton className='h-3.5 w-24' />
			</div>
		</div>
	)
}
