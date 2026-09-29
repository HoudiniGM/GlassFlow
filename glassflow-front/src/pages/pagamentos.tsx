import * as React from "react";
import { Search, Wallet } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusFilter } from "@/components/status-filter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { pedidos } from "@/data/mock";
import { FINANCEIRO, situacaoFinanceira } from "@/data/status";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PagamentosPage() {
  const [filtro, setFiltro] = React.useState("TODOS");
  const [busca, setBusca] = React.useState("");

  const comSituacao = pedidos.map((p) => ({
    ...p,
    situacao: situacaoFinanceira(p.valorTotal, p.valorPago),
    saldo: p.valorTotal - p.valorPago,
  }));

  const opcoes = [
    { value: "TODOS", label: "Todos", count: comSituacao.length },
    {
      value: "PAGO",
      label: "Pagos",
      count: comSituacao.filter((p) => p.situacao === "PAGO").length,
    },
    {
      value: "PENDENTE",
      label: "Com saldo pendente",
      count: comSituacao.filter((p) => p.situacao === "PENDENTE").length,
    },
  ];

  const lista = comSituacao
    .filter((p) => filtro === "TODOS" || p.situacao === filtro)
    .filter((p) => p.clienteNome.toLowerCase().includes(busca.toLowerCase()));

  const totalPago = comSituacao.reduce((s, p) => s + p.valorPago, 0);
  const totalPendente = comSituacao.reduce((s, p) => s + p.saldo, 0);

  return (
    <>
      <PageHeader
        title="Resumo de pagamentos"
        description="Situação financeira por pedido. Resumo acumulado (não é extrato detalhado)."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">Pedidos</div>
            <div className="text-2xl font-semibold">{comSituacao.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">Total recebido</div>
            <div className="text-2xl font-semibold tabular-nums text-status-aprovado-fg">
              {formatCurrency(totalPago)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">Saldo pendente</div>
            <div className="text-2xl font-semibold tabular-nums text-status-aguardando-fg">
              {formatCurrency(totalPendente)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusFilter value={filtro} onChange={setFiltro} options={opcoes} />
        <div className="relative max-w-xs sm:w-56">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="sm:hidden">
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opcoes.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {lista.length === 0 ? (
        <EmptyState
          icon={<Wallet />}
          title="Nenhum pedido neste filtro"
          description="Ajuste o filtro ou a busca."
        />
      ) : (
        <>
          <Card className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Pago</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Último pagamento</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.map((p) => {
                  const situ = FINANCEIRO[p.situacao];
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {p.clienteNome}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.codigo}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(p.valorTotal)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(p.valorPago)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(p.saldo)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.ultimoPagamentoEm
                          ? formatDate(p.ultimoPagamentoEm)
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={situ.variant}>{situ.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile */}
          <div className="space-y-3 sm:hidden">
            {lista.map((p) => {
              const situ = FINANCEIRO[p.situacao];
              return (
                <Card key={p.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {p.codigo}
                      </div>
                      <div className="font-medium">{p.clienteNome}</div>
                    </div>
                    <Badge variant={situ.variant}>{situ.label}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Total</div>
                      <div className="tabular-nums">
                        {formatCurrency(p.valorTotal)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Pago</div>
                      <div className="tabular-nums">
                        {formatCurrency(p.valorPago)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Saldo</div>
                      <div className="tabular-nums">
                        {formatCurrency(p.saldo)}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
