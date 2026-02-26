import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { Topbar } from "@/components/layout/Topbar"
import { Tag } from "@/components/shared/Tag"
import { IconButton } from "@/components/shared/IconButton"
import { CategoryDialog, CATEGORY_ICON_MAP, CATEGORY_COLOR_BG } from "@/components/dialogs/CategoryDialog"
import { Button } from "@/components/ui/button"
import { GET_CATEGORIES } from "@/graphql/queries/categories"
import { GET_TRANSACTIONS } from "@/graphql/queries/transactions"
import { DELETE_CATEGORY } from "@/graphql/mutations/categories"
import type { Category } from "@/graphql/types"

// ── Paleta fallback ────────────────────────────────────────────────────────────

const TAG_COLORS = [
  "blue", "purple", "pink", "red", "orange", "yellow", "green",
] as const
type TagColor = (typeof TAG_COLORS)[number]
function getCategoryColor(i: number): TagColor {
  return TAG_COLORS[i % TAG_COLORS.length]
}

const FALLBACK_ICON_KEYS = Object.keys(CATEGORY_ICON_MAP)
const FALLBACK_COLOR_KEYS = Object.keys(CATEGORY_COLOR_BG)

function getIconKey(cat: Category, i: number): string {
  return cat.icon ?? FALLBACK_ICON_KEYS[i % FALLBACK_ICON_KEYS.length]
}

function getColorKey(cat: Category, i: number): string {
  return cat.color ?? FALLBACK_COLOR_KEYS[i % FALLBACK_COLOR_KEYS.length]
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function Categories() {
  const { user, isAuthenticated } = useAuth()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  const { data: catData, loading } = useQuery(GET_CATEGORIES, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  })

  const { data: txData } = useQuery(GET_TRANSACTIONS, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  })

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const categories = useMemo(() => catData?.categories ?? [], [catData])
  const transactions = useMemo(() => txData?.transactions ?? [], [txData])

  const txCountByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + 1)
    }
    return map
  }, [transactions])

  function openCreate() {
    setEditingCategory(undefined)
    setDialogOpen(true)
  }

  function openEdit(cat: Category) {
    setEditingCategory(cat)
    setDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja excluir esta categoria?")) return
    try {
      await deleteCategory({ variables: { id } })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar userName={user?.name} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Organize suas transações por categorias
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-brand-base hover:bg-brand-dark text-white"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Nova categoria
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-1">
              Total de categorias
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-3xl font-bold text-gray-800">{transactions.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-1">
              Total de transações
            </p>
          </div>
          {(() => {
            const mostUsedIdx = categories.reduce<number>((topIdx, cat, i) => {
              const count = txCountByCategory.get(cat.id) ?? 0
              const topCount = topIdx >= 0 ? (txCountByCategory.get(categories[topIdx].id) ?? 0) : -1
              return count > topCount ? i : topIdx
            }, -1)
            const mostUsed = mostUsedIdx >= 0 ? categories[mostUsedIdx] : null
            const iconKey = mostUsed ? getIconKey(mostUsed, mostUsedIdx) : null
            const colorKey = mostUsed ? getColorKey(mostUsed, mostUsedIdx) : null
            const Icon = iconKey ? CATEGORY_ICON_MAP[iconKey] : null
            return (
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
                {Icon && mostUsed && colorKey && (
                  <div className={`flex size-10 items-center justify-center rounded-xl ${CATEGORY_COLOR_BG[colorKey]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {mostUsed?.name ?? "—"}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Categoria mais utilizada
                  </p>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Grid de categorias */}
        {loading ? (
          <p className="py-12 text-center text-sm text-gray-400">Carregando...</p>
        ) : categories.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">
            Nenhuma categoria encontrada.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const iconKey = getIconKey(cat, i)
              const colorKey = getColorKey(cat, i)
              const Icon = CATEGORY_ICON_MAP[iconKey]
              const count = txCountByCategory.get(cat.id) ?? 0
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  {/* Ações */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${CATEGORY_COLOR_BG[colorKey]}`}>
                      {Icon && <Icon className="h-5 w-5" />}
                    </div>
                    <div className="flex gap-1">
                      <IconButton
                        icon={Pencil}
                        variant="default"
                        aria-label="Editar"
                        onClick={() => openEdit(cat)}
                      />
                      <IconButton
                        icon={Trash2}
                        variant="destructive"
                        aria-label="Excluir"
                        onClick={() => handleDelete(cat.id)}
                      />
                    </div>
                  </div>

                  {/* Nome */}
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {cat.name}
                  </p>

                  {/* Descrição */}
                  {cat.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {cat.description}
                    </p>
                  )}

                  {/* Tag + contagem */}
                  <div className="flex items-center justify-between mt-3">
                    <Tag label={cat.name} color={getCategoryColor(i)} />
                    <span className="text-xs text-gray-400">{count} itens</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  )
}
