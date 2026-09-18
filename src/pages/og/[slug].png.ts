import type { APIRoute, GetStaticPaths } from 'astro';
import { getArtigos } from '../../lib/artigos';
import { gerarImagemOG, respostaPNG } from '../../lib/og';

// Imagem OG automática para artigos SEM `image` no frontmatter, e /og/blog.png para as páginas gerais.
export const getStaticPaths = (async () => {
  const artigos = await getArtigos();
  return [
    { params: { slug: 'blog' }, props: { titulo: 'Gestão pública do turismo com base em dados', subtitulo: 'Plano diretor, observatórios, ICMS Turístico e legislação' } },
    ...artigos
      .filter((a) => !a.data.image)
      .map((a) => ({ params: { slug: a.id }, props: { titulo: a.data.title, subtitulo: undefined } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => respostaPNG(await gerarImagemOG(props as { titulo: string; subtitulo?: string }));
