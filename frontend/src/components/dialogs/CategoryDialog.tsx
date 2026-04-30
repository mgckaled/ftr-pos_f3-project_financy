import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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

  const iconRefs = useRef<(HTMLButtonElement | null)[]>([])
  const colorRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleIconKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const cols = 8
    let next = currentIndex
    if (e.key === "ArrowRight") next = (currentIndex + 1) % CATEGORY_ICONS.length
    else if (e.key === "ArrowLeft") next = (currentIndex - 1 + CATEGORY_ICONS.length) % CATEGORY_ICONS.length
    else if (e.key === "ArrowDown") next = Math.min(currentIndex + cols, CATEGORY_ICONS.length - 1)
    else if (e.key === "ArrowUp") next = Math.max(currentIndex - cols, 0)
    else return
    e.preventDefault()
    setSelectedIcon(CATEGORY_ICONS[next].key)
    iconRefs.current[next]?.focus()
  }

  const handleColorKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let next = currentIndex
    if (e.key === "ArrowRight") next = (currentIndex + 1) % CATEGORY_COLORS.length
    else if (e.key === "ArrowLeft") next = (currentIndex - 1 + CATEGORY_COLORS.length) % CATEGORY_COLORS.length
    else return
    e.preventDefault()
    setSelectedColor(CATEGORY_COLORS[next].key)
    colorRefs.current[next]?.focus()
  }

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
      toast.success(isEditing ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.")
      onClose()
    } catch {
      toast.error("Erro ao salvar categoria. Tente novamente.")
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
          <p role="alert" aria-live="polite" className="text-xs text-danger">{errors.name.message}</p>
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
        <Label id="icon-group-label">Ícone</Label>
        <div role="radiogroup" aria-labelledby="icon-group-label" className="grid grid-cols-8 gap-1.5">
          {CATEGORY_ICONS.map(({ icon: Icon, key }, index) => (
            <button
              key={key}
              ref={(el) => { iconRefs.current[index] = el }}
              type="button"
              role="radio"
              aria-checked={selectedIcon === key}
              aria-label={key}
              tabIndex={selectedIcon === key ? 0 : -1}
              onClick={() => setSelectedIcon(key)}
              onKeyDown={(e) => handleIconKeyDown(e, index)}
              className={`flex size-9 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-base focus-visible:ring-offset-1 ${
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
        <Label id="color-group-label">Cor</Label>
        <div role="radiogroup" aria-labelledby="color-group-label" className="flex gap-2">
          {CATEGORY_COLORS.map(({ key, bg }, index) => (
            <button
              key={key}
              ref={(el) => { colorRefs.current[index] = el }}
              type="button"
              role="radio"
              aria-checked={selectedColor === key}
              aria-label={key}
              tabIndex={selectedColor === key ? 0 : -1}
              onClick={() => setSelectedColor(key)}
              onKeyDown={(e) => handleColorKeyDown(e, index)}
              className={`flex flex-1 items-center justify-center rounded-md border bg-white p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-base focus-visible:ring-offset-1 ${
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
        className="w-full"
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
