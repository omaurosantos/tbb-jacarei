# Templo Batista Bíblico - Jacareí, SP

Site institucional da igreja Templo Batista Bíblico de Jacareí, SP. Aplicação web moderna construída com React e TypeScript, oferecendo informações sobre a igreja, recursos para membros e um painel administrativo para gerenciamento de conteúdo.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-cyan)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-blue)

> Vai continuar o projeto? Comece pelo [HANDOFF.md](HANDOFF.md): estado atual, decisões e pendências conhecidas.

## 🏗️ Arquitetura

Este projeto utiliza uma arquitetura **monorepo monolítica** com separação lógica entre frontend e backend:

```
tbb-jacarei/
├── apps/
│   ├── frontend/          # React + Vite + TypeScript
│   └── backend/           # Node.js + Express + TypeScript
├── packages/
│   ├── prisma/            # Prisma ORM (schema e migrations)
│   └── shared/            # Tipos e utilitários compartilhados
├── package.json           # Workspace root
└── pnpm-workspace.yaml    # Configuração do workspace
```

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server ultra-rápido
- **React Router DOM** - Roteamento SPA
- **TanStack React Query** - Gerenciamento de estado do servidor e cache
- **shadcn/ui** - Componentes UI acessíveis e customizáveis

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **Zod** - Validação de schemas

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM e migrations
- **Neon** - Hospedagem PostgreSQL (produção)

### Estilização
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Primitivos de UI sem estilo
- **Lucide React** - Biblioteca de ícones

## 📁 Estrutura do Projeto

```
tbb-jacarei/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/        # Componentes React
│   │   │   │   ├── admin/         # Componentes do painel admin
│   │   │   │   └── ui/            # Componentes shadcn/ui
│   │   │   ├── contexts/         # Contexts React (Auth)
│   │   │   ├── hooks/             # Hooks customizados
│   │   │   ├── lib/
│   │   │   │   └── api/           # Cliente HTTP e services
│   │   │   ├── pages/             # Páginas da aplicação
│   │   │   └── ...
│   │   └── package.json
│   │
│   └── backend/
│       ├── src/
│       │   ├── config/            # Configurações (DB, env)
│       │   ├── middleware/       # Auth, error handling
│       │   ├── routes/            # Rotas da API
│       │   ├── services/          # Lógica de negócio
│       │   ├── repositories/      # Acesso a dados (Prisma)
│       │   └── utils/              # Utilitários
│       └── package.json
│
├── packages/
│   ├── prisma/
│   │   ├── schema.prisma          # Schema do banco
│   │   ├── migrations/            # Migrations do Prisma
│   │   ├── seed.ts                # Seed de dados iniciais
│   │   └── package.json
│   │
│   └── shared/
│       ├── src/
│       │   └── index.ts           # Tipos e constantes compartilhados
│       └── package.json
│
├── package.json                   # Root workspace
└── pnpm-workspace.yaml            # Configuração do workspace
```

## 🚀 Como Executar

> O projeto não é mais editado pelo Lovable. Toda a evolução acontece neste repositório (monorepo pnpm com Express + Prisma, sem Supabase). A integração GitHub do projeto no Lovable deve ficar desconectada.

Para rodar tudo com Docker (banco, migrações, seed, backend e frontend), veja o [DOCKER.md](DOCKER.md). Abaixo, o fluxo sem Docker.

### Pré-requisitos

- Node.js 22+
- pnpm 9 (instalado, ou via `npx pnpm@9 <comando>`)
- PostgreSQL 16 acessível em `localhost:5432` (instalado, em Docker com `docker compose up postgres`, ou o pacote npm `embedded-postgres` rodando fora do repositório)

### Instalação

```bash
# Instalar dependências de todos os workspaces
pnpm install

# Configurar variáveis de ambiente (os .env não são versionados)
cp apps/backend/.env.example apps/backend/.env
cp packages/prisma/.env.example packages/prisma/.env
cp apps/frontend/.env.example apps/frontend/.env
# Edite os três: DATABASE_URL, JWT_SECRET e ADMIN_* (senha com 8+ caracteres)

# Gerar o cliente Prisma
pnpm db:generate

# Aplicar as migrações no banco
pnpm db:deploy

# Popular conteúdos iniciais e criar o primeiro admin (idempotente)
pnpm db:seed
```

O seed só cria o que falta: não sobrescreve conteúdos editados pelo painel e só cria o admin se ainda não existir nenhum. Depois, entre em `http://localhost:8080/areasegura/login` com `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

### Desenvolvimento

```bash
# Backend (porta 3000)
pnpm dev:backend

