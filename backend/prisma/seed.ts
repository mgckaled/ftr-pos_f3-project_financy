import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaLibSql({
  url: process.env["DATABASE_URL"] ?? "file:dev.db",
});
const prisma = new PrismaClient({ adapter });

// ── Dados ──────────────────────────────────────────────────────────────────

const USER_EMAIL = "marcelgckaled@gmail.com";

const CATEGORIES = [
  { name: "Alimentação", description: "Restaurantes, mercado e delivery", icon: "utensils", color: "orange" },
  { name: "Transporte", description: "Combustível, Uber e transporte público", icon: "car", color: "blue" },
  { name: "Moradia", description: "Aluguel, condomínio e contas", icon: "home", color: "purple" },
  { name: "Saúde", description: "Consultas, remédios e planos", icon: "heart", color: "red" },
  { name: "Lazer", description: "Cinema, jogos e entretenimento", icon: "gift", color: "pink" },
  { name: "Educação", description: "Cursos, livros e assinaturas", icon: "book", color: "green" },
  { name: "Salário", description: "Renda mensal principal", icon: "briefcase", color: "green" },
  { name: "Freelance", description: "Projetos e renda extra", icon: "clipboard", color: "yellow" },
] as const;

const today = new Date();
function daysAgo (n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ── Seed ───────────────────────────────────────────────────────────────────

async function main () {
  console.log("🌱 Iniciando seed...");

  // Busca o usuário existente (sem alterar nome nem senha)
  const user = await prisma.user.findUnique({ where: { email: USER_EMAIL } });
  if (!user) {
    throw new Error(`Usuário ${USER_EMAIL} não encontrado. Faça cadastro antes de rodar o seed.`);
  }
  console.log(`✅ Usuário encontrado: ${user.name} (${user.email})`);

  // Remove dados antigos do usuário para re-seed limpo
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  // Categorias
  const createdCategories = await Promise.all(
    CATEGORIES.map((cat) =>
      prisma.category.create({
        data: { ...cat, userId: user.id },
      })
    )
  );
  console.log(`✅ ${createdCategories.length} categorias criadas`);

  const [alimentacao, transporte, moradia, saude, lazer, educacao, salario, freelance] =
    createdCategories;

  // Transações (mix de entradas e saídas)
  const transactions = [
    // Receitas
    { title: "Salário março", amount: 6500, type: "income", categoryId: salario.id, createdAt: daysAgo(1) },
    { title: "Projeto React", amount: 2200, type: "income", categoryId: freelance.id, createdAt: daysAgo(5) },
    { title: "Salário fev.", amount: 6500, type: "income", categoryId: salario.id, createdAt: daysAgo(32) },
    { title: "Freela logo", amount: 800, type: "income", categoryId: freelance.id, createdAt: daysAgo(40) },
    // Despesas
    { title: "Aluguel", amount: 1800, type: "expense", categoryId: moradia.id, createdAt: daysAgo(2) },
    { title: "Supermercado", amount: 380, type: "expense", categoryId: alimentacao.id, createdAt: daysAgo(3) },
    { title: "iFood semana", amount: 95, type: "expense", categoryId: alimentacao.id, createdAt: daysAgo(4) },
    { title: "Uber semanal", amount: 72, type: "expense", categoryId: transporte.id, createdAt: daysAgo(5) },
    { title: "Academia", amount: 120, type: "expense", categoryId: saude.id, createdAt: daysAgo(6) },
    { title: "Netflix", amount: 55, type: "expense", categoryId: lazer.id, createdAt: daysAgo(7) },
    { title: "Curso TypeScript", amount: 290, type: "expense", categoryId: educacao.id, createdAt: daysAgo(8) },
    { title: "Farmácia", amount: 68, type: "expense", categoryId: saude.id, createdAt: daysAgo(9) },
    { title: "Gasolina", amount: 200, type: "expense", categoryId: transporte.id, createdAt: daysAgo(10) },
    { title: "Cinema", amount: 48, type: "expense", categoryId: lazer.id, createdAt: daysAgo(12) },
    { title: "Conta de luz", amount: 180, type: "expense", categoryId: moradia.id, createdAt: daysAgo(14) },
    { title: "Jantar fora", amount: 142, type: "expense", categoryId: alimentacao.id, createdAt: daysAgo(16) },
    { title: "Spotify", amount: 22, type: "expense", categoryId: lazer.id, createdAt: daysAgo(18) },
    { title: "Livro Prisma", amount: 65, type: "expense", categoryId: educacao.id, createdAt: daysAgo(20) },
    { title: "Mercado fev.", amount: 420, type: "expense", categoryId: alimentacao.id, createdAt: daysAgo(35) },
    { title: "Aluguel fev.", amount: 1800, type: "expense", categoryId: moradia.id, createdAt: daysAgo(36) },
  ];

  await prisma.transaction.createMany({
    data: transactions.map((t) => ({ ...t, userId: user.id })),
  });
  console.log(`✅ ${transactions.length} transações criadas`);
  console.log("\n🎉 Seed concluído!");
}

main()
  .catch((e) => { console.error(e); })
  .finally(() => prisma.$disconnect());
