import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { ErrorState } from "@/components/layout/ErrorState";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Página no encontrada — Quiero Reservar" },
      { name: "description", content: "La página que buscas no existe o fue movida." },
      { property: "og:title", content: "Página no encontrada — Quiero Reservar" },
      { property: "og:description", content: "La página que buscas no existe o fue movida." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ErrorState
      code="Error 404"
      title="Página no encontrada"
      message="La página que buscas no existe o fue movida. Revisa el enlace e inténtalo de nuevo."
      icon={Compass}
    />
  ),
});
