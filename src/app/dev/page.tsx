'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useTypewriter(text: string, speed: number, enabled: boolean) {
	const [displayed, setDisplayed] = useState('')

	useEffect(() => {
		if (!enabled) {
			setDisplayed('')
			return
		}
		setDisplayed('')
		let i = 0
		const id = setInterval(() => {
			i++
			setDisplayed(text.slice(0, i))
			if (i >= text.length) clearInterval(id)
		}, speed)
		return () => clearInterval(id)
	}, [text, speed, enabled])

	return { displayed, done: enabled && displayed.length === text.length }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECH_GROUPS = [
	{
		label: 'Frontend',
		color: '#38bdf8',
		techs: [
			{ name: 'TypeScript', icon: '/technologies/typescript-official-svgrepo-com.svg' },
			{ name: 'JavaScript', icon: '/technologies/javascript-logo-svgrepo-com.svg' },
			{ name: 'React', icon: '/technologies/react-svgrepo-com.svg' },
			{ name: 'Next.js', icon: '/technologies/nextjs-light.svg' },
			{ name: 'Redux', icon: '/technologies/redux-svgrepo-com.svg' },
		],
	},
	{
		label: 'Backend',
		color: '#a78bfa',
		techs: [
			{ name: 'Node.js', icon: '/technologies/node-js-svgrepo-com.svg' },
			{ name: 'NestJS', icon: '/technologies/nestjs-svgrepo-com.svg' },
			{ name: 'Bun', icon: '/technologies/bun-logo.svg' },
			{ name: 'Go', icon: '/technologies/go-svgrepo-com.svg' },
			{ name: 'npm', icon: '/technologies/npm.svg' },
		],
	},
	{
		label: 'Data',
		color: '#34d399',
		techs: [
			{ name: 'PostgreSQL', icon: '/technologies/postgresql-svgrepo-com.svg' },
			{ name: 'Redis', icon: '/technologies/redis-svgrepo-com.svg' },
			{ name: 'MongoDB', icon: '/technologies/mongodb-svgrepo-com.svg' },
			{ name: 'Prisma', icon: '/technologies/prismaorm-logo.svg'},
			{ name: 'Drizzle', icon: '/technologies/drizzleorm-logo.svg'}
		],
	},
	{
		label: 'Infrastructure',
		color: '#fb923c',
		techs: [
			{ name: 'Docker', icon: '/technologies/docker-svgrepo-com.svg' },
			{ name: 'Kubernetes', icon: '/technologies/kubernetes-svgrepo-com.svg' },
			{ name: 'RabbitMQ', icon: '/technologies/rabbitmq-icon-svgrepo-com.svg' },
			{ name: 'Amazon S3', icon: '/technologies/Amazon-S3-Logo.svg' },
			{ name: 'Protobuf', icon: '/technologies/protobuf-logo.svg' },
		],
	},
	{
		label: 'Observability',
		color: '#f472b6',
		techs: [
			{ name: 'Prometheus', icon: '/technologies/prometheus-svgrepo-com.svg' },
			{ name: 'Grafana', icon: '/technologies/grafana-svgrepo-com.svg' },
			{ name: 'Loki', icon: '/technologies/grafana-loki.svg' },
			{ name: 'Jaeger', icon: '/technologies/jaegertracingio-icon.svg' },
		],
	},
	{
		label: 'Testing & automation',
		color: '#ffdd00',
		techs: [
			{ name: 'Jest', icon: '/technologies/jest-svgrepo-com.svg' },
			{ name: 'Playwright', icon: '/technologies/playwright-logo.svg' },
		]
	},
]

const STATS = [
	{ value: 100, suffix: '+', label: 'компонентов', sub: 'UI и бизнес-логика' },
	{ value: 19, suffix: '', label: 'микросервисов', sub: 'независимая архитектура' },
	{ value: 25, suffix: '+', label: 'технологий', sub: 'в стеке проекта' },
	{ value: 3, suffix: '', label: 'деплоя', sub: 'независимый CI/CD' },
]

