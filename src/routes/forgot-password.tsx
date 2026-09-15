import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, MailQuestion } from "lucide-react";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { InputField } from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";
import { forgotSchema } from "@/lib/validation";
import { ApiError, requestPasswordReset } from "@/mocks/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Recuperar contraseña — Quiero Reservar" },
      {
        name: "description",
        content: "Solicita un enlace para restablecer la contraseña de tu cuenta Quiero Reservar.",
      },
      { property: "og:title", content: "Recuperar contraseña — Quiero Reservar" },
      {
        property: "og:description",
        content: "Solicita un enlace para restablecer tu contraseña.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

type Values = z.infer<typeof forgotSchema>;

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: Values) {
    setError(null);
    try {
      await requestPasswordReset(values.email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Ocurrió un error inesperado. Intenta de nuevo.",
      );
    }
  }

  return (
    <AuthLayout
      title="Recupera tu contraseña"
      subtitle="Te enviaremos un enlace para crear una nueva contraseña."
      footer={
        <Link to="/login" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a iniciar sesión
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-6">
          <div className="grid size-14 place-items-center rounded-lg bg-primary-soft text-primary">
            <MailQuestion className="size-7" aria-hidden="true" />
          </div>
          <AlertBanner variant="info" title="Revisa tu correo">
            Si el correo existe, recibirás un enlace de recuperación.
          </AlertBanner>
          <p className="text-sm text-muted-foreground">
            Para probar el flujo en modo demo, abre{" "}
            <Link
              to="/reset-password/$token"
              params={{ token: "valid-token" }}
              className="font-medium text-primary hover:underline"
            >
              el enlace de recuperación de ejemplo
            </Link>
            .
          </p>
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
            Usar otro correo
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {error ? <AlertBanner variant="error">{error}</AlertBanner> : null}
          <InputField
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
