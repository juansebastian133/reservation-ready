import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/mocks/data";

export function ProtectedRoute({
  children,
  role,
}: {
  children: ReactNode;
  role?: UserRole;
}) {
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (role && user.role !== role) {
      navigate({ to: "/403", replace: true });
    }
  }, [hydrated, user, role, navigate]);

  if (!hydrated || !user || (role && user.role !== role)) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-10">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-80" />
        <div className="grid gap-4 pt-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
