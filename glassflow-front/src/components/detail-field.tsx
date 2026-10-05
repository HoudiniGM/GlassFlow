import * as React from "react";
import { cn } from "@/lib/utils";

/** Campo somente-leitura usado nos painéis de detalhe expandidos nas listagens. */
export function DetailField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{children || "—"}</div>
    </div>
  );
}

/** Grade padrão para os campos do painel expandido. */
export function DetailGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 rounded-md bg-muted/40 p-4 sm:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
