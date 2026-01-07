# Templo Batista Bíblico - Jacareí, SP

Site institucional da igreja Templo Batista Bíblico de Jacareí, SP. Uma aplicação web moderna construída com React e TypeScript, oferecendo informações sobre a igreja, recursos para membros e um painel administrativo para gerenciamento de conteúdo.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-cyan)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server ultra-rápido
- **React Router DOM** - Roteamento SPA
- **TanStack React Query** - Gerenciamento de estado do servidor e cache

### Estilização
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI acessíveis e customizáveis
- **Radix UI** - Primitivos de UI sem estilo
- **Lucide React** - Biblioteca de ícones
- **tailwindcss-animate** - Animações para Tailwind

### Backend (Lovable Cloud)
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Edge Functions
  - Storage para arquivos/imagens
  - Autenticação

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **@hookform/resolvers** - Integração Zod + React Hook Form

### Utilitários
- **date-fns** - Manipulação de datas
- **class-variance-authority** - Variantes de componentes
- **clsx / tailwind-merge** - Utilitários para classes CSS
- **Sonner** - Notificações toast
- **Recharts** - Gráficos (se necessário)

---

## 📁 Estrutura de Pastas

```
├── public/                     # Arquivos estáticos públicos
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── assets/                 # Assets estáticos (imagens, etc.)
│   │   └── logo-tbb.jpg        # Logo da igreja
│   │
│   ├── components/             # Componentes React reutilizáveis
│   │   ├── admin/              # Componentes do painel administrativo
│   │   │   ├── AdminConteudos.tsx    # Gerenciamento de conteúdos das páginas
│   │   │   ├── AdminMinisterios.tsx  # Gerenciamento de ministérios
│   │   │   └── AdminPastores.tsx     # Gerenciamento de pastores
│   │   │
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (outros componentes UI)
│   │   │
│   │   ├── EventCard.tsx       # Card de evento
│   │   ├── Footer.tsx          # Rodapé do site
│   │   ├── Header.tsx          # Cabeçalho/navegação
│   │   ├── Layout.tsx          # Layout base das páginas
│   │   ├── LinkCard.tsx        # Card com link
│   │   ├── NavLink.tsx         # Link de navegação
│   │   ├── PaginationControls.tsx  # Controles de paginação
│   │   ├── SearchFilter.tsx    # Filtro de busca com mês/ano
│   │   └── SectionTitle.tsx    # Título de seção estilizado
│   │
│   ├── data/                   # Dados estáticos (JSON)
│   │   ├── agenda.json         # Eventos da agenda
│   │   ├── ebd.json            # Aulas da EBD
│   │   ├── escalas.json        # Escalas de ministérios
│   │   ├── ministerios.json    # Lista de ministérios
│   │   ├── pastores.json       # Dados dos pastores
│   │   └── sermoes.json        # Sermões
│   │
│   ├── hooks/                  # Hooks customizados
│   │   ├── use-mobile.tsx      # Detecção de dispositivo móvel
│   │   ├── use-pagination.ts   # Hook de paginação, busca e filtros
│   │   └── use-toast.ts        # Hook para notificações toast
│   │
│   ├── integrations/           # Integrações externas
│   │   └── supabase/
│   │       ├── client.ts       # Cliente Supabase (auto-gerado)
│   │       └── types.ts        # Tipos TypeScript do banco (auto-gerado)
│   │
│   ├── lib/                    # Utilitários
│   │   └── utils.ts            # Funções utilitárias (cn, etc.)
│   │
│   ├── pages/                  # Páginas da aplicação
│   │   ├── AreaSegura/         # Área administrativa
│   │   │   ├── Admin.tsx       # Painel administrativo
│   │   │   └── Login.tsx       # Página de login
│   │   │
│   │   ├── Home.tsx            # Página inicial
│   │   ├── Igreja.tsx          # Hub da seção "Igreja"
│   │   ├── Localizacao.tsx     # Localização e contato
│   │   ├── Ministerios.tsx     # Lista de ministérios
│   │   ├── Missao.tsx          # Missão da igreja
│   │   ├── NotFound.tsx        # Página 404
│   │   ├── OQueCremos.tsx      # Declaração de fé
│   │   ├── Pastores.tsx        # Equipe pastoral
│   │   ├── QuemSomos.tsx       # Sobre a igreja
│   │   ├── Recursos.tsx        # Sermões, EBD, Agenda
│   │   └── Visao.tsx           # Visão da igreja
│   │
│   ├── types/                  # Definições de tipos
│   │   └── index.ts            # Interfaces TypeScript
│   │
│   ├── App.tsx                 # Componente raiz e rotas
│   ├── index.css               # Estilos globais e variáveis CSS
│   ├── main.tsx                # Entry point da aplicação
│   └── vite-env.d.ts           # Tipos do Vite
│
├── supabase/
│   ├── config.toml             # Configuração do Supabase
│   ├── functions/              # Edge Functions
│   │   └── manage-users/       # Função para gerenciar usuários
│   │       └── index.ts
│   └── migrations/             # Migrações do banco de dados
│
├── .env                        # Variáveis de ambiente (auto-gerado)
├── eslint.config.js            # Configuração do ESLint
├── index.html                  # HTML principal
├── tailwind.config.ts          # Configuração do Tailwind CSS
├── tsconfig.json               # Configuração do TypeScript
└── vite.config.ts              # Configuração do Vite
```

---

## 📄 Páginas do Site

