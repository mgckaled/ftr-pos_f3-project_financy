# Financy

Aplicação FullStack de gerenciamento de finanças pessoais desenvolvida como desafio da Fase 3 da Pós-Graduação Rocketseat.

## Estrutura do repositório

```
financy/
  backend/    ← API GraphQL (Node.js + Fastify + Prisma + SQLite)
  frontend/   ← Interface web (React + Vite + GraphQL) — em breve
```

---

## Backend

### Stack

- **TypeScript** com ESM nativo (`module: nodenext`)
- **Fastify 5** como servidor HTTP
- **Mercurius** como adaptador GraphQL para Fastify
- **Prisma 7** como ORM com adapter libsql (SQLite puro JS)
- **SQLite** como banco de dados
- **JWT** para autenticação (`jsonwebtoken`)
- **bcrypt** para hash de senhas (`bcryptjs`)

### Pré-requisitos

- Node.js 18+
- pnpm

### Instalação e execução

```bash
cd backend
pnpm install
cp .env.example .env
# Preencha JWT_SECRET e DATABASE_URL no .env
pnpm db:migrate
pnpm dev
```

Servidor disponível em `http://localhost:4000`
GraphiQL disponível em `http://localhost:4000/graphiql`

### Variáveis de ambiente

```env
JWT_SECRET=sua_chave_secreta
DATABASE_URL=file:dev.db
```

### Regras de negócio

- Toda transação e categoria pertence a um usuário (`userId` obrigatório)
- Todos os resolvers de transações e categorias são protegidos por autenticação JWT
- Sem token válido → erro `UNAUTHENTICATED` (401)
- Acesso a recurso de outro usuário → erro `NOT_FOUND` (404) — sem revelar existência
- Senhas armazenadas com hash bcrypt (salt 10)
- JWT com expiração de 7 dias
- Tipo da transação deve ser `"income"` ou `"expense"` — outros valores retornam `BAD_USER_INPUT`
- CORS habilitado para `http://localhost:5173`

---

## Frontend

### Stack obrigatória

- **TypeScript**
- **React**
- **Vite** sem framework
- **GraphQL** para todas as consultas e mutações

### Stack recomendada

- TailwindCSS
- Shadcn/ui
- React Query
- React Hook Form
- Zod

### Páginas

A aplicação possui 6 páginas e 2 modais com formulários (Dialog):

- `/` — Autenticação (alterna entre Login e Cadastro conforme escolha do usuário)
- Dashboard (visão geral das finanças)
- Transações
- Categorias
- Perfil
- Gestão
  - **Modal 1** → Nova transação
  - **Modal 2** → Nova categoria

### Variáveis de ambiente

```env
VITE_BACKEND_URL=
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

- [ ] O usuário pode criar uma conta e fazer login
- [ ] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [ ] Deve ser possível criar uma transação
- [ ] Deve ser possível deletar uma transação
- [ ] Deve ser possível editar uma transação
- [ ] Deve ser possível listar todas as transações
- [ ] Deve ser possível criar uma categoria
- [ ] Deve ser possível deletar uma categoria
- [ ] Deve ser possível editar uma categoria
- [ ] Deve ser possível listar todas as categorias

---

## Checklist de requisitos técnicos — Frontend

- [ ] Aplicação React criada com Vite sem framework
- [ ] GraphQL utilizado para todas as consultas e mutações na API
- [ ] Layout seguindo fielmente o Figma
- [ ] Arquivo `.env.example` com a chave `VITE_BACKEND_URL=`
