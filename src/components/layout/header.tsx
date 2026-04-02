'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

import { Menu, Moon, ShoppingBag, Sun, User, X } from 'lucide-react'

import { useCart } from '@/api/hooks/cart/useCart'
import { useMe } from '@/api/hooks/user/useUser'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils/cn'
import { getMediaSource } from '@/lib/utils/get-media-source'

export function Header() {
	const { isAuthenticated, isAdmin } = useAuth()
	const { data: me } = useMe()
	const { data: cart } = useCart()
	const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const navLinks = [
		{ href: ROUTES.CATALOG, label: t('nav.catalog') },
		{ href: ROUTES.COSMETOLOGISTS, label: t('nav.education') },
		{ href: ROUTES.ABOUT, label: t('nav.about') },
		{ href: ROUTES.CONTACTS, label: t('nav.contacts') },
	]

	return (
		<header className='bg-background/80 border-border sticky top-0 z-40 border-b backdrop-blur-md'>
			<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
				{/* Logo */}
				<Link href={ROUTES.HOME} className='text-foreground text-xl font-bold tracking-tight'>
					Arannati
				</Link>

				{/* Desktop nav */}
				<nav className='hidden items-center gap-6 md:flex'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
						>
							{link.label}
						</Link>
					))}
					{isAdmin && (
						<Link
							href={ROUTES.ADMIN.ROOT}
							className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
						>
							{t('nav.admin')}
						</Link>
					)}
				</nav>

				{/* Actions */}
				<div className='flex items-center gap-3'>
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
						aria-label='Переключить тему'
					>
						{mounted &&
							(resolvedTheme === 'dark' ? (
								<Sun className='h-4 w-4' />
							) : (
								<Moon className='h-4 w-4' />
							))}
					</Button>

					<Link href={ROUTES.CART} className='relative'>
						<Button variant='ghost' size='icon-sm' aria-label={t('nav.cart')}>
							<ShoppingBag className='h-4 w-4' />
						</Button>
						{cartCount > 0 && (
							<span className='bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none font-bold text-white'>
								{cartCount > 99 ? '99+' : cartCount}
							</span>
						)}
					</Link>

					<Link
						href={isAuthenticated ? ROUTES.ACCOUNT.ROOT : ROUTES.AUTH.LOGIN}
						aria-label={t('nav.account')}
					>
						{me?.avatar ? (
							<div className='border-border relative h-8 w-8 overflow-hidden rounded-full border'>
								<Image
									src={getMediaSource(me.avatar)}
									alt={me.name ?? 'Аватар'}
									fill
									sizes='32px'
									className='object-cover'
								/>
							</div>
						) : isAuthenticated ? (
							<div className='bg-primary flex h-8 w-8 items-center justify-center rounded-full'>
								<span className='text-xs font-semibold text-white'>
									{me?.name?.charAt(0).toUpperCase() ?? '?'}
								</span>
							</div>
						) : (
							<Button variant='ghost' size='icon-sm'>
								<User className='h-4 w-4' />
							</Button>
						)}
					</Link>

					{/* Mobile menu toggle */}
					<Button
						variant='ghost'
						size='icon-sm'
						className='md:hidden'
						onClick={() => setMobileOpen((v) => !v)}
						aria-label='Меню'
					>
						{mobileOpen ? <X className='h-4 w-4' /> : <Menu className='h-4 w-4' />}
					</Button>
				</div>
			</div>

			{/* Mobile nav */}
			{mobileOpen && (
				<div className='bg-background border-border border-t px-4 py-4 md:hidden'>
					<nav className='flex flex-col gap-1'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileOpen(false)}
								className={cn(
									'text-foreground hover:bg-muted rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
								)}
							>
								{link.label}
							</Link>
						))}
						{isAdmin && (
							<Link
								href={ROUTES.ADMIN.ROOT}
								onClick={() => setMobileOpen(false)}
								className='text-foreground hover:bg-muted rounded-xl px-3 py-2.5 text-sm font-medium transition-colors'
							>
								{t('nav.admin')}
							</Link>
						)}
					</nav>
				</div>
			)}
		</header>
	)
}
