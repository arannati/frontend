'use client'

import { useEffect, useRef, useState } from 'react'

interface HashSectionProps {
	id: string
	children: React.ReactNode
	className?: string
}

export function HashSection({ id, children, className = '' }: HashSectionProps) {
	const [highlighted, setHighlighted] = useState(false)
	const ref = useRef<HTMLElement>(null)

	useEffect(() => {
		function check() {
			if (window.location.hash === `#${id}`) {
				setHighlighted(true)
				const timer = setTimeout(() => setHighlighted(false), 2500)
				return () => clearTimeout(timer)
			}
		}

		check()
		window.addEventListener('hashchange', check)
		return () => window.removeEventListener('hashchange', check)
	}, [id])

	return (
		<section
			ref={ref}
			id={id}
			className={`-mx-4 rounded-xl p-4 transition-colors duration-700 ${highlighted ? 'bg-primary/10' : ''} ${className}`}
		>
			{children}
		</section>
	)
}
