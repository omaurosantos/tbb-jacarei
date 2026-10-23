# Handoff — Site TBB Jacareí

Guia para quem vai continuar o projeto. Estado em **13/10/2026**, commit `656dacb` da `main`. O [README.md](README.md) tem a referência completa (stack, endpoints, variáveis); aqui está o que você precisa para entender e mexer no projeto com segurança.

## Em um minuto

- Site institucional do Templo Batista Bíblico de Jacareí: páginas da igreja, recursos (sermões, aulas da EBD, eventos) e um **painel admin** em `/areasegura/admin` para editar o conteúdo.
- Monorepo **pnpm** com 4 pacotes:

  | Pacote | O que é |
  | --- | --- |
  | `apps/frontend` | React 18 + Vite + Tailwind + shadcn/ui |
  | `apps/backend` | Express + Prisma + JWT |
  | `packages/prisma` | Schema, migrations e seed |
  | `packages/shared` | Tipos, enums e rotas da API, usados pelos dois apps |

- **Estado:** roda de ponta a ponta localmente, verificado com banco vazio → migração → seed → CRUD completo pelo painel. **As imagens Docker nunca foram construídas**, então teste `make up` antes do primeiro deploy.
- **Não há deploy em produção** nem testes automatizados.
- O projeto nasceu no **Lovable + Supabase** e foi migrado em jan/2026 para a arquitetura atual. O Lovable **não é mais usado**. Não edite por lá: ele ainda gera código na estrutura antiga.

## Rodando localmente

Com Docker: veja o [DOCKER.md](DOCKER.md). Resumo: `cp .env.example .env`, preencha `JWT_SECRET` e `ADMIN_*`, depois `make up`. O site sobe em `http://localhost`.

Sem Docker: você precisa de Node 22+, pnpm 9 (ou `npx pnpm@9`) e um PostgreSQL em `localhost:5432`.

```bash
pnpm install
cp apps/backend/.env.example apps/backend/.env       # DATABASE_URL, JWT_SECRET
cp packages/prisma/.env.example packages/prisma/.env # DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD (8+)
cp apps/frontend/.env.example apps/frontend/.env     # VITE_API_URL=http://localhost:3000
pnpm db:generate && pnpm db:deploy && pnpm db:seed
pnpm dev:backend   # API em :3000
pnpm dev           # site em :8080 (outro terminal)
```

Entre no painel em `http://localhost:8080/areasegura/login` com o `ADMIN_EMAIL` e a `ADMIN_PASSWORD` que você definiu.

**Dados de demonstração (opcional):** o banco novo começa vazio. Para encher o site com pastores, ministérios, sermões, aulas e eventos **fictícios** (datas relativas a hoje), rode `pnpm db:seed:demo`. Para apagar só o que ele criou, `pnpm db:unseed:demo` (todos os ids começam com `demo-`; o que foi cadastrado pelo painel não é tocado). Não rode em produção real.

> **Dica (Windows):** sem Postgres instalado, o pacote npm `embedded-postgres` resolve. Rode-o numa pasta fora do repo e inicialize com `initdbFlags: ['--encoding=UTF8', '--locale=C']`. O padrão no Windows é WIN1252, que quebra textos com caracteres especiais.

## Como as peças conversam

```
Navegador ──► Frontend (Vite :8080 / nginx :80)
                │  fetch(VITE_API_URL + "/api/...")       ← services em apps/frontend/src/lib/api
                ▼
             Backend Express (:3000)
                │  rotas (validação zod) → repositories → Prisma
                ▼
             PostgreSQL
             + apps/backend/public/uploads  ← fotos, servidas em /uploads/<arquivo>
```

- **Autenticação:** `POST /api/auth/login` devolve um JWT. O frontend guarda em `localStorage` (`auth_token`) e manda como `Authorization: Bearer`. Quem trata isso é o `AuthContext` do frontend e `middleware/auth.ts` (`authenticate` + `authorize(...roles)`) no backend.
- **Papéis:**
  - `admin` faz tudo, inclusive gerenciar usuários;
  - `editor` cria e edita conteúdo, mas não gerencia usuários.
- **Leituras são públicas** (`GET`). Escritas exigem `admin` ou `editor`. `/api/users` é só para `admin`.

## Onde cada página busca o conteúdo

| Página (rota) | Dados | Onde se edita no painel |
| --- | --- | --- |
| Início (`/`) | Próximos eventos; texto `home` (opcional, ver lacunas) | Eventos |
| A Igreja (`/igreja`) | Fixo no código | — |
| Quem Somos, Missão, Visão, O Que Cremos | `conteudos_paginas` (chaves `quem-somos`, `missao`, `visao`, `o-que-cremos`) | Conteúdos (título, subtítulo e texto) |
| Pastores (`/igreja/pastores`) | Pastores ativos; texto `pastores` (opcional) | Pastores |
| Ministérios (`/ministerios`) | Ministérios ativos + líderes | Ministérios |
| Recursos (`/recursos`) | Sermões, aulas da EBD e eventos, com busca, filtro e paginação | Sermões, Aulas EBD, Eventos |
| Localização (`/localizacao`) | Endereço, CEP e mapa fixos no código | — |
| Rodapé | Endereço e Instagram fixos em `components/Footer.tsx` | — |

Quem Somos, Missão, Visão e O Que Cremos têm conteúdo padrão no próprio componente, exibido quando o banco não tem o registro ou o campo correspondente.

