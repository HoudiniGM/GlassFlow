import type {
  StatusOrcamento,
  StatusPedido,
  SituacaoFinanceira,
} from "./types";

type BadgeVariant =
  | "aguardando"
  | "aprovado"
  | "recusado"
  | "instalado"
  | "concluido"
  | "arquivado";

export const ORCAMENTO_STATUS: Record<
  StatusOrcamento,
  { label: string; variant: BadgeVariant }
> = {
  AGUARDANDO_MEDICAO: { label: "Aguardando medição", variant: "aguardando" },
  AGUARDANDO_FORNECEDOR: {
    label: "Aguardando fornecedor",
    variant: "aguardando",
  },
  AGUARDANDO_CLIENTE: { label: "Aguardando cliente", variant: "aguardando" },
  APROVADO: { label: "Aprovado", variant: "aprovado" },
  RECUSADO: { label: "Recusado", variant: "recusado" },
};

export const PEDIDO_STATUS: Record<
  StatusPedido,
  { label: string; variant: BadgeVariant }
> = {
  AGUARDANDO_FORNECEDOR: {
    label: "Aguardando fornecedor",
    variant: "aguardando",
  },
  AGUARDANDO_INSTALACAO: {
    label: "Aguardando instalação",
    variant: "aguardando",
  },
  INSTALADO: { label: "Instalado", variant: "instalado" },
  CONCLUIDO: { label: "Concluído", variant: "concluido" },
  CANCELADO: { label: "Cancelado", variant: "recusado" },
};

export const FINANCEIRO: Record<
  SituacaoFinanceira,
  { label: string; variant: BadgeVariant }
> = {
  PENDENTE: { label: "Pendente", variant: "aguardando" },
  PAGO: { label: "Pago", variant: "aprovado" },
};

export const ORCAMENTO_STATUS_ORDER: StatusOrcamento[] = [
  "AGUARDANDO_MEDICAO",
  "AGUARDANDO_FORNECEDOR",
  "AGUARDANDO_CLIENTE",
  "APROVADO",
  "RECUSADO",
];

export const PEDIDO_STATUS_ORDER: StatusPedido[] = [
  "AGUARDANDO_FORNECEDOR",
  "AGUARDANDO_INSTALACAO",
  "INSTALADO",
  "CONCLUIDO",
  "CANCELADO",
];

export function situacaoFinanceira(
  valorTotal: number,
  valorPago: number
): SituacaoFinanceira {
  return valorPago >= valorTotal && valorTotal > 0 ? "PAGO" : "PENDENTE";
}
