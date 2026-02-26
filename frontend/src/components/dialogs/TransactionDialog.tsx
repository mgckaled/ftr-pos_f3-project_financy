import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "@/graphql/mutations/transactions"
import { GET_TRANSACTIONS } from "@/graphql/queries/transactions"
import type { Category, Transaction } from "@/graphql/types"

// ── Schema ─────────────────────────────────────────────────────────────────

const transactionSchema = z.object({
  title: z.string().min(1, "Descrição obrigatória"),
  date: z.string().min(1, "Data obrigatória"),
  amount: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "Valor obrigatório" : "Informe um número válido",
    })
    .positive("Valor deve ser positivo"),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().min(1, "Categoria obrigatória"),
})

type TransactionFormData = z.infer<typeof transactionSchema>

// ── Props ──────────────────────────────────────────────────────────────────

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  categories: Category[]
}

// ── Component ──────────────────────────────────────────────────────────────

export function TransactionDialog({ open, onOpenChange, transaction, categories }: TransactionDialogProps) {
  const isEditing = !!transaction

  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  })

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "expense" },
  })

  const selectedType = useWatch({ control, name: "type", defaultValue: "expense" })

  // Preenche ou limpa o formulário ao abrir
  useEffect(() => {
    if (!open) return
    if (transaction) {
      reset({
        title: transaction.title,
        date: transaction.createdAt.slice(0, 10),
        amount: transaction.amount,
        type: transaction.type as "income" | "expense",
        categoryId: transaction.categoryId,
      })
    } else {
      reset({
        title: "",
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        type: "expense",
        categoryId: "",
      })
    }
  }, [open, transaction, reset])

  const onSubmit = async (data: TransactionFormData) => {
    try {
      if (isEditing && transaction) {
        await updateTransaction({
          variables: {
            id: transaction.id,
            input: {
              title: data.title,
              amount: data.amount,
              type: data.type,
              categoryId: data.categoryId,
            },
          },
        })
      } else {
        await createTransaction({
          variables: {
            input: {
              title: data.title,
              amount: data.amount,
              type: data.type,
              categoryId: data.categoryId,
            },
          },
        })
      }
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar transação" : "Nova transação"}</DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-4 pt-2'>
          {/* Toggle Tipo */}
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => setValue("type", "expense")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors ${
                selectedType === "expense"
                  ? "border-danger bg-red-50 text-danger"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className='h-2 w-2 rounded-full bg-current' />
              Despesa
            </button>
            <button
              type='button'
              onClick={() => setValue("type", "income")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors ${
                selectedType === "income"
                  ? "border-success bg-green-50 text-success"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className='h-2 w-2 rounded-full bg-current' />
              Receita
            </button>
          </div>

          {/* Descrição */}
          <div className='space-y-1.5'>
            <Label htmlFor='tx-title'>Descrição</Label>
            <Input
              id='tx-title'
              placeholder='Ex. Almoço no restaurante'
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && <p className='text-xs text-danger'>{errors.title.message}</p>}
          </div>

          {/* Data + Valor */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='tx-date'>Data</Label>
              <Input id='tx-date' type='date' aria-invalid={!!errors.date} {...register("date")} />
              {errors.date && <p className='text-xs text-danger'>{errors.date.message}</p>}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='tx-amount'>Valor</Label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400'>R$</span>
                <Input
                  id='tx-amount'
                  type='number'
                  step='0.01'
                  min='0'
                  placeholder='0,00'
                  className='pl-9'
                  aria-invalid={!!errors.amount}
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>
              {errors.amount && <p className='text-xs text-danger'>{errors.amount.message}</p>}
            </div>
          </div>

          {/* Categoria */}
          <div className='space-y-1.5'>
            <Label htmlFor='tx-category'>Categoria</Label>
            <Controller
              name='categoryId'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='tx-category' className='w-full' aria-invalid={!!errors.categoryId}>
                    <SelectValue placeholder='Selecione' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <p className='text-xs text-danger'>{errors.categoryId.message}</p>}
          </div>

          {/* Botão Salvar */}
          <Button type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

