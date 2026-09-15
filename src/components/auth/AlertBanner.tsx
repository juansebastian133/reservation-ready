import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "error" | "success" | "info" | "warning";

const styles: Record<Variant, { className: string; icon: typeof Info }> = {
  error: {
    className: "bg-destructive-soft text-destructive border-destructive/25",
    icon: AlertCircle,
  },
  success: { className: "bg-success-soft text-success border-success/25", icon: CheckCircle2 },
  info: { className: "bg-primary-soft text-primary border-primary/25", icon: Info },
  warning: {
    className: "bg-warning-soft text-warning-foreground border-warning/35",
    icon: TriangleAlert,
  },
};

export function AlertBanner({
  variant = "info",
  title,
  children,
  action,
  className,
}: {
  variant?: Variant;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const { className: variantClass, icon: Icon } = styles[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("rounded-lg border p-4 text-sm", variantClass, className)}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-2">
          {title ? <p className="font-medium">{title}</p> : null}
          {children ? <div className="text-current/90">{children}</div> : null}
          {action}
        </div>
      </div>
    </div>
  );
}