## Decisões e convenções que importam

- **`VITE_API_URL` é a origem do backend, sem `/api`** (`http://localhost:3000`). As rotas em `packages/shared` já começam com `/api`. Toda URL de backend sai de `apps/frontend/src/lib/api/config.ts`; não escreva `localhost:3000` em nenhum outro lugar.
- **Fotos são salvas no banco como caminho relativo** (`/uploads/arquivo.png`). Ao exibir, use `resolveAssetUrl(fotoUrl)`. O upload só aceita jpg/png/webp/gif (até 5 MB) e a extensão do arquivo salvo vem do tipo, não do nome enviado.
- **`packages/shared` é distribuído como TypeScript.** O backend é empacotado com **tsup**, que embute o `shared` no `dist/index.js`, e o `tsc` serve só para typecheck. Se o backend em produção reclamar de import de `shared`, a causa costuma ser essa configuração em `apps/backend/tsup.config.ts`.
- **O seed é idempotente e roda em todo deploy** (o serviço `prisma-migrate` do compose):
  - cria os conteúdos que faltam, sem sobrescrever o que foi editado no painel;
  - cria o primeiro admin a partir de `ADMIN_*` só se ainda não existir nenhum admin.
- **Erros da API** sempre retornam `{ error, message }`. Para erros de negócio, lance `new AppError(mensagem, status)` (`apps/backend/src/utils/AppError.ts`). O `errorHandler` já converte validação do zod em 400, registro inexistente do Prisma (P2025) em 404 e erros do multer em 400.
- **E-mails** são normalizados (minúsculas, sem espaços) e buscados sem diferenciar maiúsculas.
- **CORS:** `FRONTEND_URL` aceita várias origens separadas por vírgula. Atrás do nginx na porta 80, a origem é `http://localhost`, sem `:80`.
- **Páginas são carregadas sob demanda** (`React.lazy` em `App.tsx`). O `ChunkErrorBoundary` recarrega a página uma vez se um chunk sumir depois de um deploy.

## Tarefas comuns

**Mudar o banco (novo campo ou tabela)**
1. Edite `packages/prisma/schema.prisma`.
2. Rode `pnpm db:migrate` (pede um nome e gera a pasta em `packages/prisma/migrations/`). Versione essa pasta.
3. Atualize o tipo em `packages/shared/src/index.ts`, o schema zod da rota em `apps/backend/src/routes/` e o formulário do painel.
4. Em produção, a migração é aplicada por `pnpm db:deploy` (o compose já faz isso).

**Novo endpoint:** crie a rota em `apps/backend/src/routes/` (zod para validar, `authenticate` + `authorize` para proteger) e o repository em `repositories/`. Registre a rota em `src/index.ts`, adicione o caminho em `API_ROUTES` (`packages/shared`) e o service em `apps/frontend/src/lib/api/services/`.

**Nova página:** crie o componente em `apps/frontend/src/pages/` e registre a rota com `lazy(...)` em `App.tsx`. Para o texto ser editável, use uma chave nova em `conteudos_paginas`, inclua no `seed.ts` e no `paginasInfo` de `components/admin/AdminConteudos.tsx`.

**Antes de abrir um PR**
```bash
pnpm --filter backend typecheck && pnpm build:backend && pnpm lint && pnpm build
```

## Lacunas e pendências conhecidas

| Item | Detalhe |
| --- | --- |
| Docker nunca testado | Rode `make up` numa máquina com Docker antes do deploy. Em arquiteturas sem binário pronto (ex.: Mac M1), o `bcrypt` pode precisar de `apk add python3 make g++` no Dockerfile do backend |
| Sem deploy | O README sugere opções (Neon para o banco; Render/Railway/Fly para o backend; Vercel/Netlify para o frontend). Nada foi configurado |
| Textos `home` e `pastores` | O site lê essas chaves, mas o seed não as cria e o painel só edita chaves que já existem. Hoje aparecem os textos padrão do código |
| Itens extras não editáveis | Os itens da Missão, os pilares da Visão e as crenças de O Que Cremos ficam em `conteudoExtra` (JSON). O painel edita só título, subtítulo e texto principal |
| Conteúdo fixo no código | A página A Igreja (só cartões de navegação) e o texto de apresentação do rodapé. Endereço, telefone, e-mail, Instagram, horários e mapa agora são editáveis em Conteúdos → Contato e Localização (chave `contato`) |
| Dados antigos | Pastores, ministérios, sermões e eventos da época do Supabase não foram migrados. O banco novo começa vazio, exceto pelos 4 textos institucionais |
| Sem testes automatizados | A verificação até aqui foi manual, por scripts e pelo navegador |
| React Query sem uso | `@tanstack/react-query` está instalado e com provider, mas as páginas buscam dados com `useEffect` e os services |
| Lovable | Desconectar a integração GitHub no projeto do Lovable (Settings → GitHub) |
| Avisos de lint | 8 avisos `react-refresh/only-export-components` em componentes shadcn e no `AuthContext`. São inofensivos |

## Histórico recente

| PR | O que fez |
| --- | --- |
| #1 | Migração do Lovable/Supabase para Express + Prisma + Docker (jan/2026) |
| #2 | Correções para o site rodar de ponta a ponta: build do backend, migration inicial, seed com admin, `/api` duplicado, imagens do upload, status HTTP de erro, lint, code-splitting e documentação |
| #3 | Normalização de e-mail e extensão do upload derivada do tipo do arquivo |