const CONTACTS = [
	{
		label: 'GitHub',
		value: 'github.com/cclxxi',
		href: 'https://github.com/cclxxi',
		color: '#e2e8f0',
	},
	{
		label: 'Telegram',
		value: 't.me/ilia_proshin',
		href: 'https://t.me/ilia_proshin',
		color: '#38bdf8',
	},
	{
		label: 'Email',
		value: 'ilia.proshin.dev@gmail.com',
		href: 'mailto:ilia.proshin.dev@gmail.com',
		color: '#a78bfa',
	},
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
	const ref = useRef<HTMLSpanElement>(null)
	const inView = useInView(ref, { once: true })
	const motionVal = useMotionValue(0)
	const spring = useSpring(motionVal, { damping: 25, stiffness: 80 })
	const [display, setDisplay] = useState(0)

	useEffect(() => {
		if (inView) motionVal.set(target)
	}, [inView, target, motionVal])

	useEffect(() => spring.on('change', (v) => setDisplay(Math.round(v))), [spring])

	return (
		<span ref={ref}>
			{display}
			{suffix}
		</span>
	)
}

function StatCard({
	value,
	suffix,
	label,
	sub,
	index,
}: {
	value: number
	suffix: string
	label: string
	sub: string
	index: number
}) {
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { once: true, margin: '-40px' })

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 30 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className='group rounded-2xl p-6 text-center transition-all duration-300'
			style={{
				background: 'rgba(255,255,255,0.03)',
				border: '1px solid rgba(255,255,255,0.07)',
				backdropFilter: 'blur(12px)',
			}}
			whileHover={{
				borderColor: 'rgba(56,189,248,0.3)',
				background: 'rgba(56,189,248,0.04)',
			}}
		>
			<div
				className='mb-1 text-4xl font-black sm:text-5xl'
				style={{
					background: 'linear-gradient(135deg, #38bdf8, #a78bfa)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundClip: 'text',
				}}
			>
				<AnimatedCounter target={value} suffix={suffix} />
			</div>
			<div className='text-sm font-semibold' style={{ color: '#e2e8f0' }}>
				{label}
			</div>
			<div className='mt-1 text-xs' style={{ color: '#475569' }}>
				{sub}
			</div>
		</motion.div>
	)
}

function TechIcon({ name, icon, color }: { name: string; icon: string; color: string }) {
	const [hovered, setHovered] = useState(false)

	return (
		<motion.div
			className='flex flex-col items-center gap-2'
			whileHover={{ scale: 1.12, y: -4 }}
			transition={{ type: 'spring', stiffness: 300, damping: 18 }}
			onHoverStart={() => setHovered(true)}
			onHoverEnd={() => setHovered(false)}
		>
			<div
				className='flex h-14 w-14 items-center justify-center rounded-xl p-3 transition-all duration-300'
				style={{
					background: hovered ? `${color}14` : 'rgba(255,255,255,0.04)',
					border: `1px solid ${hovered ? `${color}55` : 'rgba(255,255,255,0.08)'}`,
					backdropFilter: 'blur(8px)',
					boxShadow: hovered ? `0 0 20px ${color}44, 0 0 40px ${color}18` : 'none',
				}}
			>
				<Image
					src={icon}
					alt={name}
					width={32}
					height={32}
					className='h-full w-full object-contain'
				/>
			</div>
			<span
				className='text-xs transition-opacity duration-200'
				style={{ color: hovered ? color : '#64748b' }}
			>
				{name}
			</span>
		</motion.div>
	)
}

