# Mazola Effect

Página web minimalista que abre a câmera do celular com filtro negativo em tempo real, ideal para visualizar quadros pintados em negativo — o visitante vê a pintura "revelada" ao apontar a câmera para o quadro.

## Como usar (visitante)

1. Abra o link da GitHub Pages no celular (Chrome ou Safari).
2. Toque em **Iniciar câmera** e autorize o acesso.
3. Aponte a câmera para o quadro pintado em negativo.
4. As cores serão invertidas em tempo real, revelando a pintura original.

> Funciona melhor em conexão HTTPS (GitHub Pages já é HTTPS) e em navegadores modernos.

## Recursos

- Abre a câmera traseira por padrão (troca para a frontal com um toque)
- Filtro `invert(1) + hue-rotate(180deg)` aplicado em tempo real
- Switch para ligar/desligar o filtro
- Layout fullscreen compatível com iPhone notch
- Tratamento de erros localizado em PT-BR (permissão negada, câmera em uso, etc.)

## Desenvolvimento

```bash
bun install
bun run dev
```

Abra http://localhost:3000 no navegador.

### Build estático (GitHub Pages)

```bash
GH_PAGES=true bunx next build
```

Os arquivos estáticos são gerados em `./out`.

## Deploy

O deploy é automático via GitHub Actions ao fazer `push` na branch `main`.
Após o primeiro push, habilite o GitHub Pages em:

> Settings → Pages → Source: **GitHub Actions**

## Stack

- Next.js 16 (App Router) com `output: 'export'`
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Sem backend, sem banco de dados, sem armazenamento — 100% client-side

## Licença

MIT
