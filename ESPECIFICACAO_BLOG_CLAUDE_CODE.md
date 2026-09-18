# Especificação — Blog DataTurismo Brasil (projeto Astro)

> **Como usar:** crie uma pasta nova (fora do repositório do site atual) contendo APENAS este arquivo e os quatro arquivos dos artigos de estreia (dois `.md` e duas capas `.png` — ver seção 9). Abra o Claude Code nessa pasta e peça: *"Leia ESPECIFICACAO_BLOG_CLAUDE_CODE.md e crie o projeto descrito, do zero, nesta pasta, incorporando os arquivos dos artigos conforme a seção 9."*

---

## 1. Contexto

- O site institucional `dataturismobrasil.com.br` é uma SPA React (gerada no Lovable), hospedada na Vercel. **Não deve ser modificado por este projeto.**
- Este projeto é um **blog independente**, que será publicado em `blog.dataturismobrasil.com.br` (novo projeto na Vercel, DNS via Cloudflare).
- Objetivos: (1) ranquear no Google para buscas de gestores públicos de turismo; (2) gerar cards de compartilhamento perfeitos no LinkedIn (Open Graph completo por artigo).

## 2. Stack obrigatória

- **Astro** (versão estável mais recente), saída **100% estática** (`output: 'static'`).
- Conteúdo via **Content Collections** — artigos em Markdown (`src/content/artigos/`), com schema de frontmatter validado por Zod.
- **Tailwind CSS** para estilo.
- Integrações: `@astrojs/sitemap`, `@astrojs/rss`.
- Sem CMS, sem banco de dados, sem autenticação. Publicar artigo = adicionar arquivo `.md` e fazer commit (deploy automático na Vercel).

## 3. Estrutura de páginas

| Rota | Conteúdo |
|---|---|
| `/` | Listagem de artigos (mais recentes primeiro), com destaque para o mais novo |
| `/artigos/[slug]/` | Página do artigo |
| `/categorias/[categoria]/` | Listagem filtrada por categoria |
| `/sobre/` | Bio curta da autora (ver seção 7 — E-E-A-T) |
| `/rss.xml` | Feed RSS completo |
| `/sitemap-index.xml` | Sitemap automático |
| `robots.txt` | Liberado para todos os crawlers, apontando para o sitemap |

Navegação: link permanente "Site institucional" apontando para `https://dataturismobrasil.com.br` e link para o Instagram `@data_turismo`.

## 4. Frontmatter padrão dos artigos

```yaml
---
title: ""            # máx. ~60 caracteres, contém a palavra-chave alvo
description: ""      # máx. 155 caracteres — vira meta description e og:description
slug: ""             # kebab-case, sem acentos
pubDate: 2026-09-17
updatedDate: 2026-09-17   # opcional
category: ""         # uma das categorias da seção 6
tags: []
image: ""            # caminho da imagem de capa (usada também como og:image)
imageAlt: ""
draft: false         # true = não publica nem entra no sitemap
---
```

## 5. Requisitos de SEO (não negociáveis)

1. `<title>` e `<meta name="description">` **únicos por página**, vindos do frontmatter.
2. `<link rel="canonical">` absoluto em toda página (`https://blog.dataturismobrasil.com.br/...`).
3. **Open Graph completo por artigo**: `og:title`, `og:description`, `og:type=article`, `og:url`, `og:locale=pt_BR`, `og:image` (1200×630), `article:published_time`, `article:modified_time` + tags Twitter equivalentes com `summary_large_image`.
4. **og:image**: se o artigo não tiver imagem própria, gerar automaticamente uma imagem OG 1200×630 no build (template com fundo na identidade visual, título do artigo e logo) usando `satori`/`astro-og-canvas` ou equivalente. Nenhum artigo pode sair sem og:image válida.
5. **JSON-LD** em cada artigo: `Article` (headline, description, datePublished, dateModified, author como `Person` → Ana Raquel de Almeida Dias, publisher como `Organization` → DataTurismo Brasil) + `BreadcrumbList`.
6. HTML semântico: um único `<h1>` por página, hierarquia correta de `<h2>/<h3>`.
7. Imagens via `astro:assets` (otimização e `loading="lazy"` automáticos), sempre com `alt`.
8. Meta de performance: Lighthouse ≥ 95 em Performance e 100 em SEO.
9. Google Analytics: incluir a tag GA4 existente `G-5W9FNNV8TK` (script gtag padrão no `<head>`).

