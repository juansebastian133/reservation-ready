import { Building2, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/mocks/data";

const options: { value: UserRole; title: string; description: string; icon: typeof User }[] = [
  {
    value: "cliente",
    title: "Cliente",
    description: "Quiero reservar servicios",
    icon: User,
  },
  {
    value: "proveedor",
    title: "Proveedor",
    description: "Ofrezco servicios y recibo reservas",
    icon: Building2,
  },
];

export function RoleSelector({
  value,
  onChange,
}: {
  value: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">¿Cómo vas a usar la plataforma?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(({ value: option, title, description, icon: Icon }) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={cn(
                "relative flex cursor-pointer flex-col gap-1 rounded-lg border bg-card p-4 transition-all",
                selected
                  ? "border-primary bg-primary-soft shadow-soft"
                  : "border-border hover:border-primary/40",
              )}
            >
              <input
                type="radio"
                name="role"
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span className="flex items-center justify-between">
                <Icon
                  className={cn("size-5", selected ? "text-primary" : "text-muted-foreground")}
                  aria-hidden="true"
                />
                {selected ? (
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                ) : null}
              </span>
              <span className="text-sm font-medium">{title}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
