import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
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
  /** Texto exibido ao lado do ícone. Se omitido, o botão fica apenas com o ícone. */
  text?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  /** Mensagem de confirmação (toast). Padrão: "{label} copiado." */
  successMessage?: string;
}

// Cópia rápida para facilitar o envio via WhatsApp (nome, celular, endereço, etc.).
export function CopyButton({
  value,
  label,
  className,
  text,
  variant = "ghost",
  size,
  successMessage,
}: CopyButtonProps) {
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
    toast.success(successMessage ?? `${label} copiado.`);
    setTimeout(() => setCopiado(false), 1500);
  }

  const Icon = copiado ? Check : Copy;
  const iconClass = copiado ? "text-status-aprovado-fg" : undefined;

  // Variante com texto (botão rotulado)
  if (text) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          copiar();
        }}
        aria-label={`Copiar ${label.toLowerCase()}`}
      >
        <Icon className={cn("h-4 w-4", iconClass)} />
        {copiado ? "Copiado!" : text}
      </Button>
    );
  }

  // Variante apenas ícone (padrão)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size ?? "icon"}
          className={cn("h-7 w-7 text-muted-foreground", className)}
          onClick={(e) => {
            e.stopPropagation();
            copiar();
          }}
          aria-label={`Copiar ${label.toLowerCase()}`}
        >
          <Icon className={cn("h-3.5 w-3.5", iconClass)} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copiar {label.toLowerCase()}</TooltipContent>
    </Tooltip>
  );
}
