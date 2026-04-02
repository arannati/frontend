'use client'

import { useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { useQueryClient } from '@tanstack/react-query'
import { BookOpen, LogOut, Package, Settings, Shield, Star, User } from 'lucide-react'

import { useLogout } from '@/api/hooks/auth/useAuthMutations'
import { useMe } from '@/api/hooks/user/useUser'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { queryKeys } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getMediaSource } from '@/lib/utils/get-media-source'

export default function AccountPage() {
	const queryClient = useQueryClient()
	const { data: user, isLoading } = useMe()
	const { account } = useAuth()
	const logout = useLogout()

	useEffect(() => {
		queryClient.refetchQueries({ queryKey: queryKeys.account })
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	if (isLoading) {
		return (
			<div className='flex flex-col gap-4'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-4 w-32' />
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-6'>
			{/* Profile */}
			<div className='bg-surface border-border rounded-2xl border p-5'>
				<div className='flex items-center gap-4'>
					<div className='relative h-16 w-16 shrink-0'>
						{user?.avatar ? (
							<Image
								src={getMediaSource(user.avatar)}
								alt={user.name ?? 'Аватар'}
								fill
								sizes='64px'
								className='rounded-full object-cover'
							/>
						) : (
							<div className='bg-muted flex h-16 w-16 items-center justify-center rounded-full'>
								<User className='text-muted-foreground h-7 w-7' />
							</div>
						)}
					</div>
					<div className='min-w-0'>
						<p className='text-foreground truncate text-lg font-semibold'>
							{user?.name ?? 'Профиль'}
						</p>
						<p className='text-muted-foreground truncate text-sm'>{user?.email ?? user?.phone}</p>
						{account && (
							<div className='mt-1.5'>
								{account.role === 'ADMIN' ? (
									<Badge variant='destructive' className='gap-1'>
										<Shield className='h-3 w-3' />
										Администратор
									</Badge>
								) : account.role === 'COSMETOLOGIST' ? (
									<Badge variant='default'>Косметолог</Badge>
								) : (
									<Badge variant='secondary'>Покупатель</Badge>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className='flex flex-col gap-2'>
				{[
					{ href: ROUTES.ACCOUNT.ORDERS, icon: Package, label: 'Мои заказы' },
					{ href: ROUTES.ACCOUNT.SETTINGS, icon: Settings, label: 'Настройки' },
					...(account?.role === 'ADMIN'
						? [
								{ href: ROUTES.EDUCATION, icon: BookOpen, label: 'Обучение' },
								{ href: ROUTES.ADMIN.ROOT, icon: Shield, label: 'Панель администратора' },
							]
						: account?.role === 'COSMETOLOGIST'
							? [{ href: ROUTES.EDUCATION, icon: BookOpen, label: 'Обучение' }]
							: [{ href: ROUTES.ACCOUNT.UPGRADE_ROLE, icon: Star, label: 'Стать косметологом' }]),
				].map(({ href, icon: Icon, label }) => (
					<Link
						key={href}
						href={href}
						className='bg-surface border-border hover:border-primary flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors'
					>
						<Icon className='text-primary h-4 w-4' />
						<span className='text-foreground text-sm font-medium'>{label}</span>
					</Link>
				))}
			</nav>

			<Button
				variant='ghost'
				className='text-muted-foreground justify-start gap-3 hover:text-red-500'
				onClick={() => logout.mutate()}
				loading={logout.isPending}
			>
				<LogOut className='h-4 w-4' />
				Выйти
			</Button>
		</div>
	)
}
