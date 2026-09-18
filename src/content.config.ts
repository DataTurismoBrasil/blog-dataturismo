import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIAS } from './lib/categorias';

const slugs = Object.keys(CATEGORIAS) as [string, ...string[]];

const artigos = defineCollection({
  // O `slug` do frontmatter vira o id da entrada (e a URL /artigos/[slug]/).
  loader: glob({ pattern: '**/*.md', base: './src/content/artigos' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(70, 'Título deve ter no máximo ~60 caracteres'),
        description: z.string().max(160, 'Descrição deve ter no máximo 155 caracteres'),
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug deve ser kebab-case, sem acentos'),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.enum(slugs),
        tags: z.array(z.string()).default([]),
        image: image().optional(),
        imageAlt: z.string().optional(),
        draft: z.boolean().default(false),
      })
      .refine((a) => !a.image || (a.imageAlt && a.imageAlt.trim().length > 0), {
        message: 'Artigos com `image` precisam de `imageAlt`',
        path: ['imageAlt'],
      }),
});

export const collections = { artigos };
