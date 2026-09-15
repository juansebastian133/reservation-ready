import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { InputField } from "@/components/auth/InputField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema, type RegisterValues } from "@/lib/validation";
import { ApiError, checkEmailAvailable, checkProviderCode, registerUser } from "@/mocks/api";
import { serviceTypes } from "@/mocks/data";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Crear cuenta — Quiero Reservar" },
      {
        name: "description",
        content: "Regístrate como cliente o proveedor en Quiero Reservar y empieza a gestionar tus reservas.",
      },
      { property: "og:title", content: "Crear cuenta — Quiero Reservar" },
      {
        property: "og:description",
        content: "Regístrate como cliente o proveedor en Quiero Reservar.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "cliente",
      providerCode: "",
      serviceType: "",
      description: "",
    },
  });

  const role = form.watch("role");
  const password = form.watch("password");
  const errors = form.formState.errors;

  async function onSubmit(values: RegisterValues) {
    setFormError(null);

    const available = await checkEmailAvailable(values.email);
    if (!available) {
      form.setError("email", { message: "Este correo ya está registrado" });
      return;
    }

    if (values.role === "proveedor") {
      const check = await checkProviderCode(values.providerCode ?? "");
      if (!check.ok) {
        form.setError("providerCode", {
          message: check.reason ?? "El código de proveedor es inválido o ya fue usado",
        });
        return;
      }
    }

    try {
      await registerUser(values);
      toast.success("Cuenta creada. Revisa tu correo para verificarla.");
      navigate({ to: "/verify-email", search: { email: values.email } });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Ocurrió un error inesperado. Intenta de nuevo.";
      if (error instanceof ApiError && error.code === "email_taken") {
        form.setError("email", { message });
        return;
      }
      if (error instanceof ApiError && error.code === "provider_code") {
        form.setError("providerCode", { message });
        return;
      }
      setFormError(message);
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Regístrate como cliente para reservar o como proveedor para recibir reservas."
      footer={
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Iniciar sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {formError ? <AlertBanner variant="error">{formError}</AlertBanner> : null}

        <RoleSelector
          value={role}
          onChange={(next) => form.setValue("role", next, { shouldValidate: true })}
        />

        <InputField
          label="Nombre completo"
          autoComplete="name"
          placeholder="Ej: Camila Restrepo"
          error={errors.fullName?.message}
          {...form.register("fullName")}
        />

        <InputField
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          error={errors.email?.message}
          {...form.register("email")}
        />

        <PasswordInput
          label="Contraseña"
          autoComplete="new-password"
          showChecklist
          checklistValue={password}
          error={errors.password?.message}
          {...form.register("password")}
        />

        <PasswordInput
          label="Confirmar contraseña"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...form.register("confirmPassword")}
        />

        {role === "proveedor" ? (
          <div className="space-y-6 rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">Datos del proveedor</p>

            <InputField
              label="Código de proveedor"
              placeholder="Ej: PROV-1001"
              helperText="Códigos de prueba disponibles: PROV-1001, PROV-1002, QR-BELLEZA-01"
              error={errors.providerCode?.message}
              {...form.register("providerCode")}
            />

            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de servicio</Label>
              <Select
                value={form.watch("serviceType") || ""}
                onValueChange={(value) =>
                  form.setValue("serviceType", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="serviceType" aria-invalid={!!errors.serviceType}>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceType ? (
                <p className="text-sm text-destructive">{errors.serviceType.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del servicio</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Cuéntanos qué ofreces, dónde estás y qué te diferencia."
                aria-invalid={!!errors.description}
                {...form.register("description")}
              />
              {errors.description ? (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Mínimo 20 caracteres.</p>
              )}
            </div>
          </div>
        ) : null}

        <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
