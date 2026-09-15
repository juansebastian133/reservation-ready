import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarCheck,
  CalendarDays,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Store,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type NavItem = { label: string; to: string; icon: typeof LayoutDashboard };

const clienteNav: NavItem[] = [
  { label: "Inicio", to: "/dashboard/cliente", icon: LayoutDashboard },
  { label: "Mis reservas", to: "/dashboard/cliente", icon: CalendarDays },
  { label: "Favoritos", to: "/dashboard/cliente", icon: Heart },
  { label: "Mi perfil", to: "/profile", icon: User },
];

const proveedorNav: NavItem[] = [
  { label: "Inicio", to: "/dashboard/proveedor", icon: LayoutDashboard },
  { label: "Agenda", to: "/dashboard/proveedor", icon: CalendarDays },
  { label: "Mi negocio", to: "/dashboard/proveedor", icon: Store },
  { label: "Mi perfil", to: "/profile", icon: User },
];

export function DashboardLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const nav = user?.role === "proveedor" ? proveedorNav : clienteNav;

  const initials = (user?.fullName ?? "")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  function handleLogout() {
    logout();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex w-full max-w-7xl">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r bg-sidebar p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
          aria-label="Menú principal"
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <CalendarCheck className="size-4" aria-hidden="true" />
              </span>
              Quiero Reservar
            </Link>
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-8 space-y-1">
            {nav.map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
                activeOptions={{ exact: true }}
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute inset-x-5 bottom-5">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="size-4" aria-hidden="true" />
              Cerrar sesión
            </Button>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur sm:px-8">
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.role === "proveedor" ? "Proveedor" : "Cliente"} · {user?.email}
              </p>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
              {initials || "QR"}
            </span>
          </header>

          <main className="px-4 py-8 sm:px-8">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            <div className="mt-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
