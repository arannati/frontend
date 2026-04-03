import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	turbopack: {
		root: path.resolve(__dirname),
	},
        images: {
                remotePatterns: [
                        {
                                protocol: 'https',
                                hostname: 'media.arannati.kz',
                        },
                        {
                                protocol: 'http',
                                hostname: 'localhost',
                                port: '9000',
                        },
                ],
        },
        async rewrites() {
                return [
                        {
                                source: '/api-upload/:path*',
                                destination: `${process.env.API_BASE_URL || 'https://api.arannati.kz'}/:path*`,
                        },
                ]
        },
}

export default nextConfig
