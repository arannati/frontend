'use client'

import { useEffect } from 'react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
	BookOpen,
	Layers,
	LayoutDashboard,
	LogOut,
	Package,
	ShoppingCart,
	Tag,
	Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

const navItems = [
	{ href: ROUTES.ADMIN.ROOT, label: 'Дашборд', icon: LayoutDashboard, exact: true },
	{ href: ROUTES.ADMIN.PRODUCTS, label: 'Товары', icon: Package },
	{ href: ROUTES.ADMIN.CATEGORIES, label: 'Категории', icon: Layers },
	{ href: ROUTES.ADMIN.BRANDS, label: 'Бренды', icon: Tag },
	{ href: ROUTES.ADMIN.ORDERS, label: 'Заказы', icon: ShoppingCart },
	{ href: ROUTES.ADMIN.USERS, label: 'Пользователи', icon: Users },
	{ href: ROUTES.ADMIN.EDUCATION, label: 'Обучение', icon: BookOpen },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const router = useRouter()
	const { isAdmin, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading && !isAdmin) {
			router.replace(ROUTES.AUTH.LOGIN)
		}
	}, [isLoading, isAdmin, router])

	if (isLoading) return null
	if (!isAdmin) return null

	return (
		<div className='flex min-h-screen'>
			{/* Sidebar */}
			<aside className='bg-surface border-border hidden w-60 shrink-0 flex-col border-r lg:flex'>
				<div className='border-border flex h-16 items-center border-b px-6'>
					<Link href={ROUTES.HOME} className='text-foreground text-lg font-bold tracking-tight'>
						Arannati
					</Link>
					<span className='bg-primary/10 text-primary ml-2 rounded px-1.5 py-0.5 text-xs font-medium'>
						Admin
					</span>
				</div>

				<nav className='flex flex-1 flex-col gap-1 p-3'>
					{navItems.map(({ href, label, icon: Icon, exact }) => {
						const isActive = exact ? pathname === href : pathname.startsWith(href)
						return (
							<Link
								key={href}
								href={href}
								className={cn(
									'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
									isActive
										? 'bg-primary text-white'
										: 'text-muted-foreground hover:bg-muted hover:text-foreground',
								)}
							>
								<Icon className='h-4 w-4 shrink-0' />
								{label}
							</Link>
						)
					})}
				</nav>

				<div className='border-border border-t p-3'>
					<Link href={ROUTES.HOME}>
						<Button variant='ghost' size='sm' className='w-full justify-start gap-3'>
							<LogOut className='h-4 w-4' />
							На сайт
						</Button>
					</Link>
				</div>
			</aside>

			{/* Content */}
			<div className='flex flex-1 flex-col overflow-hidden'>
				{/* Mobile top bar */}
				<header className='bg-surface border-border flex h-16 items-center gap-4 border-b px-4 lg:hidden'>
					<Link href={ROUTES.HOME} className='text-foreground font-bold'>
						Arannati Admin
					</Link>
					<nav className='flex gap-1 overflow-x-auto'>
						{navItems.map(({ href, label, exact }) => {
							const isActive = exact ? pathname === href : pathname.startsWith(href)
							return (
								<Link
									key={href}
									href={href}
									className={cn(
										'rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
										isActive ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted',
									)}
								>
									{label}
								</Link>
							)
						})}
					</nav>
				</header>

				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	)
}
