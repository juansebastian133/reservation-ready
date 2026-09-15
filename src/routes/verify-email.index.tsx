import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { Button } from "@/components/ui/button";
import { resendVerification } from "@/mocks/api";

const searchSchema = z.object({ email: z.string().optional() });

export const Route = createFileRoute("/verify-email/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Verifica tu correo — Quiero Reservar" },
      {
        name: "description",
        content: "Confirma tu dirección de correo para activar tu cuenta de Quiero Reservar.",
      },
      { property: "og:title", content: "Verifica tu correo — Quiero Reservar" },
      {
        property: "og:description",
        content: "Confirma tu correo para activar tu cuenta.",
      },
    ],
  }),
  component: VerifyEmailPage,
});

const COOLDOWN = 60;

function VerifyEmailPage() {
  const { email } = Route.useSearch();
  const [cooldown, setCooldown] = useState(COOLDOWN);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleResend() {
    setSending(true);
    try {
      await resendVerification(email ?? "");
      toast.success("Te reenviamos el correo de verificación");
      setCooldown(COOLDOWN);
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthLayout
      title="Revisa tu correo"
      subtitle="Hemos enviado un enlace de verificación para activar tu cuenta."
      footer={
        <p>
          ¿Ya la verificaste?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Iniciar sesión
          </Link>
        </p>
      }
    >
      <div className="space-y-6">
        <div className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Mail className="size-8" aria-hidden="true" />
        </div>

        <AlertBanner variant="info" title="Enlace enviado">
          Enviamos un enlace a{" "}
          <span className="font-medium">{email ?? "tu correo registrado"}</span>. Ábrelo para activar
          tu cuenta. Revisa también la carpeta de spam.
        </AlertBanner>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={cooldown > 0 || sending}
        >
          {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {cooldown > 0 ? `Reenviar correo en ${cooldown}s` : "Reenviar correo"}
        </Button>

        <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <MailCheck className="size-4" aria-hidden="true" />
            Modo demo
          </p>
          <p className="mt-2 text-muted-foreground">Simula abrir el enlace del correo:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link to="/verify-email/$token" params={{ token: "valid-token" }}>
                Enlace válido
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/verify-email/$token" params={{ token: "expired-token" }}>
                Enlace expirado
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
