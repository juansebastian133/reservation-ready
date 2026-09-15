import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarDays, Store, TrendingUp, UserCog, Users } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/dashboard/proveedor")({
  head: () => ({
    meta: [
      { title: "Panel del proveedor — Quiero Reservar" },
      {
        name: "description",
        content: "Administra la información de tu negocio y prepárate para recibir reservas.",
      },
      { property: "og:title", content: "Panel del proveedor — Quiero Reservar" },
      { property: "og:description", content: "Administra la información de tu negocio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute role="proveedor">
      <ProveedorDashboard />
    </ProtectedRoute>
  ),
});

const stats = [
  { label: "Reservas de hoy", value: "0", icon: CalendarDays },
  { label: "Clientes atendidos", value: "0", icon: Users },
  { label: "Ocupación semanal", value: "0%", icon: TrendingUp },
];

function ProveedorDashboard() {
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "";

  return (
    <DashboardLayout
      title={`Hola, ${firstName}`}
      description="Este es tu panel de proveedor. Completa tu información para estar listo cuando abramos la agenda."
    >
      <div className="space-y-6">
        <AlertBanner variant="info" title="Sprint 1">
          La agenda, los horarios y las reservas llegan en el próximo sprint. Por ahora puedes
          mantener actualizados tus datos de negocio.
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
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Store className="size-4 text-primary" aria-hidden="true" />
              Mi negocio
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Tipo de servicio</dt>
                <dd className="text-right font-medium">{user?.serviceType ?? "Sin definir"}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Código de proveedor</dt>
                <dd className="flex items-center gap-1 text-right font-medium">
                  <BadgeCheck className="size-4 text-success" aria-hidden="true" />
                  {user?.providerCode ?? "—"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Descripción</dt>
                <dd>{user?.description ?? "Aún no agregas una descripción."}</dd>
              </div>
            </dl>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link to="/profile">
                <UserCog className="size-4" aria-hidden="true" />
                Editar mi negocio
              </Link>
            </Button>
          </section>

          <section className="rounded-lg border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Agenda de hoy</h2>
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
              <span className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                <CalendarDays className="size-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium">Sin reservas programadas</p>
              <p className="text-sm text-muted-foreground">
                Tu agenda se activará cuando publiquemos los horarios.
              </p>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
