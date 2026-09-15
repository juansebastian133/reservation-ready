import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputFieldProps extends Omit<ComponentProps<"input">, "id"> {
  label: string;
  error?: string | undefined;
  helperText?: ReactNode;
  rightSlot?: ReactNode;
}

export function InputField({
  label,
  error,
  helperText,
  rightSlot,
  className,
  ...props
}: InputFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {rightSlot}
      </div>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={cn(error && errorId, helperText && helperId) || undefined}
        className={cn(error && "border-destructive focus-visible:ring-destructive/40", className)}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
