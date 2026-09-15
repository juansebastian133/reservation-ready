import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as api from "@/mocks/api";
import type { MockUser, UserRole } from "@/mocks/data";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string | undefined;
  providerCode?: string | undefined;
  serviceType?: string | undefined;
  description?: string | undefined;
  pendingEmail?: string | undefined;
}

const STORAGE_KEY = "qr-session";
const ATTEMPTS_KEY = "qr-login-attempts";
const LOCK_MINUTES = 15;
const MAX_ATTEMPTS = 5;

interface AttemptsState {
  count: number;
  lockedUntil: number | null;
}

interface AuthContextValue {
  user: SessionUser | null;
  hydrated: boolean;
  attempts: AttemptsState;
  login: (email: string, password: string) => Promise<SessionUser>;
  logout: () => void;
  updateUser: (user: SessionUser) => void;
  dashboardPath: (role: UserRole) => "/dashboard/cliente" | "/dashboard/proveedor";
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toSession(user: MockUser): SessionUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    providerCode: user.providerCode,
    serviceType: user.serviceType,
    description: user.description,
    pendingEmail: user.pendingEmail,
  };
}

function readAttempts(): AttemptsState {
  if (typeof window === "undefined") return { count: 0, lockedUntil: null };
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { count: 0, lockedUntil: null };
    const parsed = JSON.parse(raw) as AttemptsState;
    if (parsed.lockedUntil && parsed.lockedUntil < Date.now()) {
      window.localStorage.removeItem(ATTEMPTS_KEY);
      return { count: 0, lockedUntil: null };
    }
    return parsed;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [attempts, setAttempts] = useState<AttemptsState>({ count: 0, lockedUntil: null });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore corrupt storage */
    }
    setAttempts(readAttempts());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: SessionUser | null) => {
    setUser(next);
    if (typeof window === "undefined") return;
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const saveAttempts = useCallback((next: AttemptsState) => {
    setAttempts(next);
    if (typeof window === "undefined") return;
    if (next.count === 0) window.localStorage.removeItem(ATTEMPTS_KEY);
    else window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(next));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const current = readAttempts();
      if (current.lockedUntil && current.lockedUntil > Date.now()) {
        setAttempts(current);
        throw new api.ApiError(
          "locked",
          `Cuenta bloqueada temporalmente por ${LOCK_MINUTES} minutos`,
        );
      }
      try {
        const found = await api.loginUser(email, password);
        saveAttempts({ count: 0, lockedUntil: null });
        const session = toSession(found);
        persist(session);
        return session;
      } catch (error) {
        if (error instanceof api.ApiError && error.code === "invalid_credentials") {
          const count = current.count + 1;
          if (count >= MAX_ATTEMPTS) {
            saveAttempts({ count, lockedUntil: Date.now() + LOCK_MINUTES * 60_000 });
            throw new api.ApiError(
              "locked",
              `Cuenta bloqueada temporalmente por ${LOCK_MINUTES} minutos`,
            );
          }
          saveAttempts({ count, lockedUntil: null });
        }
        throw error;
      }
    },
    [persist, saveAttempts],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      attempts,
      login,
      logout: () => persist(null),
      updateUser: (next: SessionUser) => persist(next),
      dashboardPath: (role: UserRole) =>
        role === "proveedor" ? "/dashboard/proveedor" : "/dashboard/cliente",
    }),
    [user, hydrated, attempts, login, persist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export { MAX_ATTEMPTS, LOCK_MINUTES };
