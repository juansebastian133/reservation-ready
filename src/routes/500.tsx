import { createFileRoute } from "@tanstack/react-router";
import { ServerCrash } from "lucide-react";
import { ErrorState } from "@/components/layout/ErrorState";

export const Route = createFileRoute("/500")({
  head: () => ({
    meta: [
      { title: "Error del servidor — Quiero Reservar" },
      { name: "description", content: "Ocurrió un error inesperado en el servidor." },
      { property: "og:title", content: "Error del servidor — Quiero Reservar" },
      { property: "og:description", content: "Ocurrió un error inesperado en el servidor." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ErrorState
      code="Error 500"
      title="Algo salió mal"
      message="Tuvimos un problema procesando tu solicitud. Intenta de nuevo en unos minutos."
      icon={ServerCrash}
    />
  ),
});
