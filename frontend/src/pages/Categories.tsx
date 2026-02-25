import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Utensils, Car, ShoppingCart, Zap, Coffee, ShoppingBag,
  Briefcase, Home, Heart, DollarSign, Plane, Music,
  Gamepad2, BookOpen, Dumbbell, Shirt,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { Topbar } from "@/components/layout/Topbar"
import { Tag } from "@/components/shared/Tag"
import { IconButton } from "@/components/shared/IconButton"
import { CategoryDialog } from "@/components/dialogs/CategoryDialog"
import { Button } from "@/components/ui/button"
import { GET_CATEGORIES } from "@/graphql/queries/categories"
import { GET_TRANSACTIONS } from "@/graphql/queries/transactions"
import { DELETE_CATEGORY } from "@/graphql/mutations/categories"
import type { Category } from "@/graphql/types"

// ── Paleta ────────────────────────────────────────────────────────────────────

const TAG_COLORS = [
  "blue", "purple", "pink", "red", "orange", "yellow", "green",
] as const
type TagColor = (typeof TAG_COLORS)[number]
function getCategoryColor(i: number): TagColor {
  return TAG_COLORS[i % TAG_COLORS.length]
}

const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils, car: Car, cart: ShoppingCart, zap: Zap,
  coffee: Coffee, bag: ShoppingBag, briefcase: Briefcase, home: Home,
  heart: Heart, dollar: DollarSign, plane: Plane, music: Music,
  gamepad: Gamepad2, book: BookOpen, dumbbell: Dumbbell, shirt: Shirt,
}

const ICON_KEYS = Object.keys(ICONS)

const COLOR_BG: Record<string, string> = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  pink: "bg-pink-100 text-pink-600",
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  yellow: "bg-yellow-100 text-yellow-600",
}

const COLOR_KEYS = Object.keys(COLOR_BG)

// ── Componente ────────────────────────────────────────────────────────────────

export default function Categories() {
  const { user, isAuthenticated } = useAuth()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [selectedIcon, setSelectedIcon] = useState("utensils")
  const [selectedColor, setSelectedColor] = useState("green")

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
    setSelectedIcon(ICON_KEYS[0])
    setSelectedColor(COLOR_KEYS[0])
    setDialogOpen(true)
  }

  function openEdit(cat: Category, index: number) {
    setEditingCategory(cat)
    setSelectedIcon(ICON_KEYS[index % ICON_KEYS.length])
    setSelectedColor(COLOR_KEYS[index % COLOR_KEYS.length])
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
            const mostUsed = categories.reduce<Category | null>((top, cat) => {
              const count = txCountByCategory.get(cat.id) ?? 0
              const topCount = top ? (txCountByCategory.get(top.id) ?? 0) : -1
              return count > topCount ? cat : top
            }, null)
            const Icon = mostUsed
              ? ICONS[ICON_KEYS[categories.indexOf(mostUsed) % ICON_KEYS.length]]
              : null
            return (
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
                {Icon && mostUsed && (
                  <div className={`flex size-10 items-center justify-center rounded-xl ${
                    COLOR_BG[COLOR_KEYS[categories.indexOf(mostUsed) % COLOR_KEYS.length]]
                  }`}>
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
              const iconKey = ICON_KEYS[i % ICON_KEYS.length]
              const colorKey = COLOR_KEYS[i % COLOR_KEYS.length]
              const Icon = ICONS[iconKey]
              const count = txCountByCategory.get(cat.id) ?? 0
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  {/* Ações */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${COLOR_BG[colorKey]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex gap-1">
                      <IconButton
                        icon={Pencil}
                        variant="default"
                        aria-label="Editar"
                        onClick={() => openEdit(cat, i)}
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
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    {cat.name}
                  </p>

                  {/* Tag + contagem */}
                  <div className="flex items-center justify-between">
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
        selectedIcon={selectedIcon}
        selectedColor={selectedColor}
        onIconChange={setSelectedIcon}
        onColorChange={setSelectedColor}
      />
    </div>
  )
}
