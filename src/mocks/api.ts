import type { MockUser, UserRole } from "./data";

/**
 * Este archivo reemplaza el mock en memoria por llamadas HTTP reales al backend
 * (ver /backend). Mantiene exactamente las mismas firmas y nombres exportados
 * que el mock original para que ninguna página/ruta necesite cambios.
 *
 * Requiere VITE_API_URL apuntando al backend (ver .env.example).
 */

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      credentials: "include", // envía/recibe la cookie httpOnly de sesión
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("network", "No pudimos conectar con el servidor. Intenta de nuevo.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const body = (payload ?? {}) as { code?: string; message?: string };
    throw new ApiError(
      body.code ?? "unknown",
      body.message ?? "Ocurrió un error inesperado. Intenta de nuevo.",
    );
  }

  return payload as T;
}

/** El backend nunca envía el hash de la contraseña; este campo no se usa en ningún lado. */
const NO_PASSWORD = "";

function toMockUser(u: {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  providerCode?: string;
  serviceType?: string;
  description?: string;
  pendingEmail?: string;
}): MockUser {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    password: NO_PASSWORD,
    role: u.role,
    // Solo se llega aquí si la sesión ya es válida, es decir la cuenta está activa.
    status: "activa",
    phone: u.phone,
    providerCode: u.providerCode,
    serviceType: u.serviceType,
    description: u.description,
    pendingEmail: u.pendingEmail,
  };
}

export async function checkEmailAvailable(email: string): Promise<boolean> {
  const result = await request<{ available: boolean }>(
    `/api/auth/check-email?email=${encodeURIComponent(email)}`,
  );
  return result.available;
}

export async function checkProviderCode(code: string): Promise<{ ok: boolean; reason?: string }> {
  return request<{ ok: boolean; reason?: string }>(
    `/api/auth/check-provider-code?code=${encodeURIComponent(code)}`,
  );
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  providerCode?: string | undefined;
  serviceType?: string | undefined;
  description?: string | undefined;
}

export async function registerUser(input: RegisterInput): Promise<{ email: string }> {
  return request<{ email: string }>("/api/auth/register", { method: "POST", body: input });
}

export async function loginUser(email: string, password: string): Promise<MockUser> {
  const user = await request<Parameters<typeof toMockUser>[0]>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return toMockUser(user);
}

export async function resendVerification(email: string): Promise<void> {
  await request<void>("/api/auth/resend-verification", { method: "POST", body: { email } });
}

export async function verifyEmailToken(token: string): Promise<void> {
  await request<void>(`/api/auth/verify-email/${encodeURIComponent(token)}`, { method: "POST" });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await request<void>("/api/auth/forgot-password", { method: "POST", body: { email } });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await request<void>(`/api/auth/reset-password/${encodeURIComponent(token)}`, {
    method: "POST",
    body: { password },
  });
}

export async function logoutUser(): Promise<void> {
  await request<void>("/api/auth/logout", { method: "POST" });
}

export interface ProfileInput {
  fullName: string;
  phone?: string | undefined;
  email: string;
  serviceType?: string | undefined;
  description?: string | undefined;
}

export async function updateProfile(userId: string, input: ProfileInput): Promise<MockUser> {
  const user = await request<Parameters<typeof toMockUser>[0]>(
    `/api/users/${encodeURIComponent(userId)}/profile`,
    { method: "PUT", body: input },
  );
  return toMockUser(user);
}
