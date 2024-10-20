import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		lib: {
			// Entry point for the library
			entry: './src/index.ts',
			name: '@shuami-dev/nuxt-session-i18n-theme',
			// Generate both ES Module and CommonJS formats
			formats: ['es', 'cjs'],
			// ES module will output as .esm.js, CommonJS as .cjs.js
			fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
		},
		rollupOptions: {
			// Externalize Vue to avoid bundling it
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	},
	plugins: [
		vue(),
		dts({
			// Generate .d.ts files in the dist/types directory
			outputDir: 'dist/types',
			// Ensure type declarations are included
			insertTypesEntry: true
		})
	]
})
