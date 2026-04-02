import Link from 'next/link'

import { BookOpen, Layers, Package, ShoppingCart, Tag, Users } from 'lucide-react'

import { ROUTES } from '@/constants/routes'

const cards = [
	{ title: 'Товары', href: ROUTES.ADMIN.PRODUCTS, icon: Package, color: 'text-blue-500' },
	{ title: 'Категории', href: ROUTES.ADMIN.CATEGORIES, icon: Layers, color: 'text-purple-500' },
	{ title: 'Бренды', href: ROUTES.ADMIN.BRANDS, icon: Tag, color: 'text-green-500' },
	{ title: 'Заказы', href: ROUTES.ADMIN.ORDERS, icon: ShoppingCart, color: 'text-orange-500' },
	{ title: 'Пользователи', href: ROUTES.ADMIN.USERS, icon: Users, color: 'text-pink-500' },
	{ title: 'Обучение', href: ROUTES.ADMIN.EDUCATION, icon: BookOpen, color: 'text-teal-500' },
]

export default function AdminPage() {
	return (
		<div>
			<h1 className='text-foreground mb-6 text-2xl font-bold'>Дашборд</h1>
			<div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
				{cards.map(({ title, href, icon: Icon, color }) => (
					<Link
						key={href}
						href={href}
						className='bg-surface border-border hover:border-primary/50 flex flex-col items-start gap-3 rounded-2xl border p-5 transition-colors'
					>
						<Icon className={`h-6 w-6 ${color}`} />
						<span className='text-foreground font-medium'>{title}</span>
					</Link>
				))}
			</div>
		</div>
	)
}