## 6. Categorias iniciais

- `plano-diretor-de-turismo`
- `observatorio-e-dados`
- `icms-turistico`
- `legislacao-do-turismo` (Lei 14.133/2021, LC 1.261/2015, Lei 11.771/2008)
- `mapa-do-turismo`

## 7. Página /sobre (E-E-A-T)

Bio profissional curta da autora com: nome completo, formação (bacharel em Turismo, MBA, mestrado em Inovação Tecnológica em andamento na Unifesp), atuação (fundadora da DataTurismo Brasil, consultora credenciada Sebrae-SP), e link para o site institucional. O Google pondera autoria identificável em conteúdo consultivo — cada artigo deve exibir "Por Ana Raquel de Almeida Dias" linkando para `/sobre/`.

## 8. Identidade visual

- Cores da marca: **verde** e **azul marinho** (não usar azuis claros/vibrantes).
- Logo oficial completa, com o nome "DataTurismo" no centro do mapa (arquivo será fornecido — criar placeholder `public/logo.svg` e indicar onde substituir).
- Tipografia sóbria e institucional; o blog fala com gestores públicos, não com turistas.
- Design limpo, foco em legibilidade de textos longos (largura de linha ~65–75 caracteres, bom contraste).

## 9. Artigos de estreia (já fornecidos — NÃO criar placeholder)

Nesta pasta há quatro arquivos prontos, numerados por artigo:
- **Artigo 1:** `1-artigo-observatorio-ia.md` + capa `1-capa-observatorio.png`;
- **Artigo 2:** `2-artigo-turismo-sem-dados.md` + capa `2-capa-descontinuidade.png`.

Mover os `.md` para `src/content/artigos/`, ajustando o frontmatter apenas se o schema exigir (sem alterar o conteúdo dos textos), e colocar as capas onde o template espera imagens, vinculando cada uma como `image`/og:image do seu artigo. Os artigos contêm comentários HTML `<!-- IMAGEM opcional: ... -->` indicando onde a autora poderá inserir fotos no futuro: preservá-los (não aparecem na página publicada) e incluir no README como adicionar uma imagem no corpo de um artigo (onde salvar o arquivo e qual sintaxe usar). Manter `draft: true`; a autora dá a palavra final antes de publicar. Usar esses artigos para validar template, OG e JSON-LD, e documentar no README como pré-visualizar drafts localmente.

## 10. Deploy (instruções para a autora — incluir no README)

O README do projeto deve conter o passo a passo:
1. Criar repositório no GitHub e conectar como novo projeto na Vercel (framework preset: Astro).
2. Em **Vercel → Settings → Domains**, adicionar `blog.dataturismobrasil.com.br`.
3. No **Cloudflare (DNS)**: criar registro `CNAME` → nome `blog` → destino `cname.vercel-dns.com` → **modo "DNS only" (nuvem cinza)**, para não conflitar com o certificado da Vercel.
4. Verificar propagação e HTTPS.
5. Adicionar a propriedade `blog.dataturismobrasil.com.br` no **Google Search Console** e enviar o sitemap.
6. Testar um artigo no **LinkedIn Post Inspector** (`linkedin.com/post-inspector`) para validar o card.

## 11. Fora de escopo (não fazer)

- Não modificar o site principal.
- Não adicionar comentários, busca interna, newsletter ou CMS nesta fase.
- Não instalar dependências além das listadas sem justificar.

---

### Correções no site principal (tarefa separada — repositório do site atual)

Após o blog, pedir ao Claude Code **no repositório do site principal**:
1. Substituir o `og:image` atual (favicon) por imagem 1200×630 dedicada em `public/og-image.png`.
2. Unificar domínio: redirect 301 de `www.dataturismobrasil.com.br` → `dataturismobrasil.com.br` (configurar na Vercel em Domains) e corrigir as URLs `www.` nas metatags.
3. Adicionar link "Blog" no menu, apontando para `https://blog.dataturismobrasil.com.br`.
