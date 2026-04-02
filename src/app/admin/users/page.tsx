'use client'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Download, Users, XCircle } from 'lucide-react'

import { getAllUsers, getRoleUpgradeDocument, reviewRoleUpgrade } from '@/api/requests/user'
import type { AdminUser, RoleUpgradeRequestStatus } from '@/api/requests/user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { queryKeys } from '@/constants/query-keys'
import { cn } from '@/lib/utils/cn'

const ROLE_LABEL: Record<string, string> = {
	USER: 'Покупатель',
	COSMETOLOGIST: 'Косметолог',
	ADMIN: 'Администратор',
}

const ROLE_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning'> = {
	USER: 'secondary',
	COSMETOLOGIST: 'success',
	ADMIN: 'warning',
}

const REQUEST_STATUS_LABEL: Record<RoleUpgradeRequestStatus, string> = {
	PENDING: 'Ожидает',
	APPROVED: 'Одобрено',
	REJECTED: 'Отклонено',
}

const REQUEST_STATUS_VARIANT: Record<
	RoleUpgradeRequestStatus,
	'warning' | 'success' | 'destructive'
> = {
	PENDING: 'warning',
	APPROVED: 'success',
	REJECTED: 'destructive',
}

const FILTER_TABS: { label: string; value: RoleUpgradeRequestStatus | 'ALL' }[] = [
	{ label: 'Все', value: 'ALL' },
	{ label: 'Ожидают', value: 'PENDING' },
	{ label: 'Одобренные', value: 'APPROVED' },
	{ label: 'Отклонённые', value: 'REJECTED' },
]

function UserRow({ user }: { user: AdminUser }) {
	const [expanded, setExpanded] = useState(false)
	const queryClient = useQueryClient()

	const reviewUpgrade = useMutation({
		mutationFn: ({ approved, rejectionReason }: { approved: boolean; rejectionReason?: string }) =>
			reviewRoleUpgrade(user.id, { approved, rejectionReason }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
			// Если одобрили/отклонили свою собственную заявку — обновить роль
			queryClient.invalidateQueries({ queryKey: queryKeys.account })
			queryClient.invalidateQueries({ queryKey: queryKeys.roleUpgrade })
		},
	})

	const downloadDocument = useMutation({
		mutationFn: () => getRoleUpgradeDocument(user.id),
		onSuccess: (blob) => {
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `diploma_${user.id}`
			a.click()
			URL.revokeObjectURL(url)
		},
	})

	const req = user.roleUpgradeRequest

	return (
		<div className='border-border border-b last:border-0'>
			<div
				className='hover:bg-muted/30 grid cursor-pointer grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3'
				onClick={() => setExpanded((v) => !v)}
			>
				<div>
					<p className='text-foreground text-sm font-medium'>
						{user.name ?? user.email ?? user.phone ?? user.id.slice(-8)}
					</p>
					<p className='text-muted-foreground text-xs'>{user.email ?? user.phone}</p>
				</div>
				<div className='flex items-center gap-2'>
					{req && (
						<Badge variant={REQUEST_STATUS_VARIANT[req.status]}>
							{REQUEST_STATUS_LABEL[req.status]}
						</Badge>
					)}
					<Badge variant={ROLE_VARIANT[user.role] ?? 'secondary'}>
						{ROLE_LABEL[user.role] ?? user.role}
					</Badge>
				</div>
				<p className='text-muted-foreground text-xs'>
					{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'}
				</p>
			</div>

			{expanded && (
				<div className='bg-muted/20 px-4 pb-4'>
					<div className='text-muted-foreground mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs'>
						<span>ID: {user.id}</span>
						<span>
							Email: {user.email ? (user.isEmailVerified ? '✓ ' : '✗ ') + user.email : '—'}
						</span>
						<span>
							Телефон: {user.phone ? (user.isPhoneVerified ? '✓ ' : '✗ ') + user.phone : '—'}
						</span>
					</div>

					{req?.rejectionReason && (
						<p className='text-muted-foreground mb-3 text-xs'>
							Причина отказа: {req.rejectionReason}
						</p>
					)}

					<div className='flex flex-wrap gap-2'>
						{req?.status === 'PENDING' && (
							<>
								<Button
									size='sm'
									variant='ghost'
									onClick={() => downloadDocument.mutate()}
									loading={downloadDocument.isPending}
								>
									<Download className='mr-1 h-3 w-3' />
									Документ
								</Button>
								<Button
									size='sm'
									variant='secondary'
									onClick={() => reviewUpgrade.mutate({ approved: true })}
									loading={reviewUpgrade.isPending}
								>
									<CheckCircle className='mr-1 h-3 w-3' />
									Одобрить
								</Button>
								<Button
									size='sm'
									variant='destructive'
									onClick={() =>
										reviewUpgrade.mutate({
											approved: false,
											rejectionReason: 'Документ не подходит',
										})
									}
									loading={reviewUpgrade.isPending}
								>
									<XCircle className='mr-1 h-3 w-3' />
									Отклонить
								</Button>
							</>
						)}

						{user.role === 'COSMETOLOGIST' && (
							<Button
								size='sm'
								variant='destructive'
								onClick={() =>
									reviewUpgrade.mutate({
										approved: false,
										rejectionReason: 'Отозвано администратором',
									})
								}
								loading={reviewUpgrade.isPending}
							>
								<XCircle className='mr-1 h-3 w-3' />
								Отозвать роль
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default function AdminUsersPage() {
	const [filter, setFilter] = useState<RoleUpgradeRequestStatus | 'ALL'>('ALL')

	const filterParam = filter === 'ALL' ? undefined : filter

	const { data, isLoading } = useQuery({
		queryKey: queryKeys.adminUsers(filterParam ? { filterRequestStatus: filterParam } : {}),
		queryFn: () => getAllUsers(filterParam ? { filterRequestStatus: filterParam } : undefined),
	})

	return (
		<div>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-foreground text-2xl font-bold'>Пользователи</h1>
				{data && <p className='text-muted-foreground text-sm'>Всего: {data.total}</p>}
			</div>

			<div className='border-border mb-4 flex w-fit gap-1 rounded-xl border p-1'>
				{FILTER_TABS.map((tab) => (
					<button
						key={tab.value}
						onClick={() => setFilter(tab.value)}
						className={cn(
							'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
							filter === tab.value
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:text-foreground',
						)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='bg-surface border-border rounded-2xl border'>
				{isLoading &&
					Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className='border-border flex gap-4 border-b px-4 py-3 last:border-0'>
							<Skeleton className='h-4 w-36' />
							<Skeleton className='h-4 w-20' />
							<Skeleton className='h-4 w-16' />
						</div>
					))}

				{!isLoading && (!data?.items || data.items.length === 0) && (
					<div className='flex flex-col items-center gap-3 py-12 text-center'>
						<Users className='text-muted-foreground h-10 w-10' />
						<p className='text-muted-foreground text-sm'>Пользователей нет</p>
					</div>
				)}

				{data?.items?.map((user) => (
					<UserRow key={user.id} user={user} />
				))}
			</div>
		</div>
	)
}
