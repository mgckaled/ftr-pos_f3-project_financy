import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "@/graphql/mutations/categories"
import { GET_CATEGORIES } from "@/graphql/queries/categories"
import type { Category } from "@/graphql/types"
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  DEFAULT_COLOR,
  DEFAULT_ICON,
} from "./category-constants"

// ── Schema ─────────────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

// ── Inner form — remonta a cada abertura via key ────────────────────────────

interface CategoryFormProps {
  category?: Category
  onClose: () => void
}

function CategoryForm({ category, onClose }: CategoryFormProps) {
  const isEditing = !!category

  const [selectedIcon, setSelectedIcon] = useState(category?.icon ?? DEFAULT_ICON)
  const [selectedColor, setSelectedColor] = useState(category?.color ?? DEFAULT_COLOR)

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onBlur",
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        await updateCategory({
          variables: {
            id: category.id,
            input: {
              name: data.name,
              description: data.description || undefined,
              icon: selectedIcon,
              color: selectedColor,
            },
          },
        })
      } else {
        await createCategory({
          variables: {
            input: {
              name: data.name,
              description: data.description || undefined,
              icon: selectedIcon,
              color: selectedColor,
            },
          },
        })
      }
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
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
          {CATEGORY_ICONS.map(({ icon: Icon, key }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedIcon(key)}
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
          {CATEGORY_COLORS.map(({ key, bg }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedColor(key)}
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
  )
}

// ── Dialog wrapper ──────────────────────────────────────────────────────────

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const isEditing = !!category

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

        {open && (
          <CategoryForm
            key={`${category?.id ?? "new"}`}
            category={category}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
