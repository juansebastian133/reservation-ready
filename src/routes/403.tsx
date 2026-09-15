import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { ErrorState } from "@/components/layout/ErrorState";

export const Route = createFileRoute("/403")({
  head: () => ({
    meta: [
      { title: "Acceso denegado — Quiero Reservar" },
      { name: "description", content: "No tienes permisos para ver esta sección." },
      { property: "og:title", content: "Acceso denegado — Quiero Reservar" },
      { property: "og:description", content: "No tienes permisos para ver esta sección." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ErrorState
      code="Error 403"
      title="Acceso denegado"
      message="Tu cuenta no tiene permisos para ver esta sección. Verifica que estés usando el rol correcto."
      icon={ShieldAlert}
    />
  ),
});
