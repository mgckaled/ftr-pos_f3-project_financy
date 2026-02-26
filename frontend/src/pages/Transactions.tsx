import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { TransactionDialog } from "@/components/dialogs/TransactionDialog";
import { Topbar } from "@/components/layout/Topbar";
import { IconButton } from "@/components/shared/IconButton";
import { Tag, type TagColor } from "@/components/shared/Tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_COLOR_BG, CATEGORY_ICON_MAP } from "@/components/dialogs/category-constants";
import { Label } from "@/components/ui/label";
import { DELETE_TRANSACTION } from "@/graphql/mutations/transactions";
import { GET_CATEGORIES } from "@/graphql/queries/categories";
import { GET_TRANSACTIONS } from "@/graphql/queries/transactions";
import type { Category, Transaction } from "@/graphql/types";
import { useAuth } from "@/hooks/useAuth";

// ── Helpers ───────────────────────────────────────────────────────────────────

const TAG_COLORS = [
  "blue", "purple", "pink", "red", "orange", "yellow", "green",
] as const;

function getCategoryColor(index: number): TagColor {
  return TAG_COLORS[index % TAG_COLORS.length];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

const PAGE_SIZE = 10;

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Transactions() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  useEffect(() => {
    if (location.state?.openNew) {
      setDialogOpen(true);
      window.history.replaceState({}, "");
    }
  }, []);

  // Filtros
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1));
  const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()));

  // Paginação
  const [page, setPage] = useState(1);

  const { data: txData, loading: txLoading } = useQuery(GET_TRANSACTIONS, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });

  const { data: catData } = useQuery(GET_CATEGORIES, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  });

  const transactions = useMemo(() => txData?.transactions ?? [], [txData]);
  const categories = useMemo(() => catData?.categories ?? [], [catData]);

  const categoryMap = useMemo(
    () => new Map<string, Category>(categories.map((c) => [c.id, c])),
    [categories]
  );
  const categoryIndexMap = useMemo(
    () => new Map<string, number>(categories.map((c, i) => [c.id, i])),
    [categories]
  );

  // Filtros aplicados
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterType !== "all" && tx.type !== filterType) return false;
      if (filterCategory !== "all" && tx.categoryId !== filterCategory) return false;
      const d = new Date(tx.createdAt);
      if (filterMonth !== "all" && d.getMonth() + 1 !== Number(filterMonth)) return false;
      if (filterYear !== "all" && d.getFullYear() !== Number(filterYear)) return false;
      return true;
    });
  }, [transactions, search, filterType, filterCategory, filterMonth, filterYear]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    setEditingTransaction(undefined);
    setDialogOpen(true);
  }

  function openEdit(tx: Transaction) {
    setEditingTransaction(tx);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja excluir esta transação?")) return;
    try {
      await deleteTransaction({ variables: { id } });
    } catch (err) {
      console.error(err);
    }
  }

  // Anos disponíveis para filtro
  const years = Array.from(
    new Set(transactions.map((t) => new Date(t.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar userName={user?.name} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <Button
            onClick={openCreate}
            className=""
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Nova transação
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por descrição"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Tipo</Label>
              <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Entrada</SelectItem>
                  <SelectItem value="expense">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Categoria</Label>
              <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Período</Label>
              <Select
                value={`${filterMonth}-${filterYear}`}
                onValueChange={(v) => {
                  const [m, y] = v.split("-");
                  setFilterMonth(m);
                  setFilterYear(y);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {years.flatMap((y) =>
                    MONTHS.map((name, idx) => (
                      <SelectItem key={`${idx + 1}-${y}`} value={`${idx + 1}-${y}`}>
                        {name} / {y}
                      </SelectItem>
                    ))
                  )}
                  <SelectItem value="all-all">Todos os períodos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {txLoading ? (
            <p className="py-12 text-center text-sm text-gray-400">Carregando...</p>
          ) : paginated.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">
              Nenhuma transação encontrada.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 text-left">Descrição</th>
                  <th className="px-5 py-3 text-left">Data</th>
                  <th className="px-5 py-3 text-left">Categoria</th>
                  <th className="px-5 py-3 text-left">Tipo</th>
                  <th className="px-5 py-3 text-right">Valor</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((tx) => {
                  const cat = categoryMap.get(tx.categoryId);
                  const idx = cat ? (categoryIndexMap.get(cat.id) ?? 0) : 0;
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const iconKey = cat?.icon ?? "briefcase";
                            const colorKey = cat?.color ?? "gray";
                            const Icon = CATEGORY_ICON_MAP[iconKey];
                            const colorCls = CATEGORY_COLOR_BG[colorKey] ?? "bg-gray-100 text-gray-500";
                            return Icon ? (
                              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colorCls}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                            ) : null;
                          })()}
                          <span className="font-medium text-gray-800">{tx.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        {cat ? (
                          <Tag label={cat.name} color={(cat.color as TagColor) ?? getCategoryColor(idx)} />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tx.type === "income"
                              ? "bg-green-50 text-success"
                              : "bg-red-50 text-danger"
                          }`}
                        >
                          {tx.type === "income" ? (
                            <ArrowUpCircle className="h-3 w-3" />
                          ) : (
                            <ArrowDownCircle className="h-3 w-3" />
                          )}
                          {tx.type === "income" ? "Entrada" : "Saída"}
                        </span>
                      </td>
                      <td className={`px-5 py-3 text-right font-semibold whitespace-nowrap ${tx.type === "income" ? "text-success" : "text-gray-800"}`}>
                        {`${tx.type === "income" ? "+" : "-"} ${formatCurrency(tx.amount)}`}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <IconButton
                            icon={Pencil}
                            variant="default"
                            aria-label="Editar"
                            onClick={() => openEdit(tx)}
                          />
                          <IconButton
                            icon={Trash2}
                            variant="destructive"
                            aria-label="Excluir"
                            onClick={() => handleDelete(tx.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Paginação */}
          {!txLoading && filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
              <span className="text-xs text-gray-500">
                {(page - 1) * PAGE_SIZE + 1} a{" "}
                {Math.min(page * PAGE_SIZE, filtered.length)} |{" "}
                {filtered.length} resultados
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex size-7 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex size-7 items-center justify-center rounded text-xs font-medium transition-colors ${
                      p === page
                        ? "bg-brand-base text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex size-7 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editingTransaction}
        categories={categories}
      />
    </div>
  );
}
