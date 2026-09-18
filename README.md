# Blog DataTurismo Brasil

Blog estático em [Astro](https://astro.build) publicado em **https://blog.dataturismobrasil.com.br**.
Independente do site institucional (`dataturismobrasil.com.br`), que não é alterado por este projeto.

- Astro 7 (saída 100% estática) + Content Collections com frontmatter validado (Zod)
- Tailwind CSS 4
- `@astrojs/sitemap` e `@astrojs/rss`
- `satori` para gerar imagens Open Graph 1200×630 no build (artigos sem capa)
- Sem CMS, banco de dados ou login: **publicar = adicionar um `.md` e fazer commit**

---

## Comandos

Requer Node.js 22.12 ou mais recente.

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências (uma vez) |
| `npm run dev` | Servidor local em http://localhost:4321, **com rascunhos** |
| `npm run build` | Verifica tipos/frontmatter e gera o site de produção em `dist/` (**sem rascunhos**) |
| `npm run preview` | Serve o `dist/` gerado |
| `npm run preview:drafts` | Gera o site **incluindo rascunhos** e o serve localmente |

> Os scripts chamam `node node_modules/astro/bin/astro.mjs` em vez de `astro` porque a pasta atual tem `:` no caminho
> (`Identidade:Marca`, que o Finder mostra como `Identidade/Marca`). Esse caractere quebra o `PATH` do npm.
> Na Vercel e em qualquer outra pasta, os scripts funcionam do mesmo jeito.

---

## Estrutura

```
src/
  content/artigos/          ← artigos em Markdown (um arquivo = um artigo)
    imagens/                ← capas e imagens do corpo dos artigos
  content.config.ts         ← schema do frontmatter (validação)
  lib/categorias.ts         ← categorias (nome e descrição)
  lib/site.ts               ← URL, autora, GA4, Instagram etc.
  lib/og.ts                 ← template da imagem OG automática
  pages/
    index.astro             ← /  (listagem, destaque para o mais novo)
    artigos/[slug].astro    ← /artigos/[slug]/
    categorias/[categoria].astro ← /categorias/[categoria]/
    sobre.astro             ← /sobre/ (bio da autora — E-E-A-T)
    rss.xml.ts              ← /rss.xml (feed completo)
    og/[slug].png.ts        ← imagens OG geradas no build
public/
  logo.svg                  ← logo oficial (branca, fundo transparente)
  favicon.svg               ← gerado a partir da logo oficial, sobre fundo azul-marinho
  robots.txt
```

### Logo

`public/logo.svg` é a logo oficial: **branca, com fundo transparente**, feita para fundo escuro. Por isso ela aparece
sempre sobre o azul-marinho da marca:

- no cabeçalho, dentro de um selo azul-marinho;
- nas imagens OG automáticas (`/og/*.png`), direto sobre o fundo;
- em `/logo.png` (logo do publisher no JSON-LD), gerado no build com fundo azul-marinho;
- em `public/favicon.svg`: a mesma logo sobre um quadrado azul-marinho de cantos arredondados.

Se a logo for trocada de novo, substitua `public/logo.svg` mantendo o nome. Cabeçalho, imagens OG e `/logo.png`
se atualizam no próximo build. O `favicon.svg` é um arquivo à parte: ele embute o desenho da logo e precisa ser
regerado.

---

## Publicar um artigo

1. Crie `src/content/artigos/meu-artigo.md` com o frontmatter:

```yaml
---
title: "Título com a palavra-chave (até ~60 caracteres)"
description: "Resumo de até 155 caracteres — vira meta description e og:description."
slug: "titulo-com-palavra-chave"      # kebab-case, sem acentos → URL /artigos/titulo-com-palavra-chave/
pubDate: 2026-09-17
updatedDate: 2026-09-20               # opcional
category: "observatorio-e-dados"      # ver lista abaixo
tags: ["tag 1", "tag 2"]
image: "./imagens/minha-capa.png"     # opcional; ideal 1200×630
imageAlt: "Descrição da capa"         # obrigatório se houver image
draft: false                          # true = não publica nem entra no sitemap/RSS
---
```

2. Faça commit e push. A Vercel publica sozinha em 1 a 2 minutos.

**Categorias válidas:** `plano-diretor-de-turismo`, `observatorio-e-dados`, `icms-turistico`,
`legislacao-do-turismo`, `mapa-do-turismo`. Outro valor faz o build falhar, de propósito.
A página `/categorias/[categoria]/` só é gerada quando a categoria tem pelo menos um artigo publicado.

**Capa / og:image:** se o artigo tiver `image`, ela vira a capa e a og:image (recortada em 1200×630).
Se não tiver, o build gera uma imagem OG automática com o título, a identidade visual e a logo. Nenhum artigo fica sem og:image.

Títulos acima de 60 caracteres ou descrições acima de 155 geram um **aviso** `[SEO]` no terminal. O build não é bloqueado.

### Adicionar uma imagem no corpo do artigo

1. Salve o arquivo (JPG, PNG ou WebP) em **`src/content/artigos/imagens/`**, por exemplo
   `src/content/artigos/imagens/observatorio-painel.jpg`. Use nome sem espaços e sem acentos.
2. No ponto do texto em que a imagem deve aparecer, em uma linha própria (com linha em branco antes e depois), escreva:

```markdown
![Painel de indicadores turísticos municipais](./imagens/observatorio-painel.jpg)
```

O texto entre colchetes é o **alt** (descrição para acessibilidade e Google) e é obrigatório.
O caminho começa com `./imagens/` porque é relativo ao arquivo `.md`.
O Astro otimiza a imagem sozinho (WebP, dimensões e `loading="lazy"`), então não é preciso redimensionar antes.
Fotos de até ~2500 px de largura são suficientes.

Legenda opcional: coloque uma linha em itálico logo abaixo da imagem:

```markdown
![Apresentação de indicadores a gestores municipais](./imagens/comtur.jpg)
*Apresentação de indicadores ao COMTUR.*
```

Nos artigos de estreia, os comentários `<!-- IMAGEM opcional: … -->` marcam onde uma foto pode entrar no futuro.
Eles não aparecem na página publicada. Para usar um desses pontos, escreva a linha `![alt](./imagens/arquivo.jpg)`
logo abaixo do comentário (ou no lugar dele), aproveitando o "Alt" sugerido.

### Rascunhos e pré-visualização

- `draft: true` → o artigo **não** é gerado no build de produção e não entra em sitemap, RSS, home nem categorias.
- Para ver rascunhos localmente:
  - `npm run dev`: abre http://localhost:4321 com os rascunhos visíveis e marcados como "Rascunho";
  - ou `npm run preview:drafts`: build completo com rascunhos, servido em http://localhost:4321.
- Na pré-visualização, a página do rascunho mostra uma faixa amarela e leva `noindex`.
- Para publicar: faça a revisão final, mude para `draft: false`, faça commit e push.

Os dois artigos de estreia estão na versão final, ainda com `draft: true`: basta mudar para `draft: false` quando
decidir publicar.

---

## SEO implementado

- `<title>`, meta description e `<link rel="canonical">` absolutos e únicos por página
- Open Graph completo (`og:type=article`, `og:locale=pt_BR`, `og:image` 1200×630, `article:published_time`/`modified_time`,
  seção e tags) + Twitter `summary_large_image`
- JSON-LD `Article` (autora `Person` Ana Raquel de Almeida Dias, publisher `Organization` DataTurismo Brasil) + `BreadcrumbList`;
  `Blog` na home, `CollectionPage` nas categorias, `ProfilePage` em /sobre/
- Um único `<h1>` por página; byline "Por Ana Raquel de Almeida Dias" → `/sobre/` em todo artigo
- `sitemap-index.xml`, `robots.txt` liberado, feed `rss.xml` com o texto integral
- Google Analytics GA4 `G-5W9FNNV8TK`: a tag gtag é carregada após o `load` da página para não pesar no desempenho
- Lighthouse (mobile, pré-visualização local): home 100/100/100/100. Artigo com Performance 98, Acessibilidade 100 e
  Boas práticas 100. O SEO do artigo só chega a 100 depois de publicado, porque rascunhos levam `noindex` de propósito.

---

## Deploy (passo a passo)

1. **GitHub + Vercel**
   - Crie um repositório no GitHub (ex.: `blog-dataturismo`) e envie esta pasta:
     ```bash
     git init && git add . && git commit -m "Blog DataTurismo Brasil"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/blog-dataturismo.git
     git push -u origin main
     ```
   - Na Vercel: **Add New → Project → Import** o repositório. Framework preset: **Astro**. Mantenha os comandos padrão
     (Build: `npm run build`, Output: `dist`). Clique em **Deploy**.
2. **Domínio na Vercel:** em **Settings → Domains**, adicione `blog.dataturismobrasil.com.br`.
3. **DNS no Cloudflare:** em **DNS → Records → Add record**:
   - Tipo `CNAME` · Nome `blog` · Destino `cname.vercel-dns.com`
   - Proxy status: **DNS only (nuvem cinza)**. Não use a nuvem laranja, porque ela conflita com o certificado HTTPS da Vercel.
4. **Propagação e HTTPS:** aguarde a Vercel mostrar o domínio como *Valid Configuration* (de minutos a algumas horas).
   Abra https://blog.dataturismobrasil.com.br e confirme o cadeado.
5. **Google Search Console:** adicione a propriedade `https://blog.dataturismobrasil.com.br` (prefixo de URL) ou use a
   propriedade de domínio já existente. Em **Sitemaps**, envie `sitemap-index.xml`.
6. **LinkedIn:** teste a URL de um artigo publicado em https://www.linkedin.com/post-inspector/ e confira título,
   descrição e imagem do card.

---

## Observações técnicas

- `npm audit` aponta um alerta moderado no `fflate` (dependência do `satori`), ligado à leitura de arquivos ZIP malformados.
  O `satori` roda apenas no build, com dados do próprio projeto, então não há exposição no site publicado.
- Dependências além das exigidas pela especificação: `sharp` (converte o SVG do satori em PNG e a logo em PNG),
  `@fontsource/work-sans` e `@fontsource/source-serif-4` (fontes auto-hospedadas, sem requisição ao Google Fonts, melhor para
  desempenho e LGPD, e usadas também pelo satori), `@astrojs/check` e `typescript` (validação no build).
