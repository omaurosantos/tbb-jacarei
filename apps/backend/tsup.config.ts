import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  // shared é distribuído como TypeScript, então precisa ir dentro do bundle
  noExternal: ['shared'],
  sourcemap: true,
  clean: true,
});