### Públicas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Página inicial com hero, próximos eventos, horários e informações gerais |
| `/igreja` | Igreja | Hub com links para subpáginas institucionais |
| `/igreja/quem-somos` | Quem Somos | História e apresentação da igreja |
| `/igreja/missao` | Missão | Declaração de missão |
| `/igreja/visao` | Visão | Declaração de visão |
| `/igreja/o-que-cremos` | O Que Cremos | Declaração de fé e doutrinas |
| `/igreja/pastores` | Pastores | Equipe pastoral com fotos e biografias |
| `/ministerios` | Ministérios | Lista de ministérios da igreja |
| `/recursos` | Recursos | Sermões, aulas EBD e agenda de eventos |
| `/localizacao` | Localização | Endereço, mapa e formas de contato |

### Área Segura (Admin)

| Rota | Página | Descrição |
|------|--------|-----------|
| `/areasegura/login` | Login | Autenticação de administradores |
| `/areasegura/admin` | Admin | Painel de gerenciamento de conteúdo |

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfis de usuários autenticados |
| `user_roles` | Papéis de usuários (admin, editor) |
| `pastores` | Dados dos pastores |
| `ministerios` | Ministérios da igreja |
| `ministerios_lideres` | Líderes de cada ministério |
| `sermoes` | Sermões com links para YouTube/Spotify |
| `aulas_ebd` | Aulas da Escola Bíblica Dominical |
| `eventos` | Eventos e agenda |
| `conteudos_paginas` | Conteúdos editáveis das páginas institucionais |

### Enums

- `app_role`: `admin`, `editor`
- `ebd_classe`: `Homens`, `Belas`, `Adolescentes`

### Funções do Banco

- `has_role(user_id, role)` - Verifica se usuário tem determinado papel
- `is_admin_or_editor(user_id)` - Verifica se é admin ou editor
- `handle_new_user()` - Trigger para criar perfil ao registrar usuário
- `update_updated_at_column()` - Trigger para atualizar timestamp

---

## 🧩 Tipos TypeScript

```typescript
// src/types/index.ts

interface Sermao {
  id: string;
  titulo: string;
  pregador: string;
  data: string;
  textoBase: string;
  linkYoutube?: string;
  linkSpotify?: string;
}

interface AulaEBD {
  id: string;
  titulo: string;
  professor: string;
  data: string;
  linkPdf: string;
  resumo: string;
  classe: "Homens" | "Belas" | "Adolescentes";
}

interface Evento {
  id: string;
  nome: string;
  data: string;
  horario: string | null;
  descricao: string | null;
  local: string;
}

interface Pastor {
  id: string;
  nome: string;
  funcao: string;
  foto: string;
  bio: string;
}

interface Ministerio {
  id: string;
  nome: string;
  descricao: string;
  descricaoCompleta: string;
  icone: string;
  foto?: string;
  lideres: Lider[];
}
```

---

## 🪝 Hooks Customizados

### `usePagination`

Hook completo para paginação, busca e filtros por data.

```typescript
const {
  currentPage,
  totalPages,
  paginatedData,
  filteredData,
  totalItems,
  goToPage,
  nextPage,
  prevPage,
  hasNextPage,
  hasPrevPage,
} = usePagination({
  data: items,
  itemsPerPage: 10,
  searchFields: ["titulo", "autor"],
  searchQuery: "busca",
  dateField: "data",
  filterMonth: 6,
  filterYear: 2024,
});
```

### `useMobile`

Detecta se o dispositivo é móvel baseado na largura da tela.

### `useToast`

Gerencia notificações toast.

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou bun

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre na pasta
cd <NOME_DO_PROJETO>

# Instale as dependências
npm install
# ou
bun install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
bun dev
```

### Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Visualiza build de produção |
| `npm run lint` | Executa linter |

---

## 🔐 Autenticação e Autorização

O sistema utiliza autenticação via Supabase Auth com:

- Login por email/senha
- Papéis de usuário: `admin` e `editor`
- Row Level Security (RLS) para proteção de dados
- Auto-confirmação de email habilitada

### Acessando o Painel Admin

1. Acesse `/areasegura/login`
2. Faça login com credenciais de admin/editor
3. Será redirecionado para `/areasegura/admin`

### Funcionalidades do Admin

- **Conteúdos**: Editar textos das páginas institucionais
- **Pastores**: Adicionar, editar e remover pastores
- **Ministérios**: Gerenciar ministérios e líderes
- **Sermões**: Cadastrar sermões com links
- **Aulas EBD**: Gerenciar aulas por classe
- **Eventos**: Administrar agenda de eventos

---

## 📱 Responsividade

O site é totalmente responsivo, adaptando-se a:

- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 💻 Desktop (> 1024px)

---

## 🎨 Design System

### Cores (CSS Variables)

```css
--background: /* cor de fundo */
--foreground: /* cor do texto */
--primary: /* cor primária */
--secondary: /* cor secundária */
--muted: /* cor suave */
--accent: /* cor de destaque */
--destructive: /* cor de erro/perigo */
```

### Componentes UI

Todos os componentes seguem o padrão shadcn/ui com suporte a:
- Variantes customizáveis
- Acessibilidade (ARIA)
- Modo claro/escuro
- Animações suaves

---

## 📦 Storage

O projeto utiliza Supabase Storage com o bucket `fotos` (público) para:

- Fotos de pastores
- Imagens de ministérios
- Outros uploads administrativos

---

## 🔗 Links Úteis

- [Documentação do React](https://react.dev)
- [Documentação do Vite](https://vitejs.dev)
- [Documentação do Tailwind CSS](https://tailwindcss.com)
- [Documentação do shadcn/ui](https://ui.shadcn.com)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Lovable](https://docs.lovable.dev)

---

## 📄 Licença

Este projeto é de uso exclusivo do Templo Batista Bíblico - Jacareí, SP.

---

Desenvolvido com ❤️ usando [Lovable](https://lovable.dev)
