import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { Button } from "@/components/ui/button";
import { verifyEmailToken } from "@/mocks/api";

export const Route = createFileRoute("/verify-email/$token")({
  head: () => ({
    meta: [
      { title: "Activación de cuenta — Quiero Reservar" },
      {
        name: "description",
        content: "Resultado de la verificación del enlace enviado a tu correo.",
      },
      { property: "og:title", content: "Activación de cuenta — Quiero Reservar" },
      { property: "og:description", content: "Resultado de la verificación de tu correo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyTokenPage,
});

function VerifyTokenPage() {
  const { token } = Route.useParams();
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setState("loading");
    verifyEmailToken(token)
      .then(() => {
        if (active) setState("ok");
      })
      .catch((error: Error) => {
        if (!active) return;
        setMessage(error.message);
        setState("error");
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthLayout title="Verificación de correo" subtitle="Estamos confirmando tu enlace.">
      {state === "loading" ? (
        <div
          className="flex items-center gap-3 rounded-lg border bg-card p-6 text-sm text-muted-foreground"
          aria-live="polite"
        >
          <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
          Verificando tu enlace...
        </div>
      ) : state === "ok" ? (
        <div className="space-y-6">
          <div className="grid size-16 place-items-center rounded-2xl bg-success-soft text-success">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </div>
          <AlertBanner variant="success" title="Cuenta activada">
            Tu correo fue verificado correctamente. Ya puedes iniciar sesión.
          </AlertBanner>
          <Button asChild className="w-full" size="lg">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid size-16 place-items-center rounded-2xl bg-destructive-soft text-destructive">
            <MailWarning className="size-8" aria-hidden="true" />
          </div>
          <AlertBanner variant="error" title="No pudimos verificar tu cuenta">
            {message || "Enlace expirado, solicita uno nuevo"}
          </AlertBanner>
          <Button asChild className="w-full" size="lg" variant="outline">
            <Link to="/verify-email" search={{}}>
              Solicitar un enlace nuevo
            </Link>
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
