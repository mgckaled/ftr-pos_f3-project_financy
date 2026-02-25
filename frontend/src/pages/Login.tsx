import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

import { loginSchema, type LoginFormData } from "@/lib/schemas";
import { LOGIN } from "@/graphql/mutations/auth";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/assets/logo.svg?react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [executeLogin] = useMutation(LOGIN);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (formData: LoginFormData) => {
    setServerError(null);
    try {
      const { data } = await executeLogin({
        variables: { email: formData.email, password: formData.password },
      });
      if (data?.login) {
        login(data.login.token, {
          id: data.login.user.id,
          name: data.login.user.name,
          email: data.login.user.email,
        });
        navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer login";
      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-12 px-4">
      {/* Logo */}
      <div className="mb-8">
        <Logo className="h-10" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Fazer login</h1>
          <p className="mt-1 text-sm text-gray-500">
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* E-mail */}
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="mail@exemplo.com"
                className="pl-9"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className="pl-9 pr-10"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger">{errors.password.message}</p>
            )}
          </div>

          {/* Lembrar-me + Recuperar senha */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-brand-base"
              />
              Lembrar-me
            </label>
            <button
              type="button"
              className="text-sm text-brand-base hover:text-brand-dark font-medium"
            >
              Recuperar senha
            </button>
          </div>

          {/* Erro do servidor */}
          {serverError && (
            <p className="text-sm text-danger text-center">{serverError}</p>
          )}

          {/* Botão Entrar */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-base hover:bg-brand-dark text-white"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Divisor */}
        <div className="my-6 flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-gray-400">ou</span>
          <Separator className="flex-1" />
        </div>

        {/* Link para cadastro */}
        <p className="mb-3 text-center text-sm text-gray-500">
          Ainda não tem uma conta?
        </p>
        <Button
          variant="outline"
          asChild
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Link to="/register">
            <LogIn className="mr-2 h-4 w-4" />
            Criar conta
          </Link>
        </Button>
      </div>
    </div>
  );
}
