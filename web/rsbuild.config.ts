import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack';

export default defineConfig({
	html: {
		title: 'Wllama',
		favicon: 'http://localhost:5187/web/icons/aiomni.svg',
	},
	output: {
		assetPrefix: '/web',
		distPath: {
			root: './dist',
		},
	},
	tools: {
		rspack: {
			plugins: [UnoCSSRspackPlugin()],
		},
	},
	plugins: [pluginReact()],
});
