<!-- markdownlint-disable -->

# Financy

Aplicação FullStack de gerenciamento de finanças pessoais desenvolvida como desafio de avaliação prática da Pós-Graduação em Engenharia de Software Full Stack da Rocketseat.

O projeto cobre o ciclo completo de desenvolvimento: API GraphQL com autenticação JWT, interface React com Apollo Client, design fiel ao Figma e práticas de qualidade como acessibilidade (WCAG AA), validação robusta com Zod, skeleton loading, error boundaries e code-splitting.

---

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Dashboard com visão geral do saldo, receitas e despesas do mês
- Gestão completa de transações (criar, editar, excluir, listar e filtrar)
- Gestão completa de categorias com ícone e cor personalizáveis
- Página de perfil do usuário
- Notificações de feedback com toasts (Sonner)
- Session timeout automático por inatividade
- Navegação acessível por teclado e compatível com leitores de tela

---

## Stack

### Backend

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Fastify 5 |
| API | GraphQL via Mercurius |
| ORM | Prisma 7 |
| Banco de dados | SQLite |
| Autenticação | JWT + bcryptjs |

### Frontend

| Camada | Tecnologia |
|--------|-----------|
| UI | React 19 + TypeScript |
| Build | Vite (sem framework) |
| API client | Apollo Client (GraphQL) |
| Estilização | TailwindCSS + Shadcn/ui |
| Formulários | React Hook Form + Zod |
| Notificações | Sonner |

---

## Estrutura do repositório

```plaintext
financy/
├── backend/    ← API GraphQL (Fastify + Mercurius + Prisma + SQLite)
└── frontend/   ← Interface web (React + Vite + Apollo Client)
```

---

## Como executar

### Pré-requisitos

- Node.js 20+
- pnpm

### Backend

```bash
cd backend
pnpm install
cp .env.example .env   # preencher JWT_SECRET e DATABASE_URL
pnpm db:migrate
pnpm dev               # http://localhost:4000
```

**Variáveis de ambiente:**

```env
JWT_SECRET=sua_chave_secreta
DATABASE_URL=file:dev.db
```

**Seed (dados de exemplo):**

```bash
# Registre a conta teste@teste.com no app antes de rodar
pnpm db:seed
```

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env   # preencher VITE_BACKEND_URL
pnpm dev               # http://localhost:5173
```

**Variáveis de ambiente:**

```env
VITE_BACKEND_URL=http://localhost:4000/graphql
```

---

## Checklist de funcionalidades — Backend

- [x] O usuário pode criar uma conta e fazer login
- [x] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [x] Deve ser possível criar uma transação
- [x] Deve ser possível deletar uma transação
- [x] Deve ser possível editar uma transação
- [x] Deve ser possível listar todas as transações
- [x] Deve ser possível criar uma categoria
- [x] Deve ser possível deletar uma categoria
- [x] Deve ser possível editar uma categoria
- [x] Deve ser possível listar todas as categorias

---

## Checklist de funcionalidades — Frontend

- [x] O usuário pode criar uma conta e fazer login
- [x] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [x] Deve ser possível criar uma transação
- [x] Deve ser possível deletar uma transação
- [x] Deve ser possível editar uma transação
- [x] Deve ser possível listar todas as transações
- [x] Deve ser possível criar uma categoria
- [x] Deve ser possível deletar uma categoria
- [x] Deve ser possível editar uma categoria
- [x] Deve ser possível listar todas as categorias

---

## Checklist de requisitos técnicos — Frontend

- [x] Aplicação React criada com Vite sem framework
- [x] GraphQL utilizado para todas as consultas e mutações na API
- [x] Layout seguindo fielmente o Figma
- [x] Arquivo `.env.example` com a chave `VITE_BACKEND_URL=`

---

## Decisões técnicas relevantes

- **GraphQL end-to-end:** todas as operações de dados (queries e mutations) trafegam via GraphQL usando Apollo Client no frontend e Mercurius no backend, sem nenhuma chamada REST direta.
- **Autenticação stateless:** o token JWT é armazenado no cliente e injetado automaticamente no header `Authorization` de cada requisição via `SetContextLink` do Apollo.
- **Acessibilidade (WCAG AA):** foco visível em todos os elementos interativos (`focus-visible:ring`), mensagens de erro com `role="alert"`, skip link, navegação por teclado com roving tabindex nos grids de seleção do dialog de categorias.
- **Validação robusta:** schema de senha no cadastro usa `superRefine` do Zod exigindo maiúscula, minúscula, número e caractere especial, além do mínimo de 8 caracteres.
- **Session timeout:** hook `useSessionTimeout` encerra a sessão automaticamente após 30 minutos de inatividade, monitorando eventos de mouse, teclado, clique e scroll.
- **UX de carregamento:** skeleton loaders com `animate-pulse` nas três páginas principais substituem estados genéricos de "Carregando...", mantendo a estrutura visual durante o fetch.
- **Code-splitting:** todas as páginas são carregadas com `React.lazy` + `Suspense`, reduzindo o bundle inicial.
- **Error Boundary:** componente de classe envolve a aplicação inteira, exibindo fallback em caso de erros de renderização não tratados.
- **Debounce:** campo de busca em Transações aplica debounce de 300ms antes de filtrar, evitando re-renders excessivos.
