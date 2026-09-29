import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        aguardando:
          "border-transparent bg-status-aguardando text-status-aguardando-fg",
        aprovado:
          "border-transparent bg-status-aprovado text-status-aprovado-fg",
        recusado:
          "border-transparent bg-status-recusado text-status-recusado-fg",
        instalado:
          "border-transparent bg-status-instalado text-status-instalado-fg",
        concluido:
          "border-transparent bg-status-concluido text-status-concluido-fg",
        arquivado:
          "border-transparent bg-status-arquivado text-status-arquivado-fg",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
