import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

const passwordSchema = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .superRefine((val, ctx) => {
    if (!/[A-Z]/.test(val))
      ctx.addIssue({ code: "custom", message: "Deve conter pelo menos uma letra maiúscula" });
    if (!/[a-z]/.test(val))
      ctx.addIssue({ code: "custom", message: "Deve conter pelo menos uma letra minúscula" });
    if (!/[0-9]/.test(val))
      ctx.addIssue({ code: "custom", message: "Deve conter pelo menos um número" });
    if (!/[^A-Za-z0-9]/.test(val))
      ctx.addIssue({ code: "custom", message: "Deve conter pelo menos um caractere especial" });
  });

export const registerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
