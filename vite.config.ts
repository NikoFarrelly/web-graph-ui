import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'WebGraphUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `web-graph-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-force-graph-3d'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-force-graph-3d': 'ForceGraph3D',
        },
      },
    },
  },
});
