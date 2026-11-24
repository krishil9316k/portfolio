// Bundles src/ into public/app.js + public/app.css and copies the page and assets.
import { build } from 'esbuild';
import { mkdirSync, copyFileSync, cpSync, existsSync } from 'node:fs';

mkdirSync('public', { recursive: true });
copyFileSync('index.html', 'public/index.html');
if (existsSync('assets')) cpSync('assets', 'public/assets', { recursive: true });
await build({
  entryPoints: { app: 'src/main.js' },
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2020',
  outdir: 'public',
  legalComments: 'linked',
  logLevel: 'info',
});
