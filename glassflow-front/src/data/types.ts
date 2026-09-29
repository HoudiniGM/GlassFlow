// Tipos alinhados à ADR-001 do GlassFlow

export type Papel = "ADMINISTRADOR" | "OPERADOR";

export type TipoPessoa = "PF" | "PJ";

export type StatusOrcamento =
  | "AGUARDANDO_MEDICAO"
  | "AGUARDANDO_FORNECEDOR"
  | "AGUARDANDO_CLIENTE"
  | "APROVADO"
  | "RECUSADO";

export type StatusPedido =
  | "AGUARDANDO_FORNECEDOR"
  | "AGUARDANDO_INSTALACAO"
  | "INSTALADO"
  | "CONCLUIDO"
  | "CANCELADO";

export type SituacaoFinanceira = "PENDENTE" | "PAGO";

export interface Endereco {
  id: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  padrao: boolean;
}

export interface Cliente {
  id: string;
  tipo: TipoPessoa;
  nome: string;
  celular: string;
  documento?: string; // CPF/CNPJ — obrigatório apenas na conversão
  email?: string;
  enderecos: Endereco[];
}

export interface Funcionario {
  id: string;
  nome: string;
  usuarioVinculadoId?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
}

export interface Orcamento {
  id: string;
  codigo: string;
  clienteId: string;
  clienteNome: string;
  clienteCelular: string;
  enderecoInstalacao: string;
  descricao: string;
  responsavel: string;
  medidor?: string;
  dataMedicao?: string; // ISO
  status: StatusOrcamento;
  valor?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Pedido {
  id: string;
  codigo: string;
  orcamentoId: string;
  orcamentoCodigo: string;
  clienteId: string;
  clienteNome: string;
  clienteCelular: string;
  enderecoInstalacao: string; // histórico (copiado do orçamento)
  descricao: string;
  responsavel: string;
  medidor?: string;
  status: StatusPedido;
  valorTotal: number;
  valorPago: number;
  ultimoPagamentoEm?: string;
  arquivadoEm?: string;
  arquivadoPor?: string;
}
