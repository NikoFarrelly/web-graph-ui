import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import dts from 'unplugin-dts/vite';
import {defineConfig} from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    dts({tsconfigPath: './tsconfig.json', bundleTypes: true}),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'WebGraphUI',
      formats: ['es'],
      fileName: format => `web-graph-ui.${format}.js`,
    },
    rolldownOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-force-graph-3d',
        'three-forcegraph',
        '3d-force-graph',
        'three',
        'd3-force-3d',
      ],
      output: {
        format: 'es',
        minifyInternalExports: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-force-graph-3d': 'ForceGraph3D',
        },
      },
    },
  },
});
