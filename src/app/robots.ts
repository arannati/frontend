import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin/', '/account/', '/checkout/', '/cart'],
		},
		sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arannati.com'}/sitemap.xml`,
	}
}
