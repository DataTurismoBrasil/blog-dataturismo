import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { respostaPNG } from '../lib/og';

// Versão PNG de public/logo.svg, usada como logo do publisher no JSON-LD.
// A logo oficial é branca, por isso o fundo é o azul-marinho da marca.
export const GET: APIRoute = async () => {
  const svg = await fs.readFile(path.resolve('public/logo.svg'));
  return respostaPNG(await sharp(svg, { density: 300 }).resize(512, 512, { fit: 'contain', background: '#0f263f' }).flatten({ background: '#0f263f' }).png().toBuffer());
};
