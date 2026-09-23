// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL / BASE_PATH can be overridden in CI, e.g. to preview on
// https://<user>.github.io/<repo>/ before the custom domain is set up.
const site = process.env.SITE_URL || 'https://erfanbanaei.ir';
const base = process.env.BASE_PATH || '/';
// The bot's local mode builds into a temporary directory, then swaps it in (see bot/app/localgit.py).
const outDir = process.env.OUT_DIR || './dist';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  outDir,
  build: { format: 'directory' },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'fa', locales: { fa: 'fa', en: 'en' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: {
    plugins: [tailwindcss()],
  },
});
