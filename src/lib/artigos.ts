import { getCollection, type CollectionEntry } from 'astro:content';

export type Artigo = CollectionEntry<'artigos'>;

/**
 * Rascunhos (`draft: true`) aparecem apenas em `npm run dev`
 * ou em builds com SHOW_DRAFTS=true (pré-visualização local).
 * Em produção, nunca são gerados nem entram no sitemap/RSS.
 */
export const MOSTRAR_RASCUNHOS = import.meta.env.DEV || process.env.SHOW_DRAFTS === 'true';

export async function getArtigos(): Promise<Artigo[]> {
  const artigos = await getCollection('artigos', ({ data }) => MOSTRAR_RASCUNHOS || !data.draft);
  for (const { id, data } of artigos) avisarLimitesSEO(id, data.title, data.description);
  return artigos.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

const avisados = new Set<string>();
/** Aviso (não bloqueia o build) quando título/descrição passam dos limites recomendados para o Google. */
function avisarLimitesSEO(id: string, title: string, description: string) {
  if (avisados.has(id)) return;
  avisados.add(id);
  const t = [...title].length;
  const d = [...description].length;
  if (t > 60) console.warn(`[SEO] ${id}: title com ${t} caracteres (recomendado: até 60).`);
  if (d > 155) console.warn(`[SEO] ${id}: description com ${d} caracteres (recomendado: até 155).`);
}

const fmt = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function formatarData(data: Date): string {
  return fmt.format(data);
}

export function tempoDeLeitura(texto = ''): number {
  const palavras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palavras / 200));
}
