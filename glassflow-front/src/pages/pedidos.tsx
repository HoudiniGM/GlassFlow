import * as React from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Package, Search, Archive } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusFilter } from "@/components/status-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { pedidos } from "@/data/mock";
import {
  PEDIDO_STATUS,
  PEDIDO_STATUS_ORDER,
  FINANCEIRO,
  situacaoFinanceira,
} from "@/data/status";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "@/app/session";

export default function PedidosPage() {
  const navigate = useNavigate();
  const { papel } = useSession();
  const [filtro, setFiltro] = React.useState("TODOS");
  const [busca, setBusca] = React.useState("");

  const opcoes = [
    { value: "TODOS", label: "Todos", count: pedidos.length },
    ...PEDIDO_STATUS_ORDER.map((s) => ({
      value: s,
      label: PEDIDO_STATUS[s].label,
      count: pedidos.filter((p) => p.status === s).length,
    })),
  ];

  const lista = pedidos
    .filter((p) => filtro === "TODOS" || p.status === filtro)
    .filter((p) => p.clienteNome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Acompanhamento operacional e financeiro. Pedidos nascem da conversão de orçamentos."
      />

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
          icon={<Package />}
          title="Nenhum pedido neste filtro"
          description="Ajuste os filtros para ver outros pedidos."
        />
      ) : (
        <>
          <Card className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Financeiro</TableHead>
                  <TableHead className="text-right">Valor total</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.map((p) => {
                  const st = PEDIDO_STATUS[p.status];
                  const fin =
                    FINANCEIRO[situacaoFinanceira(p.valorTotal, p.valorPago)];
                  const saldo = p.valorTotal - p.valorPago;
                  const arquivavel =
                    p.status === "CONCLUIDO" || p.status === "CANCELADO";
                  return (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/pedidos/${p.id}`)}
                    >
                      <TableCell className="font-medium">{p.codigo}</TableCell>
                      <TableCell>{p.clienteNome}</TableCell>
                      <TableCell>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={fin.variant}>{fin.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(p.valorTotal)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(saldo)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/pedidos/${p.id}`)}
                            >
                              Abrir
                            </DropdownMenuItem>
                            {papel === "ADMINISTRADOR" && (
                              <DropdownMenuItem disabled={!arquivavel}>
                                <Archive className="h-4 w-4" /> Arquivar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              const st = PEDIDO_STATUS[p.status];
              const fin =
                FINANCEIRO[situacaoFinanceira(p.valorTotal, p.valorPago)];
              return (
                <Card
                  key={p.id}
                  className="p-4"
                  onClick={() => navigate(`/pedidos/${p.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {p.codigo}
                      </div>
                      <div className="font-medium">{p.clienteNome}</div>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <Badge variant={fin.variant}>{fin.label}</Badge>
                    <span className="tabular-nums">
                      {formatCurrency(p.valorTotal)}
                    </span>
                  </div>
                </Card>
              );
            })}
            <p className="pt-2 text-center text-xs text-muted-foreground">
              No celular, o MVP permite apenas consulta.
            </p>
          </div>
        </>
      )}
    </>
  );
}
