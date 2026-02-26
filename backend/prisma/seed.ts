import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaLibSql({
  url: process.env["DATABASE_URL"] ?? "file:dev.db",
});
const prisma = new PrismaClient({ adapter });

// ── Dados ──────────────────────────────────────────────────────────────────

const USER_EMAIL = "teste@teste.com";

const CATEGORIES = [
  { name: "Alimentação",   description: "Restaurantes, mercado e delivery",        icon: "utensils",    color: "orange" },
  { name: "Transporte",    description: "Combustível, Uber e transporte público",   icon: "car",         color: "blue"   },
  { name: "Moradia",       description: "Aluguel, condomínio e contas",             icon: "home",        color: "purple" },
  { name: "Saúde",         description: "Consultas, remédios e planos de saúde",    icon: "heart",       color: "red"    },
  { name: "Lazer",         description: "Cinema, jogos e entretenimento",           icon: "gift",        color: "pink"   },
  { name: "Educação",      description: "Cursos, livros e assinaturas",             icon: "book",        color: "green"  },
  { name: "Salário",       description: "Renda mensal principal",                   icon: "briefcase",   color: "green"  },
  { name: "Freelance",     description: "Projetos e renda extra",                   icon: "clipboard",   color: "yellow" },
  { name: "Vestuário",     description: "Roupas, calçados e acessórios",            icon: "bag",      color: "pink"  },
  { name: "Investimentos", description: "Aportes em renda fixa e variável",         icon: "piggybank", color: "green"  },
] as const;

