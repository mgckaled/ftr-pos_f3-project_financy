import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  Briefcase, Car,
  ClipboardList,
  Coffee,
  Dumbbell,
  Gift,
  Heart,
  Home,
  Newspaper,
  PiggyBank,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart, Ticket,
  Utensils,
} from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "@/graphql/mutations/categories"
import { GET_CATEGORIES } from "@/graphql/queries/categories"
import type { Category } from "@/graphql/types"

// ── Schema ─────────────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

// ── Ícones (2 linhas × 8 colunas) ─────────────────────────

const ICONS: { icon: LucideIcon; key: string }[] = [
  { icon: Briefcase,      key: "briefcase"  },
  { icon: Car,            key: "car"        },
  { icon: Heart,          key: "heart"      },
  { icon: PiggyBank,      key: "piggybank"  },
  { icon: ShoppingCart,   key: "cart"       },
  { icon: Ticket,         key: "ticket"     },
  { icon: ShoppingBag,    key: "bag"        },
  { icon: Utensils,       key: "utensils"   },
  { icon: Coffee,         key: "coffee"     },
  { icon: Home,           key: "home"       },
  { icon: Gift,           key: "gift"       },
  { icon: Dumbbell,       key: "dumbbell"   },
  { icon: BookOpen,       key: "book"       },
  { icon: ShoppingBasket, key: "basket"     },
  { icon: Newspaper,      key: "newspaper"  },
  { icon: ClipboardList,  key: "clipboard"  },
]

// ── Cores (retângulos arredondados — ) ────────────────────────

const COLORS = [
  { key: "green",  bg: "bg-green-500"  },
  { key: "blue",   bg: "bg-blue-500"   },
  { key: "purple", bg: "bg-purple-500" },
  { key: "pink",   bg: "bg-pink-500"   },
  { key: "red",    bg: "bg-red-500"    },
  { key: "orange", bg: "bg-orange-500" },
  { key: "yellow", bg: "bg-yellow-500" },
]

// ── Props ──────────────────────────────────────────────────────────────────

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  selectedIcon: string
  selectedColor: string
  onIconChange: (key: string) => void
  onColorChange: (key: string) => void
}

// ── Component ──────────────────────────────────────────────────────────────

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  selectedIcon,
  selectedColor,
  onIconChange,
  onColorChange,
}: CategoryDialogProps) {
  const isEditing = !!category

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onBlur",
  })

  useEffect(() => {
    if (!open) return
    reset({ name: category?.name ?? "", description: "" })
  }, [open, category, reset])

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        await updateCategory({
          variables: { id: category.id, input: { name: data.name } },
        })
      } else {
        await createCategory({
          variables: { input: { name: data.name } },
        })
      }
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          {/* Título */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Título</Label>
            <Input
              id="cat-name"
              placeholder="Ex. Alimentação"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-danger">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-description">Descrição</Label>
            <Input
              id="cat-description"
              placeholder="Descrição da categoria"
              {...register("description")}
            />
            <p className="text-xs text-gray-400">Opcional</p>
          </div>

          {/* Ícone */}
          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-8 gap-1.5">
              {ICONS.map(({ icon: Icon, key }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onIconChange(key)}
                  aria-label={key}
                  className={`flex size-9 items-center justify-center rounded-md border transition-colors ${
                    selectedIcon === key
                      ? "border-brand-base bg-brand-base/10 text-brand-base"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex gap-2">
              {COLORS.map(({ key, bg }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onColorChange(key)}
                  aria-label={key}
                  className={`flex flex-1 items-center justify-center rounded-md border bg-white p-1 transition-colors ${
                    selectedColor === key
                      ? "border-gray-600 ring-1 ring-gray-400"
                      : "border-gray-200"
                  }`}
                >
                  <div className={`h-4 w-full rounded-sm ${bg}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Botão Salvar */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-base hover:bg-brand-dark text-white"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
