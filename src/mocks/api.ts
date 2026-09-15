import {
  expiredTokens,
  mockUsers,
  providerCodes,
  validTokens,
  type MockUser,
  type UserRole,
} from "./data";

const DELAY = 500;

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function delay<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function fail(code: string, message: string, ms = DELAY): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new ApiError(code, message)), ms));
}

const normalize = (email: string) => email.trim().toLowerCase();

export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((u) => u.email === normalize(email));
}

export async function checkEmailAvailable(email: string): Promise<boolean> {
  return delay(!findUserByEmail(email), 350);
}

export async function checkProviderCode(code: string): Promise<{ ok: boolean; reason?: string }> {
  const entry = providerCodes.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!entry) return delay({ ok: false, reason: "El código de proveedor es inválido" }, 350);
  if (entry.used) return delay({ ok: false, reason: "Este código ya fue usado" }, 350);
  return delay({ ok: true }, 350);
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
  if (normalize(input.email).endsWith("@error.com")) {
    return fail("network", "No pudimos conectar con el servidor. Intenta de nuevo.");
  }
  if (findUserByEmail(input.email)) {
    return fail("email_taken", "Este correo ya está registrado");
  }
  if (input.role === "proveedor") {
    const check = await checkProviderCode(input.providerCode ?? "");
    if (!check.ok) {
      return fail("provider_code", "El código de proveedor es inválido o ya fue usado");
    }
    const entry = providerCodes.find(
      (c) => c.code.toUpperCase() === (input.providerCode ?? "").trim().toUpperCase(),
    );
    if (entry) entry.used = true;
  }

  mockUsers.push({
    id: `u-${mockUsers.length + 1}`,
    fullName: input.fullName.trim(),
    email: normalize(input.email),
    password: input.password,
    role: input.role,
    status: "no_verificada",
    providerCode: input.providerCode?.trim().toUpperCase(),
    serviceType: input.serviceType,
    description: input.description,
  });

  return delay({ email: normalize(input.email) });
}

export async function loginUser(email: string, password: string): Promise<MockUser> {
  if (normalize(email).endsWith("@error.com")) {
    return fail("network", "No pudimos conectar con el servidor. Intenta de nuevo.");
  }
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return fail("invalid_credentials", "Correo o contraseña incorrectos");
  }
  if (user.status === "no_verificada") {
    return fail("unverified", "Debes verificar tu correo antes de iniciar sesión");
  }
  if (user.status === "inactiva") {
    return fail("inactive", "Esta cuenta está inactiva. Contacte al administrador");
  }
  return delay(user);
}

export async function resendVerification(email: string): Promise<void> {
  await delay(null);
  void email;
}

export async function verifyEmailToken(token: string): Promise<void> {
  if (expiredTokens.has(token) || !validTokens.has(token)) {
    return fail("expired", "Enlace expirado, solicita uno nuevo");
  }
  const pending = mockUsers.find((u) => u.status === "no_verificada");
  if (pending) pending.status = "activa";
  return delay(undefined);
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (normalize(email).endsWith("@error.com")) {
    return fail("network", "No pudimos conectar con el servidor. Intenta de nuevo.");
  }
  return delay(undefined);
}

export async function resetPassword(token: string, password: string): Promise<void> {
  if (expiredTokens.has(token) || !validTokens.has(token)) {
    return fail("expired", "Enlace expirado, solicita uno nuevo");
  }
  void password;
  return delay(undefined);
}

export interface ProfileInput {
  fullName: string;
  phone?: string | undefined;
  email: string;
  serviceType?: string | undefined;
  description?: string | undefined;
}

export async function updateProfile(userId: string, input: ProfileInput): Promise<MockUser> {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return fail("not_found", "Usuario no encontrado");
  const emailChanged = normalize(input.email) !== user.email;
  if (emailChanged && findUserByEmail(input.email)) {
    return fail("email_taken", "Este correo ya está registrado");
  }
  user.fullName = input.fullName.trim();
  user.phone = input.phone?.trim();
  if (user.role === "proveedor") {
    user.serviceType = input.serviceType;
    user.description = input.description;
  }
  user.pendingEmail = emailChanged ? normalize(input.email) : undefined;
  return delay({ ...user });
}
