import { defineConfig } from 'orval'

export default defineConfig({
	arannati: {
		input: {
			target: process.env.ORVAL_API_URL ?? 'http://localhost:4000/openapi.yaml'
		},
		output: {
			target: './src/api/generated/client.ts',
			schemas: './src/api/generated',
			mode: 'split',
			client: 'axios',
			override: {
				mutator: {
					path: './src/api/instance.ts',
					name: 'customInstance'
				}
			}
		}
	}
})
