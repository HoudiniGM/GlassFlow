import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ORCAMENTO_STATUS,
  ORCAMENTO_STATUS_ORDER,
  PEDIDO_STATUS,
  PEDIDO_STATUS_ORDER,
} from "@/data/status";
import { cn } from "@/lib/utils";

interface Props {
  tipo: "orcamento" | "pedido";
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  /** desabilita um valor específico (ex.: CONCLUIDO sem instalação) */
  isDisabledOption?: (value: string) => boolean;
}

// Select de status compacto para edição inline na listagem (sem abrir o detalhe).
export function StatusSelect({
  tipo,
  value,
  onChange,
  disabled,
  className,
  onClick,
  isDisabledOption,
}: Props) {
  const map = tipo === "orcamento" ? ORCAMENTO_STATUS : PEDIDO_STATUS;
  const order =
    tipo === "orcamento" ? ORCAMENTO_STATUS_ORDER : PEDIDO_STATUS_ORDER;
  const atual = (map as Record<string, { label: string; variant: any }>)[value];

  return (
    <div onClick={onClick}>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            "h-auto w-auto gap-1 border-0 bg-transparent p-0 shadow-none focus:ring-0 [&>svg]:opacity-50",
            className
          )}
        >
          <SelectValue>
            {atual && <Badge variant={atual.variant}>{atual.label}</Badge>}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {order.map((s) => {
            const info = (map as Record<string, { label: string; variant: any }>)[s];
            return (
              <SelectItem
                key={s}
                value={s}
                disabled={isDisabledOption?.(s)}
              >
                <Badge variant={info.variant}>{info.label}</Badge>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
