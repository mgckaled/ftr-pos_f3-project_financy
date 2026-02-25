import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@apollo/client/react"
import { z } from "zod"
import {
  Utensils, Car, ShoppingCart, Zap, Coffee, ShoppingBag,
  Briefcase, Home, Heart, DollarSign, Plane, Music,
  Gamepad2, BookOpen, Dumbbell, Shirt,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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

// ── Ícones disponíveis ─────────────────────────────────────────────────────

const ICONS: { icon: LucideIcon; key: string }[] = [
  { icon: Utensils,    key: "utensils"   },
  { icon: Car,         key: "car"        },
  { icon: ShoppingCart,key: "cart"       },
  { icon: Zap,         key: "zap"        },
  { icon: Coffee,      key: "coffee"     },
  { icon: ShoppingBag, key: "bag"        },
  { icon: Briefcase,   key: "briefcase"  },
  { icon: Home,        key: "home"       },
  { icon: Heart,       key: "heart"      },
  { icon: DollarSign,  key: "dollar"     },
  { icon: Plane,       key: "plane"      },
  { icon: Music,       key: "music"      },
  { icon: Gamepad2,    key: "gamepad"    },
  { icon: BookOpen,    key: "book"       },
  { icon: Dumbbell,    key: "dumbbell"   },
  { icon: Shirt,       key: "shirt"      },
]

// ── Cores disponíveis ──────────────────────────────────────────────────────

const COLORS = [
  { key: "green",  bg: "bg-green-500"  },
  { key: "blue",   bg: "bg-blue-500"   },
  { key: "purple", bg: "bg-purple-500" },
  { key: "pink",   bg: "bg-pink-500"   },
  { key: "red",    bg: "bg-red-500"    },
  { key: "orange", bg: "bg-orange-500" },
  { key: "yellow", bg: "bg-yellow-400" },
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
    if (category) {
      reset({ name: category.name, description: "" })
    } else {
      reset({ name: "", description: "" })
    }
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
            <Label htmlFor="cat-description">
              Descrição{" "}
              <span className="text-xs text-gray-400 font-normal">Opcional</span>
            </Label>
            <Input
              id="cat-description"
              placeholder="Descrição da categoria"
              {...register("description")}
            />
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
                  className={`flex size-9 items-center justify-center rounded-md border transition-colors ${
                    selectedIcon === key
                      ? "border-brand-base bg-brand-base/10 text-brand-base"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  aria-label={key}
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
                  className={`flex size-8 items-center justify-center rounded-full transition-transform ${bg} ${
                    selectedColor === key
                      ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                      : "hover:scale-105"
                  }`}
                  aria-label={key}
                />
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
