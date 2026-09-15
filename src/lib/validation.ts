import { z } from "zod";

export const passwordRules = [
  { id: "len", label: "Mínimo 8 caracteres", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Al menos una mayúscula", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "Al menos un número", test: (v: string) => /\d/.test(v) },
  {
    id: "special",
    label: "Al menos un carácter especial",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
];

export const passwordSchema = z
  .string()
  .min(1, "La contraseña es obligatoria")
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "La contraseña debe incluir una mayúscula")
  .regex(/\d/, "La contraseña debe incluir un número")
  .regex(/[^A-Za-z0-9]/, "La contraseña debe incluir un carácter especial");

export const emailSchema = z
  .string()
  .min(1, "El correo es obligatorio")
  .email("Ingresa un correo con formato válido");

/** Colombiano: 10 dígitos, +57 opcional, espacios permitidos. */
export const phoneSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || /^(\+?57\s?)?3\d{2}\s?\d{3}\s?\d{4}$/.test(v), {
    message: "Formato inválido. Ej: 3001234567 o +57 300 1234567",
  });

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, "Ingresa tu nombre completo"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    role: z.enum(["cliente", "proveedor"]),
    providerCode: z.string().optional(),
    serviceType: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })
  .refine((d) => d.role !== "proveedor" || (d.providerCode ?? "").trim().length >= 4, {
    path: ["providerCode"],
    message: "Ingresa tu código de proveedor",
  })
  .refine((d) => d.role !== "proveedor" || !!d.serviceType, {
    path: ["serviceType"],
    message: "Selecciona el tipo de servicio",
  })
  .refine((d) => d.role !== "proveedor" || (d.description ?? "").trim().length >= 20, {
    path: ["description"],
    message: "Describe tu servicio (mínimo 20 caracteres)",
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "La contraseña es obligatoria"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotSchema = z.object({ email: emailSchema });

export const resetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export const profileSchema = z.object({
  fullName: z.string().trim().min(3, "Ingresa tu nombre completo"),
  phone: phoneSchema,
  email: emailSchema,
  serviceType: z.string().optional(),
  description: z.string().optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;
