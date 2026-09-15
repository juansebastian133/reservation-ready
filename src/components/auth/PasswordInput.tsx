import { useId, useState } from "react";
import type { ComponentProps } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { passwordRules } from "@/lib/validation";

interface PasswordInputProps extends Omit<ComponentProps<"input">, "id" | "type"> {
  label: string;
  error?: string | undefined;
  showChecklist?: boolean;
  checklistValue?: string;
}

export function PasswordInput({
  label,
  error,
  showChecklist = false,
  checklistValue = "",
  className,
  ...props
}: PasswordInputProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "pr-11",
            error && "border-destructive focus-visible:ring-destructive/40",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {showChecklist ? (
        <ul className="grid gap-1.5 pt-1 sm:grid-cols-2" aria-live="polite">
          {passwordRules.map((rule) => {
            const ok = rule.test(checklistValue);
            return (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-2 text-xs transition-colors",
                  ok ? "text-success" : "text-muted-foreground",
                )}
              >
                {ok ? (
                  <Check className="size-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <X className="size-3.5 shrink-0" aria-hidden="true" />
                )}
                {rule.label}
                <span className="sr-only">{ok ? "cumplido" : "pendiente"}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
