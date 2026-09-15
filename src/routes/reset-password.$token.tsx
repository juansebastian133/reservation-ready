import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { resetSchema } from "@/lib/validation";
import { ApiError, resetPassword } from "@/mocks/api";

export const Route = createFileRoute("/reset-password/$token")({
  head: () => ({
    meta: [
      { title: "Nueva contraseña — Quiero Reservar" },
      {
        name: "description",
        content: "Define una nueva contraseña segura para tu cuenta de Quiero Reservar.",
      },
      { property: "og:title", content: "Nueva contraseña — Quiero Reservar" },
      { property: "og:description", content: "Define una nueva contraseña segura." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

type Values = z.infer<typeof resetSchema>;

function ResetPasswordPage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = form.watch("password");

  async function onSubmit(values: Values) {
    setError(null);
    try {
      await resetPassword(token, values.password);
      toast.success("Contraseña actualizada. Todas las sesiones anteriores fueron cerradas.");
      navigate({ to: "/login", replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Ocurrió un error inesperado. Intenta de nuevo.",
      );
    }
  }

  return (
    <AuthLayout
      title="Define tu nueva contraseña"
      subtitle="Por seguridad cerraremos todas tus sesiones activas."
      footer={
        <p>
          ¿Necesitas otro enlace?{" "}
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Solicitar recuperación
          </Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid size-14 place-items-center rounded-lg bg-primary-soft text-primary">
          <KeyRound className="size-7" aria-hidden="true" />
        </div>

        {error ? <AlertBanner variant="error">{error}</AlertBanner> : null}

        <PasswordInput
          label="Nueva contraseña"
          autoComplete="new-password"
          showChecklist
          checklistValue={password}
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />

        <PasswordInput
          label="Confirmar contraseña"
          autoComplete="new-password"
          error={form.formState.errors.confirmPassword?.message}
          {...form.register("confirmPassword")}
        />

        <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Guardando...
            </>
          ) : (
            "Guardar contraseña"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
