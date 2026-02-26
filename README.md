<!-- markdownlint-disable -->

# Financy

Aplicação FullStack de gerenciamento de finanças pessoais — Desafio Fase 3, Pós-Graduação Rocketseat.

---

## Estrutura

```plaintext
financy/
  backend/    ← API GraphQL (Fastify + Mercurius + Prisma + SQLite)
  frontend/   ← Interface web (React + Vite + Apollo Client)
```

---

## Backend

**Stack:** TypeScript · Fastify 5 · Mercurius · Prisma 7 · SQLite · JWT · bcryptjs

### Executar

```bash
cd backend
pnpm install
cp .env.example .env   # preencher JWT_SECRET e DATABASE_URL
pnpm db:migrate
pnpm dev               # http://localhost:4000
```

### Variáveis de ambiente

```env
JWT_SECRET=sua_chave_secreta
DATABASE_URL=file:dev.db
```

### Seed (dados de exemplo)

```bash
# Registre a conta teste@teste.com no app antes de rodar
pnpm db:seed
```

---

## Frontend

**Stack:** TypeScript · React 19 · Vite · Apollo Client · TailwindCSS · Shadcn/ui · React Hook Form · Zod

### Executar

```bash
cd frontend
pnpm install
cp .env.example .env   # preencher VITE_BACKEND_URL
pnpm dev               # http://localhost:5173
```

### Variáveis de ambiente

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
