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
}

export default nextConfig
