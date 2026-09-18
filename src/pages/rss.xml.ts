import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArtigos } from '../lib/artigos';
import { nomeCategoria } from '../lib/categorias';
import { SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const artigos = await getArtigos();
  return rss({
    title: SITE.nome,
    description: SITE.descricao,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    customData: `<language>${SITE.lang}</language>`,
    items: artigos.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.pubDate,
      link: `/artigos/${a.id}/`,
      categories: [nomeCategoria(a.data.category), ...a.data.tags],
      // Feed completo: HTML integral do artigo
      content: a.rendered?.html,
    })),
  });
}