function TechGroup({
	group,
	index,
}: {
	group: (typeof TECH_GROUPS)[0]
	index: number
}) {
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { once: true, margin: '-60px' })

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 40 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.6, delay: index * 0.08 }}
		>
			{/* Group label with line */}
			<div className='mb-6 flex items-center gap-4'>
				<div className='h-px flex-1' style={{ background: `linear-gradient(to right, ${group.color}44, transparent)` }} />
				<span
					className='text-xs tracking-[0.25em] uppercase'
					style={{ color: group.color }}
				>
					{group.label}
				</span>
				<div className='h-px flex-1' style={{ background: `linear-gradient(to left, ${group.color}44, transparent)` }} />
			</div>

			{/* Icons */}
			<div className='flex flex-wrap justify-center gap-5'>
				{group.techs.map((tech, i) => (
					<motion.div
						key={tech.name}
						initial={{ opacity: 0, scale: 0.7 }}
						animate={inView ? { opacity: 1, scale: 1 } : {}}
						transition={{ duration: 0.35, delay: index * 0.08 + i * 0.07 }}
					>
						<TechIcon {...tech} color={group.color} />
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}

function SectionHeading({ code, title }: { code: string; title: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className='mb-2 text-center'
		>
			<span className='mb-3 block text-xs tracking-[0.3em] uppercase' style={{ color: '#38bdf8' }}>
				{code}
			</span>
			<h2 className='text-3xl font-black sm:text-4xl' style={{ color: '#e2e8f0' }}>
				{title}
			</h2>
		</motion.div>
	)
}

function ContactCard({
	label,
	value,
	href,
	color,
	index,
}: {
	label: string
	value: string
	href: string
	color: string
	index: number
}) {
	const [hovered, setHovered] = useState(false)

	return (
		<motion.div
			initial={{ opacity: 0, x: -30 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
		>
			<a
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				className='flex items-center justify-between rounded-2xl px-6 py-5 transition-all duration-300'
				style={{
					background: hovered ? `${color}08` : 'rgba(255,255,255,0.03)',
					border: `1px solid ${hovered ? `${color}40` : 'rgba(255,255,255,0.07)'}`,
					backdropFilter: 'blur(12px)',
					boxShadow: hovered ? `0 0 30px ${color}18` : 'none',
					textDecoration: 'none',
				}}
			>
				<div className='flex items-center gap-4'>
					<span className='w-20 text-xs tracking-widest uppercase' style={{ color: '#475569' }}>
						{label}
					</span>
					<span
						className='text-sm font-medium transition-colors duration-200'
						style={{ color: hovered ? color : '#94a3b8' }}
					>
						{value}
					</span>
				</div>
				<motion.span
					animate={{ x: hovered ? 4 : 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					style={{ color: hovered ? color : '#334155' }}
				>
					→
				</motion.span>
			</a>
		</motion.div>
	)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TITLE = 'Full-Stack Developer'
const SUBTITLE = '// arannati.kz — от идеи до продакшена'

export default function DevPage() {
	const { displayed: titleText, done: titleDone } = useTypewriter(TITLE, 65, true)
	const { displayed: subtitleText } = useTypewriter(SUBTITLE, 32, titleDone)

	return (
		<div
			className='relative min-h-screen overflow-x-hidden'
			style={{ background: '#030712', color: '#e2e8f0' }}
		>
			{/* ── Background grid ── */}
			<div
				className='pointer-events-none fixed inset-0'
				style={{
					backgroundImage: `
						linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px),
						linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px)
					`,
					backgroundSize: '64px 64px',
				}}
			/>

			{/* ── Ambient glow orbs ── */}
			<div className='pointer-events-none fixed inset-0 overflow-hidden'>
				<motion.div
					className='absolute -top-48 -left-48 h-[480px] w-[480px] rounded-full'
					style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)' }}
					animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
					transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
				/>
				<motion.div
					className='absolute top-1/3 -right-64 h-[560px] w-[560px] rounded-full'
					style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12), transparent 70%)' }}
					animate={{ scale: [1, 1.22, 1], opacity: [0.4, 0.75, 0.4] }}
					transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut', delay: 2 }}
				/>
				<motion.div
					className='absolute -bottom-32 left-1/3 h-80 w-80 rounded-full'
					style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.12), transparent 70%)' }}
					animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.65, 0.3] }}
					transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 4 }}
				/>
			</div>

			{/* ══════════════════════════════════════════ HERO */}
			<section className='relative flex min-h-screen flex-col items-center justify-center px-6 text-center'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
					className='max-w-4xl'
				>
					{/* Handle */}
					<motion.p
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.25, duration: 0.5 }}
						className='mb-6 text-sm tracking-[0.35em] uppercase'
						style={{ color: '#38bdf8' }}
					>
						@cclxxi
					</motion.p>

					{/* Typewriter title */}
					<h1
						className='mb-5 min-h-[1.15em] text-5xl font-black leading-none tracking-tight sm:text-7xl lg:text-8xl'
						style={{
							background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}
					>
						{titleText}
						<motion.span
							animate={{ opacity: [1, 0, 1] }}
							transition={{ repeat: Infinity, duration: 1 }}
							style={{ WebkitTextFillColor: '#38bdf8', color: '#38bdf8' }}
						>
							_
						</motion.span>
					</h1>

					{/* Typewriter subtitle */}
					<p className='mb-10 min-h-[1.75rem] text-sm sm:text-base' style={{ color: '#64748b' }}>
						{subtitleText}
						{subtitleText.length > 0 && subtitleText.length < SUBTITLE.length && (
							<motion.span
								animate={{ opacity: [1, 0, 1] }}
								transition={{ repeat: Infinity, duration: 0.7 }}
								style={{ color: '#38bdf8' }}
							>
								|
							</motion.span>
						)}
					</p>

					{/* Tag pills */}
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className='flex flex-wrap justify-center gap-2'
					>
						{['Next.js', 'NestJS', 'Go', 'Kubernetes', 'PostgreSQL'].map((tag) => (
							<span
								key={tag}
								className='rounded-full px-4 py-1.5 text-xs tracking-wider uppercase'
								style={{
									border: '1px solid rgba(56,189,248,0.22)',
									background: 'rgba(56,189,248,0.06)',
									color: '#38bdf8',
									backdropFilter: 'blur(8px)',
								}}
							>
								{tag}
							</span>
						))}
					</motion.div>
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					className='absolute bottom-10 flex flex-col items-center gap-2'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.6 }}
				>
					<span className='text-xs tracking-[0.3em] uppercase' style={{ color: '#334155' }}>
						scroll
					</span>
					<motion.div
						className='h-10 w-px'
						style={{ background: 'linear-gradient(to bottom, transparent, #38bdf8)' }}
						animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
						transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
					/>
				</motion.div>
			</section>

			{/* ══════════════════════════════════════════ STATS */}
			<section className='relative px-6 py-28'>
				<div className='mx-auto max-w-4xl'>
					<SectionHeading code='metrics' title='Цифры проекта' />

					<div className='mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4'>
						{STATS.map((stat, i) => (
							<StatCard key={stat.label} {...stat} index={i} />
						))}
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════ TECH STACK */}
			<section className='relative px-6 py-28'>
				{/* Decorative horizontal line */}
				<div
					className='pointer-events-none absolute inset-x-0 top-0 h-px'
					style={{ background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.2), transparent)' }}
				/>

				<div className='mx-auto max-w-4xl'>
					<SectionHeading code='stack' title='Технологии' />

					<div className='mt-16 space-y-14'>
						{TECH_GROUPS.map((group, i) => (
							<TechGroup key={group.label} group={group} index={i} />
						))}
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════ CONTACTS */}
			<section className='relative px-6 py-28'>
				<div
					className='pointer-events-none absolute inset-x-0 top-0 h-px'
					style={{ background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.2), transparent)' }}
				/>

				<div className='mx-auto max-w-2xl'>
					<SectionHeading code='contact' title='Связаться' />

					<div className='mt-12 space-y-3'>
						{CONTACTS.map((c, i) => (
							<ContactCard key={c.label} {...c} index={i} />
						))}
					</div>

					{/* Back to store */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.5 }}
						className='mt-20 text-center'
					>
						<Link
							href='/'
							className='inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors duration-200'
							style={{ color: '#334155' }}
							onMouseEnter={(e) =>
								(e.currentTarget.style.color = '#38bdf8')
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.color = '#334155')
							}
						>
							<span>←</span>
							<span>вернуться в магазин</span>
						</Link>
					</motion.div>

					{/* Signature */}
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.7 }}
						className='mt-8 text-center text-xs'
						style={{ color: '#1e293b' }}
					>
						built with ❤️ in 2026
					</motion.p>
				</div>
			</section>
		</div>
	)
}
