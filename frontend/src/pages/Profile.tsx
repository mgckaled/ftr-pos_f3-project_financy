import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// ── Schema ─────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ── Helper ─────────────────────────────────────────────────────────────────

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" },
  });

  // Inicializa o formulário apenas uma vez quando os dados chegam
  const initialized = useRef(false);
  useEffect(() => {
    if (user && !initialized.current) {
      reset({ name: user.name });
      initialized.current = true;
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    updateUser({ name: data.name });
    reset({ name: data.name }); // atualiza baseline → isDirty = false
  };

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar userName={user?.name} />

      <main className="mx-auto max-w-md px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Avatar + info */}
          <div className="flex flex-col items-center px-8 pt-8 pb-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-700 select-none mb-4">
              {getInitials(user?.name)}
            </div>
            <p className="text-lg font-bold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <Separator />

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-8 py-6 space-y-4">
            {/* Nome completo */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="profile-name"
                  placeholder="Seu nome completo"
                  className="pl-9"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-danger">{errors.name.message}</p>
              )}
            </div>

            {/* E-mail (somente leitura) */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="profile-email"
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  disabled
                  className="pl-9 cursor-not-allowed opacity-60"
                />
              </div>
              <p className="text-xs text-gray-400">O e-mail não pode ser alterado</p>
            </div>

            {/* Salvar */}
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>

          {/* Sair */}
          <div className="px-8 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="w-full border-gray-200 text-danger hover:bg-red-50 hover:border-danger"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair da conta
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
