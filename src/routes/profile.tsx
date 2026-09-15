import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { InputField } from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { profileSchema, type ProfileValues } from "@/lib/validation";
import { ApiError, updateProfile } from "@/mocks/api";
import { serviceTypes } from "@/mocks/data";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Mi perfil — Quiero Reservar" },
      {
        name: "description",
        content: "Actualiza tus datos personales, tu teléfono y la información de tu servicio.",
      },
      { property: "og:title", content: "Mi perfil — Quiero Reservar" },
      { property: "og:description", content: "Actualiza tus datos personales." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      serviceType: user?.serviceType ?? "",
      description: user?.description ?? "",
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      fullName: user.fullName,
      phone: user.phone ?? "",
      email: user.email,
      serviceType: user.serviceType ?? "",
      description: user.description ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const isProvider = user?.role === "proveedor";
  const emailChanged = (form.watch("email") ?? "").trim().toLowerCase() !== user?.email;

  async function onSubmit(values: ProfileValues) {
    if (!user) return;
    setError(null);
    try {
      const updated = await updateProfile(user.id, values);
      updateUser({
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        role: updated.role,
        phone: updated.phone,
        providerCode: updated.providerCode,
        serviceType: updated.serviceType,
        description: updated.description,
        pendingEmail: updated.pendingEmail,
      });
      toast.success("Perfil actualizado correctamente");
    } catch (err) {
      if (err instanceof ApiError && err.code === "email_taken") {
        form.setError("email", { message: err.message });
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Ocurrió un error inesperado. Intenta de nuevo.",
      );
    }
  }

  return (
    <DashboardLayout
      title="Mi perfil"
      description="Mantén tus datos actualizados para que podamos contactarte."
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-6"
        noValidate
      >
        {error ? <AlertBanner variant="error">{error}</AlertBanner> : null}

        {user?.pendingEmail ? (
          <AlertBanner variant="warning" title="Cambio de correo pendiente">
            Enviamos un enlace de confirmación a{" "}
            <span className="font-medium">{user.pendingEmail}</span>. El correo actual seguirá activo
            hasta confirmar.
          </AlertBanner>
        ) : null}

        <section className="space-y-6 rounded-lg border bg-card p-6 shadow-soft">
          <h2 className="text-base font-semibold">Datos personales</h2>

          <InputField
            label="Nombre completo"
            autoComplete="name"
            error={form.formState.errors.fullName?.message}
            {...form.register("fullName")}
          />

          <InputField
            label="Teléfono"
            inputMode="tel"
            autoComplete="tel"
            placeholder="3001234567"
            helperText="Formato colombiano de 10 dígitos. Ej: 3001234567 o +57 300 1234567"
            error={form.formState.errors.phone?.message}
            {...form.register("phone")}
          />

          <InputField
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />

          {emailChanged ? (
            <AlertBanner variant="info">
              Se enviará un enlace de confirmación al nuevo correo. El correo actual seguirá activo
              hasta confirmar.
            </AlertBanner>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              Rol
              <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </Label>
            <Input
              id="role"
              value={isProvider ? "Proveedor" : "Cliente"}
              disabled
              readOnly
              aria-describedby="role-help"
            />
            <p id="role-help" className="text-sm text-muted-foreground">
              El rol no se puede modificar.
            </p>
          </div>
        </section>

        {isProvider ? (
          <section className="space-y-6 rounded-lg border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Información del servicio</h2>

            <div className="space-y-2">
              <Label htmlFor="providerCode" className="flex items-center gap-2">
                Código de proveedor
                <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" />
              </Label>
              <Input id="providerCode" value={user?.providerCode ?? "—"} disabled readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de servicio</Label>
              <Select
                value={form.watch("serviceType") || ""}
                onValueChange={(value) => form.setValue("serviceType", value)}
              >
                <SelectTrigger id="serviceType">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" rows={4} {...form.register("description")} />
            </div>
          </section>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
          >
            Descartar cambios
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
