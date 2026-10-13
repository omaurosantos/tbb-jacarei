# Templo Batista Bíblico - Jacareí, SP

Site institucional da igreja Templo Batista Bíblico de Jacareí, SP. Aplicação web moderna construída com React e TypeScript, oferecendo informações sobre a igreja, recursos para membros e um painel administrativo para gerenciamento de conteúdo.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-cyan)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-blue)

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

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm
- PostgreSQL (local ou Neon)

### Instalação

```bash
# Instalar dependências de todos os workspaces
pnpm install

# Gerar cliente Prisma
pnpm db:generate

# Configurar banco de dados
# Copie .env.example para .env e configure DATABASE_URL
cp packages/prisma/.env.example packages/prisma/.env
cp apps/backend/.env.example apps/backend/.env

# Executar migrations
pnpm db:migrate

# Popular dados iniciais (opcional)
pnpm --filter prisma seed
```

### Desenvolvimento

```bash
# Frontend (porta 8080)
pnpm dev

# Backend (porta 3001)
pnpm dev:backend

# Ambos simultaneamente (em terminais separados)
pnpm dev & pnpm dev:backend
```

### Scripts Disponíveis

| Script | Descrição |
|-------|-----------|
| `pnpm dev` | Inicia frontend em desenvolvimento |
| `pnpm dev:backend` | Inicia backend em desenvolvimento |
| `pnpm build` | Build do frontend |
| `pnpm build:backend` | Build do backend |
| `pnpm db:generate` | Gera cliente Prisma |
| `pnpm db:migrate` | Executa migrations |
| `pnpm db:studio` | Abre Prisma Studio |

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
VITE_API_URL=http://localhost:3001
```

### Backend (`apps/backend/.env`)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/tbb_jacarei
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:8080
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=5242880
```

### Prisma (`packages/prisma/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/tbb_jacarei
```

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
