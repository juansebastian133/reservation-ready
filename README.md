# Quiero Reservar — Sprint 1

Plataforma de reservas. Este sprint cubre **Gestión de usuarios y acceso a la plataforma**
(registro, inicio de sesión, verificación de correo, recuperación de contraseña y perfil).

Todo el backend es **simulado** (mock) con promesas y retardos de 500 ms. No hay servidor real.

## Stack

- React 19 + TypeScript
- TanStack Start / TanStack Router (enrutador del proyecto, en lugar de React Router)
- Tailwind CSS v4 + shadcn/ui + lucide-react
- react-hook-form + zod
- sonner para toasts
- Sesión en Context API (`AuthContext`) persistida en `localStorage`

## Ejecutar

```bash
bun install
bun run dev
```

La app queda disponible en `http://localhost:8080`.

## Credenciales de prueba

| Cuenta               | Correo                  | Contraseña | Estado        |
| -------------------- | ----------------------- | ---------- | ------------- |
| Cliente              | cliente@demo.com        | Demo123!   | Activa        |
| Proveedor            | proveedor@demo.com      | Demo123!   | Activa        |
| Sin verificar        | sinverificar@demo.com   | Demo123!   | No verificada |
| Inactiva / bloqueada | inactiva@demo.com       | Demo123!   | Inactiva      |

Códigos de proveedor válidos y disponibles: `PROV-1001`, `PROV-1002`, `PROV-1003`,
`QR-BELLEZA-01`, `QR-SALUD-01`. El código `PROV-2024` ya está usado (sirve para probar el error).

Cualquier correo terminado en `@error.com` simula un fallo de red.

## Rutas

Públicas:

- `/` landing con CTA de registro e inicio de sesión
- `/register` registro con selector de rol (Cliente / Proveedor)
- `/login` inicio de sesión (credenciales demo visibles)
- `/verify-email` pantalla posterior al registro, con reenvío y cooldown de 60 s
- `/verify-email/$token` resultado de la verificación (`valid-token` = éxito, `expired-token` = error)
- `/forgot-password` solicitud de recuperación
- `/reset-password/$token` nueva contraseña (`valid-token` funciona)

Protegidas (requieren sesión):

- `/dashboard/cliente`
- `/dashboard/proveedor`
- `/profile`

Errores: `/403`, `/404`, `/500`.

## Reglas implementadas

- Validaciones en cliente antes de llamar al mock; checklist visual de requisitos de contraseña.
- Login nunca revela si el correo existe: "Correo o contraseña incorrectos".
- Estados de cuenta: no verificada (con reenvío) e inactiva.
- 5 intentos fallidos consecutivos ⇒ bloqueo temporal de 15 minutos (persistido en `localStorage`).
- Recuperación con mensaje genérico: "Si el correo existe, recibirás un enlace de recuperación".
- Perfil: teléfono colombiano (10 dígitos, `+57` opcional), rol y código de proveedor de solo lectura,
  aviso al cambiar el correo.
- Accesibilidad: labels asociados, `aria-invalid`/`aria-describedby`, focus visible, navegación por teclado.

## Fuera de alcance

Panel de administrador, MFA, catálogo, horarios, reservas e integración real con backend.

## Estructura

```
src/
  components/auth/       AuthLayout, AlertBanner, InputField, PasswordInput, RoleSelector, ProtectedRoute
  components/layout/     DashboardLayout, ErrorState
  context/AuthContext.tsx
  lib/validation.ts      esquemas zod y reglas de contraseña
  mocks/                 data.ts (usuarios, códigos, tokens) y api.ts (llamadas simuladas)
  routes/                pantallas
```
