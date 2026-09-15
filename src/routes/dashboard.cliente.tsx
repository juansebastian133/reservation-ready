import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, Heart, MapPin, Star, UserCog } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/dashboard/cliente")({
  head: () => ({
    meta: [
      { title: "Panel del cliente — Quiero Reservar" },
      {
        name: "description",
        content: "Consulta tus próximas reservas y gestiona tu cuenta de cliente.",
      },
      { property: "og:title", content: "Panel del cliente — Quiero Reservar" },
      { property: "og:description", content: "Consulta tus próximas reservas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute role="cliente">
      <ClienteDashboard />
    </ProtectedRoute>
  ),
});

const stats = [
  { label: "Reservas activas", value: "0", icon: CalendarDays },
  { label: "Proveedores favoritos", value: "0", icon: Heart },
  { label: "Historial", value: "0", icon: Clock },
];

function ClienteDashboard() {
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "";

  return (
    <DashboardLayout
      title={`Hola, ${firstName}`}
      description="Este es tu panel de cliente. Aquí verás tus reservas cuando estén disponibles."
    >
      <div className="space-y-6">
        <AlertBanner variant="info" title="Sprint 1">
          El catálogo de servicios y la creación de reservas llegan en el próximo sprint. Por ahora
          puedes gestionar tu cuenta y tu perfil.
        </AlertBanner>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Próximas reservas</h2>
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
              <span className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                <CalendarDays className="size-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium">Aún no tienes reservas</p>
              <p className="text-sm text-muted-foreground">
                Cuando el catálogo esté disponible podrás reservar en pocos pasos.
              </p>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Tu cuenta</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Nombre</dt>
                <dd className="text-right font-medium">{user?.fullName}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Correo</dt>
                <dd className="text-right font-medium break-all">{user?.email}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Teléfono</dt>
                <dd className="text-right font-medium">{user?.phone ?? "Sin registrar"}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Rol</dt>
                <dd className="text-right font-medium">Cliente</dd>
              </div>
            </dl>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link to="/profile">
                <UserCog className="size-4" aria-hidden="true" />
                Editar mi perfil
              </Link>
            </Button>
          </section>
        </div>

        <section className="rounded-lg border bg-card p-6 shadow-soft">
          <h2 className="text-base font-semibold">Descubre proveedores</h2>
          <p className="mt-1 text-sm text-muted-foreground">Vista previa del próximo sprint.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {["Salón de belleza", "Barbería", "Spa y bienestar"].map((name) => (
              <div key={name} className="rounded-lg border p-4 opacity-70">
                <p className="text-sm font-medium">{name}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden="true" /> Medellín
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3.5" aria-hidden="true" /> Próximamente
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
