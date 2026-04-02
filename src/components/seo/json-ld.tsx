'use client'

import { useEffect } from 'react'

interface JsonLdProps {
	id: string
	data: object
}

export function JsonLd({ id, data }: JsonLdProps) {
	useEffect(() => {
		const existing = document.getElementById(id)
		if (existing) existing.remove()

		const script = document.createElement('script')
		script.id = id
		script.type = 'application/ld+json'
		script.textContent = JSON.stringify(data)
		document.head.appendChild(script)

		return () => {
			document.getElementById(id)?.remove()
		}
	}, [id, data])

	return null
}
