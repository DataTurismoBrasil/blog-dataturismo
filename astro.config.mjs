// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://blog.dataturismobrasil.com.br',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    // CSS embutido no HTML: elimina a requisição que bloqueia a renderização (melhor LCP)
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
