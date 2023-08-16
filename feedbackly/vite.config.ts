import { defineConfig } from 'vite';
import path from 'path';
import { version } from './package.json';

export default defineConfig({
   build: {
      lib: {
         name: 'feedback-ly',
         entry: path.resolve(__dirname, './src/index.ts'),
         formats: ['es'],
         fileName: `feedback-ly@${version}`,
      },
      rollupOptions: {
         output: {
            dir: 'dist',
         },
      },
      minify: true,
      sourcemap: false,
      cssCodeSplit: true,
   },
   css: {
      preprocessorOptions: {
         scss: {
            additionalData: `@import "src/style";`,
         },
      },
   },
});
