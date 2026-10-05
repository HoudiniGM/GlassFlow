import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CopyButtonProps {
  value: string;
  label: string; // o que está sendo copiado, ex.: "Celular"
  className?: string;
}

// Cópia rápida para facilitar o envio via WhatsApp (nome, celular, endereço).
export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copiado, setCopiado] = React.useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // fallback simples
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiado(true);
    toast.success(`${label} copiado.`);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7 text-muted-foreground", className)}
          onClick={(e) => {
            e.stopPropagation();
            copiar();
          }}
          aria-label={`Copiar ${label.toLowerCase()}`}
        >
          {copiado ? (
            <Check className="h-3.5 w-3.5 text-status-aprovado-fg" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copiar {label.toLowerCase()}</TooltipContent>
    </Tooltip>
  );
}
