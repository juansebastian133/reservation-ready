import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Store,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quiero Reservar — Reserva servicios en minutos" },
      {
        name: "description",
        content:
          "Plataforma de reservas para clientes y proveedores: crea tu cuenta, verifica tu correo y gestiona tu agenda desde un solo lugar.",
      },
      { property: "og:title", content: "Quiero Reservar — Reserva servicios en minutos" },
      {
        property: "og:description",
        content: "Crea tu cuenta como cliente o proveedor y empieza a gestionar reservas hoy.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: UserCheck,
    title: "Cuentas verificadas",
    text: "Registro con verificación de correo para clientes y proveedores.",
  },
  {
    icon: CalendarDays,
    title: "Agenda clara",
    text: "Consulta disponibilidad y confirma en pocos pasos, sin llamadas.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso seguro",
    text: "Bloqueo por intentos fallidos y recuperación de contraseña guiada.",
  },
];

function Landing() {
  const { user, dashboardPath } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <span className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <CalendarCheck className="size-5" aria-hidden="true" />
          </span>
          Quiero Reservar
        </span>
        <nav className="flex items-center gap-2">
          {user ? (
            <Button asChild>
              <Link to={dashboardPath(user.role)}>Ir a mi panel</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-16 sm:px-8 sm:pt-20">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Sprint 1 · Gestión de usuarios y acceso
            </span>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              Reserva lo que necesitas, cuando lo necesitas.
            </h1>
            <p className="text-lg text-muted-foreground">
              Quiero Reservar conecta a clientes con proveedores de servicios. Crea tu cuenta,
              verifica tu correo y gestiona todo desde tu panel.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/register">
                  Registrarse
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Modo demo: <span className="font-medium text-foreground">cliente@demo.com</span> /{" "}
              <span className="font-medium text-foreground">Demo123!</span>
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg border bg-card p-6 shadow-soft">
                <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-start gap-4 rounded-lg border bg-gradient-brand p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Store className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold">¿Ofreces servicios?</h2>
                <p className="text-sm text-primary-foreground/85">
                  Regístrate como proveedor con tu código y publica tu disponibilidad.
                </p>
              </div>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link to="/register">Quiero ser proveedor</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-muted-foreground sm:px-8">
          © {new Date().getFullYear()} Quiero Reservar · Demo con datos simulados
        </div>
      </footer>
    </div>
  );
}
