import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  code,
  title,
  message,
  icon: Icon,
  action,
}: {
  code: string;
  title: string;
  message: string;
  icon: LucideIcon;
  action?: { label: string; to: "/" | "/login" };
}) {
  const target = action ?? { label: "Volver al inicio", to: "/" as const };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold tracking-widest text-muted-foreground">{code}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to={target.to}>{target.label}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
