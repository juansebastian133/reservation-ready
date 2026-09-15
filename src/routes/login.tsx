import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { InputField } from "@/components/auth/InputField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { ApiError, resendVerification } from "@/mocks/api";
import { MAX_ATTEMPTS, useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Quiero Reservar" },
      {
        name: "description",
        content: "Accede a tu cuenta de Quiero Reservar para gestionar tus reservas o tu agenda.",
      },
      { property: "og:title", content: "Iniciar sesión — Quiero Reservar" },
      {
        property: "og:description",
        content: "Accede a tu cuenta de Quiero Reservar.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, attempts, dashboardPath } = useAuth();
  const [banner, setBanner] = useState<{
    variant: "error" | "warning" | "info";
    message: string;
    unverified?: boolean;
  } | null>(null);
  const [resending, setResending] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  const remaining = Math.max(0, MAX_ATTEMPTS - attempts.count);

  async function onSubmit(values: LoginValues) {
    setBanner(null);
    try {
      const session = await login(values.email, values.password);
      toast.success(`Bienvenido de nuevo, ${session.fullName.split(" ")[0]}`);
      navigate({ to: dashboardPath(session.role), replace: true });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setBanner({ variant: "error", message: "Ocurrió un error inesperado. Intenta de nuevo." });
        return;
      }
      if (error.code === "unverified") {
        setBanner({ variant: "warning", message: error.message, unverified: true });
        return;
      }
      if (error.code === "inactive" || error.code === "locked") {
        setBanner({ variant: "error", message: error.message });
        return;
      }
      setBanner({ variant: "error", message: "Correo o contraseña incorrectos" });
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await resendVerification(form.getValues("email"));
      toast.success("Correo de verificación reenviado");
      navigate({ to: "/verify-email", search: { email: form.getValues("email") } });
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Ingresa tus datos para acceder a tu panel."
      footer={
        <p>
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Registrarse
          </Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {banner ? (
          <AlertBanner
            variant={banner.variant}
            action={
              banner.unverified ? (
                <Button size="sm" variant="outline" onClick={handleResend} disabled={resending}>
                  {resending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : null}
                  Reenviar correo
                </Button>
              ) : undefined
            }
          >
            {banner.message}
          </AlertBanner>
        ) : null}

        {attempts.count > 0 && attempts.count < MAX_ATTEMPTS && !attempts.lockedUntil ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Te quedan {remaining} {remaining === 1 ? "intento" : "intentos"} antes del bloqueo
            temporal.
          </p>
        ) : null}

        <InputField
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <PasswordInput
          label="Contraseña"
          autoComplete="current-password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Ingresando...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      <div className="mt-8 rounded-lg border border-dashed bg-muted/40 p-4 text-sm">
        <p className="font-medium">Credenciales de prueba (modo demo)</p>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li>Cliente: cliente@demo.com / Demo123!</li>
          <li>Proveedor: proveedor@demo.com / Demo123!</li>
          <li>Sin verificar: sinverificar@demo.com / Demo123!</li>
          <li>Inactiva: inactiva@demo.com / Demo123!</li>
        </ul>
      </div>
    </AuthLayout>
  );
}
