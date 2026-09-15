export type UserRole = "cliente" | "proveedor";
export type AccountStatus = "activa" | "no_verificada" | "inactiva";

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: AccountStatus;
  phone?: string | undefined;
  providerCode?: string | undefined;
  serviceType?: string | undefined;
  description?: string | undefined;
  pendingEmail?: string | undefined;
}

export interface ProviderCode {
  code: string;
  used: boolean;
}

/** Mutable in-memory "database" (mock only). */
export const mockUsers: MockUser[] = [
  {
    id: "u-1",
    fullName: "Camila Restrepo",
    email: "cliente@demo.com",
    password: "Demo123!",
    role: "cliente",
    status: "activa",
    phone: "3001234567",
  },
  {
    id: "u-2",
    fullName: "Servicios Aurora S.A.S.",
    email: "proveedor@demo.com",
    password: "Demo123!",
    role: "proveedor",
    status: "activa",
    phone: "+57 301 7654321",
    providerCode: "PROV-2024",
    serviceType: "Salón de belleza",
    description: "Cortes, color y tratamientos capilares en el centro de Medellín.",
  },
  {
    id: "u-3",
    fullName: "Cuenta Sin Verificar",
    email: "sinverificar@demo.com",
    password: "Demo123!",
    role: "cliente",
    status: "no_verificada",
  },
  {
    id: "u-4",
    fullName: "Cuenta Inactiva",
    email: "inactiva@demo.com",
    password: "Demo123!",
    role: "cliente",
    status: "inactiva",
  },
];

export const providerCodes: ProviderCode[] = [
  { code: "PROV-2024", used: true },
  { code: "PROV-1001", used: false },
  { code: "PROV-1002", used: false },
  { code: "PROV-1003", used: false },
  { code: "QR-BELLEZA-01", used: false },
  { code: "QR-SALUD-01", used: false },
];

export const serviceTypes = [
  "Salón de belleza",
  "Barbería",
  "Spa y bienestar",
  "Consultorio médico",
  "Odontología",
  "Asesoría profesional",
  "Deportes y fitness",
  "Otro",
];

/** Verification / reset tokens. `valid-token` funciona, `expired-token` falla. */
export const validTokens = new Set<string>(["valid-token", "abc123"]);
export const expiredTokens = new Set<string>(["expired-token"]);
