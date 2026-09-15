import { Link } from "@tanstack/react-router";
import { CalendarCheck, ShieldCheck, Sparkles, Clock } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const highlights = [
  { icon: CalendarCheck, text: "Agenda y confirma reservas en segundos" },
  { icon: ShieldCheck, text: "Cuentas verificadas para clientes y proveedores" },
  { icon: Clock, text: "Disponibilidad en tiempo real, sin llamadas" },
];

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="hidden bg-gradient-brand p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-lg bg-primary-foreground/15">
            <CalendarCheck className="size-5" aria-hidden="true" />
          </span>
          Quiero Reservar
        </Link>

        <div className="max-w-md space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Sprint 1 · Acceso a la plataforma
            </span>
            <h2 className="text-3xl leading-tight font-semibold tracking-tight">
              La forma más simple de reservar y de ser reservado.
            </h2>
          </div>
          <ul className="space-y-4 text-sm text-primary-foreground/90">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-primary-foreground/15">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} Quiero Reservar · Demo con datos simulados
        </p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 flex items-center gap-2 text-base font-semibold tracking-tight lg:hidden"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <CalendarCheck className="size-4" aria-hidden="true" />
            </span>
            Quiero Reservar
          </Link>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>

          <div className="mt-8">{children}</div>

          {footer ? <div className="mt-8 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