# Frontend (porta 8080), em outro terminal
pnpm dev
```

### Scripts Disponíveis

| Script | Descrição |
|-------|-----------|
| `pnpm dev` | Inicia o frontend em desenvolvimento |
| `pnpm dev:backend` | Inicia o backend em desenvolvimento |
| `pnpm build` | Build do frontend |
| `pnpm build:backend` | Build do backend (tsup, com `shared` embutido) |
| `pnpm lint` | Lint do frontend |
| `pnpm db:generate` | Gera o cliente Prisma |
| `pnpm db:migrate` | Cria/aplica migrações em desenvolvimento (`prisma migrate dev`) |
| `pnpm db:deploy` | Aplica as migrações existentes (`prisma migrate deploy`) |
| `pnpm db:seed` | Popula conteúdos iniciais e cria o primeiro admin |
| `pnpm db:studio` | Abre o Prisma Studio |

## 🔐 Autenticação

O sistema utiliza autenticação JWT manual:

- **Login**: `POST /api/auth/login`
- **Logout**: `POST /api/auth/logout`
- **Verificar usuário**: `GET /api/auth/me`

### Papéis de Usuário

- **admin**: Acesso total ao sistema
- **editor**: Pode criar/editar conteúdo, mas não gerenciar usuários

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual

### Conteúdo
- `GET /api/sermoes` - Listar sermões
- `POST /api/sermoes` - Criar sermão (admin/editor)
- `PUT /api/sermoes/:id` - Atualizar sermão (admin/editor)
- `DELETE /api/sermoes/:id` - Deletar sermão (admin/editor)

- `GET /api/aulas-ebd` - Listar aulas EBD
- `POST /api/aulas-ebd` - Criar aula (admin/editor)
- `PUT /api/aulas-ebd/:id` - Atualizar aula (admin/editor)
- `DELETE /api/aulas-ebd/:id` - Deletar aula (admin/editor)

- `GET /api/eventos` - Listar eventos
- `POST /api/eventos` - Criar evento (admin/editor)
- `PUT /api/eventos/:id` - Atualizar evento (admin/editor)
- `DELETE /api/eventos/:id` - Deletar evento (admin/editor)

- `GET /api/pastores` - Listar pastores
- `POST /api/pastores` - Criar pastor (admin/editor)
- `PUT /api/pastores/:id` - Atualizar pastor (admin/editor)
- `DELETE /api/pastores/:id` - Deletar pastor (admin/editor)

- `GET /api/ministerios` - Listar ministérios
- `POST /api/ministerios` - Criar ministério (admin/editor)
- `PUT /api/ministerios/:id` - Atualizar ministério (admin/editor)
- `DELETE /api/ministerios/:id` - Deletar ministério (admin/editor)

- `GET /api/conteudos` - Listar conteúdos
- `GET /api/conteudos/:pagina` - Obter conteúdo por página
- `PUT /api/conteudos/:pagina` - Atualizar conteúdo (admin/editor)

### Usuários (Admin only)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `PATCH /api/users/:id/role` - Atualizar role
- `DELETE /api/users/:id` - Deletar usuário

### Upload
- `POST /api/upload` - Upload de arquivos (admin/editor)

## 🗄️ Banco de Dados

### Tabelas Principais

- `users` - Usuários do sistema
- `profiles` - Perfis de usuários
- `user_roles` - Papéis de usuários (admin, editor)
- `pastores` - Dados dos pastores
- `ministerios` - Ministérios da igreja
- `ministerios_lideres` - Líderes de cada ministério
- `sermoes` - Sermões com links para YouTube/Spotify
- `aulas_ebd` - Aulas da Escola Bíblica Dominical
- `eventos` - Eventos e agenda
- `conteudos_paginas` - Conteúdos editáveis das páginas institucionais

### Enums

- `AppRole`: `admin`, `editor`
- `EbdClasse`: `Homens`, `Belas`, `Adolescentes`

## 📝 Variáveis de Ambiente

### Frontend (`apps/frontend/.env`)
```env
# Origem do backend, SEM /api (as rotas já começam com /api)
VITE_API_URL=http://localhost:3000
```

### Backend (`apps/backend/.env`)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/tbb_jacarei?schema=public"
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
# Origens liberadas no CORS (separe várias por vírgula)
FRONTEND_URL=http://localhost:8080
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=5242880
```

### Prisma (`packages/prisma/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tbb_jacarei?schema=public"
# Primeiro admin, criado pelo seed só se ainda não existir nenhum admin
ADMIN_EMAIL=voce@exemplo.com
ADMIN_PASSWORD=uma-senha-forte
ADMIN_NOME=Administrador
```

As fotos enviadas pelo painel ficam em `apps/backend/public/uploads/` (fora do git) e são salvas no banco como caminho relativo (`/uploads/arquivo.jpg`); o frontend monta a URL completa a partir de `VITE_API_URL`.

## 📦 Deploy

### Backend
O backend pode ser deployado em plataformas como:
- Railway
- Render
- Fly.io
- Heroku

### Frontend
O frontend pode ser deployado em:
- Vercel
- Netlify
- Cloudflare Pages

### Banco de Dados
- **Neon** (recomendado) - PostgreSQL serverless
- Outros provedores PostgreSQL

## 📄 Licença

Este projeto é de uso exclusivo do Templo Batista Bíblico - Jacareí, SP.
