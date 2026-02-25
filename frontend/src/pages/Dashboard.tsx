import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Briefcase,
  Car,
  Coffee,
  DollarSign,
  Heart,
  Home,
  Plus,
  ShoppingBag,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Topbar } from "@/components/layout/Topbar";
import { Tag } from "@/components/shared/Tag";
import { GET_CATEGORIES } from "@/graphql/queries/categories";
import { GET_TRANSACTIONS } from "@/graphql/queries/transactions";
import type { Category } from "@/graphql/types";
import { useAuth } from "@/hooks/useAuth";

// ── Helpers ───────────────────────────────────────────────────────────────────

const TAG_COLORS = [
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
] as const;

type TagColor = (typeof TAG_COLORS)[number];

function getCategoryColor(index: number): TagColor {
  return TAG_COLORS[index % TAG_COLORS.length];
}

// Ícones e cores de fundo para os cards de categoria no Figma
const CATEGORY_ICONS: LucideIcon[] = [
  Utensils,
  Car,
  ShoppingCart,
  Zap,
  Coffee,
  ShoppingBag,
  Briefcase,
  Home,
  Heart,
  DollarSign,
];

const ICON_BG_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-orange-100 text-orange-600",
  "bg-yellow-100 text-yellow-600",
  "bg-pink-100 text-pink-600",
  "bg-green-100 text-green-600",
  "bg-red-100 text-red-600",
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function isCurrentMonth(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  );
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  const { data: txData, loading: txLoading } = useQuery(GET_TRANSACTIONS, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });

  const { data: catData, loading: catLoading } = useQuery(GET_CATEGORIES, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });

  const transactions = useMemo(() => txData?.transactions ?? [], [txData]);
  const categories = useMemo(() => catData?.categories ?? [], [catData]);

  // Mapa id → categoria + índice
  const categoryMap = useMemo(
    () => new Map<string, Category>(categories.map((c) => [c.id, c])),
    [categories]
  );
  const categoryIndexMap = useMemo(
    () => new Map<string, number>(categories.map((c, i) => [c.id, i])),
    [categories]
  );

  // Resumo financeiro
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthIncome = transactions
    .filter((t) => t.type === "income" && isCurrentMonth(t.createdAt))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpense = transactions
    .filter((t) => t.type === "expense" && isCurrentMonth(t.createdAt))
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Transações recentes (5 mais recentes)
  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Contagem e total por categoria
  const categoryStats = new Map<string, { count: number; total: number }>();
  for (const t of transactions) {
    const prev = categoryStats.get(t.categoryId) ?? { count: 0, total: 0 };
    categoryStats.set(t.categoryId, {
      count: prev.count + 1,
      total: prev.total + t.amount,
    });
  }

  const loading = txLoading || catLoading;

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar userName={user?.name} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* ── Cards de resumo ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Saldo Total */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded-full bg-purple-100">
                <Wallet className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Saldo Total
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {loading ? "—" : formatCurrency(balance)}
            </p>
          </div>

          {/* Receitas do Mês */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Receitas do Mês
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {loading ? "—" : formatCurrency(monthIncome)}
            </p>
          </div>

          {/* Despesas do Mês */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                <TrendingDown className="h-4 w-4 text-danger" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Despesas do Mês
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {loading ? "—" : formatCurrency(monthExpense)}
            </p>
          </div>
        </div>

        {/* ── Seção principal ── */}
        <div className="grid grid-cols-3 gap-4">
          {/* Transações Recentes */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Transações Recentes
              </span>
              <Link
                to="/transactions"
                className="text-xs font-medium text-brand-base hover:text-brand-dark flex items-center gap-0.5"
              >
                Ver todas →
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                Carregando...
              </p>
            ) : recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                Nenhuma transação encontrada.
              </p>
            ) : (
              <ul className="flex-1 divide-y divide-gray-100">
                {recentTransactions.map((tx) => {
                  const cat = categoryMap.get(tx.categoryId);
                  const idx = cat ? (categoryIndexMap.get(cat.id) ?? 0) : 0;
                  const Icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
                  const iconStyle =
                    ICON_BG_COLORS[idx % ICON_BG_COLORS.length];

                  return (
                    <li
                      key={tx.id}
                      className="flex items-center gap-4 py-3"
                    >
                      {/* Ícone da categoria */}
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Título + data */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {tx.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>

                      {/* Tag da categoria */}
                      {cat && (
                        <Tag
                          label={cat.name}
                          color={getCategoryColor(idx)}
                        />
                      )}

                      {/* Valor + ícone de tipo */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={
                            tx.type === "income"
                              ? "text-sm font-semibold text-gray-800"
                              : "text-sm font-semibold text-gray-800"
                          }
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </span>
                        {tx.type === "income" ? (
                          <ArrowUpCircle className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-danger" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Botão nova transação */}
            <Link
              to="/transactions"
              className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-base hover:text-brand-dark"
            >
              <Plus className="h-4 w-4" />
              Nova transação
            </Link>
          </div>

          {/* Categorias */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Categorias
              </span>
              <Link
                to="/categories"
                className="text-xs font-medium text-brand-base hover:text-brand-dark"
              >
                Gerenciar →
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                Carregando...
              </p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                Nenhuma categoria.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {categories.map((cat, i) => {
                  const stats = categoryStats.get(cat.id) ?? {
                    count: 0,
                    total: 0,
                  };
                  return (
                    <li
                      key={cat.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-2">
                        <Tag
                          label={cat.name}
                          color={getCategoryColor(i)}
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {stats.count} itens
                        </p>
                        <p className="text-xs font-semibold text-gray-700">
                          {formatCurrency(stats.total)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
