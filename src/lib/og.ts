import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

/**
 * Gera imagens Open Graph 1200×630 no build (satori → SVG → PNG via sharp),
 * no mesmo padrão visual das capas: fundo azul-marinho, faixa verde, título em branco.
 * Usada para artigos sem `image` e para as páginas gerais do blog.
 */

const MARINHO = '#0f263f';
const VERDE = '#3fb279';

const fontes = (() => {
  const dir = path.resolve('node_modules/@fontsource/work-sans/files');
  return Promise.all([
    fs.readFile(path.join(dir, 'work-sans-latin-400-normal.woff')),
    fs.readFile(path.join(dir, 'work-sans-latin-700-normal.woff')),
  ]);
})();

async function logoDataUri(): Promise<string> {
  const svg = await fs.readFile(path.resolve('public/logo.svg'));
  return `data:image/svg+xml;base64,${svg.toString('base64')}`;
}

type No = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): No => ({
  type,
  props: { style, children, ...extra },
});

export async function gerarImagemOG({ titulo, subtitulo }: { titulo: string; subtitulo?: string }): Promise<Buffer> {
  const [regular, bold] = await fontes;
  const tamanho = titulo.length > 70 ? 52 : titulo.length > 45 ? 60 : 70;

  const arvore = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 84px',
      backgroundColor: MARINHO,
      backgroundImage: 'linear-gradient(135deg, #0f263f 0%, #133152 100%)',
      fontFamily: 'Work Sans',
      color: '#ffffff',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: 20 }, [
        h('div', { width: 48, height: 4, backgroundColor: VERDE }),
        h('div', { fontSize: 24, letterSpacing: 6, color: VERDE }, 'BLOG DATATURISMO BRASIL'),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }, [
        h('div', { fontSize: tamanho, fontWeight: 700, lineHeight: 1.12 }, titulo),
        ...(subtitulo ? [h('div', { fontSize: 28, color: '#c9d6e3', lineHeight: 1.35 }, subtitulo)] : []),
      ]),
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        h('div', { fontSize: 24, color: '#9fb3c8' }, 'blog.dataturismobrasil.com.br'),
        // A logo oficial é branca: vai direto sobre o fundo azul-marinho.
        h('img', { width: 150, height: 150 }, undefined, { src: await logoDataUri(), width: 150, height: 150 }),
      ]),
    ],
  );

  const svg = await satori(arvore as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Work Sans', data: regular, weight: 400, style: 'normal' },
      { name: 'Work Sans', data: bold, weight: 700, style: 'normal' },
    ],
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export function respostaPNG(png: Buffer): Response {
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