const today = new Date();
function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ── Seed ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Iniciando seed...");

  const user = await prisma.user.findUnique({ where: { email: USER_EMAIL } });
  if (!user) {
    throw new Error(`Usuário ${USER_EMAIL} não encontrado. Faça o cadastro antes de rodar o seed.`);
  }
  console.log(`✅ Usuário encontrado: ${user.name} (${user.email})`);

  // Limpa dados anteriores
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  // Categorias
  const created = await Promise.all(
    CATEGORIES.map((cat) => prisma.category.create({ data: { ...cat, userId: user.id } }))
  );
  console.log(`✅ ${created.length} categorias criadas`);

  const [alimentacao, transporte, moradia, saude, lazer, educacao, salario, freelance, vestuario, investimentos] = created;

  // Transações — 3 meses de histórico
  const transactions = [
    // ── Mês atual ──
    { title: "Salário",                   amount: 7200,  type: "income",  categoryId: salario.id,        createdAt: daysAgo(1)  },
    { title: "Projeto app mobile",        amount: 3500,  type: "income",  categoryId: freelance.id,      createdAt: daysAgo(4)  },
    { title: "Consultoria design",        amount: 1200,  type: "income",  categoryId: freelance.id,      createdAt: daysAgo(8)  },
    { title: "Dividendos",                amount: 430,   type: "income",  categoryId: investimentos.id,  createdAt: daysAgo(10) },
    { title: "Aluguel",                   amount: 2100,  type: "expense", categoryId: moradia.id,        createdAt: daysAgo(2)  },
    { title: "Supermercado",              amount: 480,   type: "expense", categoryId: alimentacao.id,    createdAt: daysAgo(3)  },
    { title: "iFood",                     amount: 87,    type: "expense", categoryId: alimentacao.id,    createdAt: daysAgo(5)  },
    { title: "Gasolina",                  amount: 230,   type: "expense", categoryId: transporte.id,     createdAt: daysAgo(6)  },
    { title: "Uber",                      amount: 64,    type: "expense", categoryId: transporte.id,     createdAt: daysAgo(7)  },
    { title: "Plano de saúde",            amount: 320,   type: "expense", categoryId: saude.id,          createdAt: daysAgo(7)  },
    { title: "Academia",                  amount: 140,   type: "expense", categoryId: saude.id,          createdAt: daysAgo(8)  },
    { title: "Netflix",                   amount: 55,    type: "expense", categoryId: lazer.id,          createdAt: daysAgo(9)  },
    { title: "Spotify",                   amount: 22,    type: "expense", categoryId: lazer.id,          createdAt: daysAgo(9)  },
    { title: "Curso Node.js",             amount: 349,   type: "expense", categoryId: educacao.id,       createdAt: daysAgo(11) },
    { title: "Conta de luz",              amount: 195,   type: "expense", categoryId: moradia.id,        createdAt: daysAgo(12) },
    { title: "Internet",                  amount: 110,   type: "expense", categoryId: moradia.id,        createdAt: daysAgo(12) },
    { title: "Jantar aniversário",        amount: 210,   type: "expense", categoryId: alimentacao.id,    createdAt: daysAgo(14) },
    { title: "Tênis novo",                amount: 380,   type: "expense", categoryId: vestuario.id,      createdAt: daysAgo(15) },
    { title: "Farmácia",                  amount: 92,    type: "expense", categoryId: saude.id,          createdAt: daysAgo(16) },
    { title: "Aporte Tesouro Direto",     amount: 500,   type: "expense", categoryId: investimentos.id,  createdAt: daysAgo(18) },
    { title: "Livros técnicos",           amount: 148,   type: "expense", categoryId: educacao.id,       createdAt: daysAgo(20) },
    { title: "Show de música",            amount: 160,   type: "expense", categoryId: lazer.id,          createdAt: daysAgo(22) },

    // ── Mês anterior ──
    { title: "Salário",                   amount: 7200,  type: "income",  categoryId: salario.id,        createdAt: daysAgo(32) },
    { title: "Freela site institucional", amount: 2800,  type: "income",  categoryId: freelance.id,      createdAt: daysAgo(38) },
    { title: "Aluguel",                   amount: 2100,  type: "expense", categoryId: moradia.id,        createdAt: daysAgo(33) },
    { title: "Supermercado",              amount: 510,   type: "expense", categoryId: alimentacao.id,    createdAt: daysAgo(34) },
    { title: "Gasolina",                  amount: 200,   type: "expense", categoryId: transporte.id,     createdAt: daysAgo(35) },
    { title: "Plano de saúde",            amount: 320,   type: "expense", categoryId: saude.id,          createdAt: daysAgo(36) },
    { title: "Netflix",                   amount: 55,    type: "expense", categoryId: lazer.id,          createdAt: daysAgo(37) },
    { title: "Academia",                  amount: 140,   type: "expense", categoryId: saude.id,          createdAt: daysAgo(38) },
    { title: "Conta de luz",              amount: 172,   type: "expense", categoryId: moradia.id,        createdAt: daysAgo(40) },
    { title: "Roupas",                    amount: 295,   type: "expense", categoryId: vestuario.id,      createdAt: daysAgo(41) },
    { title: "Aporte CDB",               amount: 1000,  type: "expense", categoryId: investimentos.id,  createdAt: daysAgo(42) },
    { title: "Curso React",               amount: 249,   type: "expense", categoryId: educacao.id,       createdAt: daysAgo(45) },
    { title: "Restaurante",               amount: 135,   type: "expense", categoryId: alimentacao.id,    createdAt: daysAgo(47) },
    { title: "Uber",                      amount: 58,    type: "expense", categoryId: transporte.id,     createdAt: daysAgo(50) },
    { title: "Farmácia",                  amount: 76,    type: "expense", categoryId: saude.id,          createdAt: daysAgo(52) },

    // ── Dois meses atrás ──
    { title: "Salário",                   amount: 7200,  type: "income",  categoryId: salario.id,        createdAt: daysAgo(62) },
    { title: "Freela dashboard",          amount: 1800,  type: "income",  categoryId: freelance.id,      createdAt: daysAgo(68) },
    { title: "Dividendos",                amount: 390,   type: "income",  categoryId: investimentos.id,  createdAt: daysAgo(70) },
    { title: "Aluguel",                   amount: 2100,  type: "expense", categoryId: moradia.id,        createdAt: daysAgo(63) },
    { title: "Supermercado",              amount: 460,   type: "expense", categoryId: alimentacao.id,    createdAt: daysAgo(64) },
    { title: "Gasolina",                  amount: 215,   type: "expense", categoryId: transporte.id,     createdAt: daysAgo(65) },
    { title: "Plano de saúde",            amount: 320,   type: "expense", categoryId: saude.id,          createdAt: daysAgo(66) },
    { title: "Netflix",                   amount: 55,    type: "expense", categoryId: lazer.id,          createdAt: daysAgo(67) },
    { title: "Academia",                  amount: 140,   type: "expense", categoryId: saude.id,          createdAt: daysAgo(68) },
    { title: "Conta de luz",              amount: 185,   type: "expense", categoryId: moradia.id,        createdAt: daysAgo(70) },
    { title: "Ingresso show",             amount: 240,   type: "expense", categoryId: lazer.id,          createdAt: daysAgo(72) },
    { title: "Aporte Tesouro Direto",     amount: 500,   type: "expense", categoryId: investimentos.id,  createdAt: daysAgo(73) },
    { title: "Calça jeans",               amount: 189,   type: "expense", categoryId: vestuario.id,      createdAt: daysAgo(75) },
    { title: "Livro Clean Code",          amount: 89,    type: "expense", categoryId: educacao.id,       createdAt: daysAgo(78) },
    { title: "Restaurante",               amount: 120,   type: "expense", categoryId: alimentacao.id,    createdAt: daysAgo(80) },
    { title: "Uber",                      amount: 72,    type: "expense", categoryId: transporte.id,     createdAt: daysAgo(82) },
    { title: "Consulta médica",           amount: 250,   type: "expense", categoryId: saude.id,          createdAt: daysAgo(85) },
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
