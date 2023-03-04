import {defineConfig} from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';
import dynamicImport from 'vite-plugin-dynamic-import';
import pluginResolve from 'vite-plugin-resolve';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';
export default defineConfig({
	envPrefix: 'ATACCAMA_',
	define: {
		__VUE_I18N_FULL_INSTALL__: true,
		__VUE_I18N_LEGACY_API__: false,
		__INTLIFY_PROD_DEVTOOLS__: false
	},
	base: process.env.NODE_ENV === 'production' ? '/' : '/',
	resolve: {
		alias: [
			{
				// this is required for the SCSS modules
				// eslint-disable-next-line prefer-named-capture-group
				find: /^~(.*)$/,
				replacement: '$1'
			},
			{
				find: '@',
				replacement: path.join(__dirname, 'src')
			}
		]
	},
	plugins: [
		createVuePlugin(),
		dynamicImport(),
		pluginResolve({}),
		topLevelAwait({
			// The export name of top-level await promise for each chunk module
			promiseExportName: '__tla',
			// The function to generate import names of top-level await promise in each chunk module
			promiseImportName: (i: any) => `__tla_${i}`
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import "./src/styles/variables.scss";'
					+ '@import "./src/styles/splitpane.scss";'
			}
		}
	},
	server: {
		port: 8080
	},
	build: {
		target: 'modules',
		chunkSizeWarningLimit: 600,
		cssCodeSplit: true
	}
});
