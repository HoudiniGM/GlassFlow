import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MoreHorizontal,
  FileText,
  FileDown,
  MessageCircle,
  FolderOpen,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusFilter } from "@/components/status-filter";
import { OrcamentoForm } from "@/components/orcamento-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { StatusSelect } from "@/components/status-select";
import { EmptyState } from "@/components/ui/empty-state";
import { orcamentos } from "@/data/mock";
import { ORCAMENTO_STATUS, ORCAMENTO_STATUS_ORDER } from "@/data/status";
import type { StatusOrcamento } from "@/data/types";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

export default function OrcamentosPage() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = React.useState("TODOS");
  const [formOpen, setFormOpen] = React.useState(false);
  // status editável por tela (inline), mantido localmente no protótipo
  const [statusMap, setStatusMap] = React.useState<Record<string, StatusOrcamento>>(
    () => Object.fromEntries(orcamentos.map((o) => [o.id, o.status]))
  );

  function getStatus(id: string, fallback: StatusOrcamento) {
    return statusMap[id] ?? fallback;
  }

  function alterarStatus(id: string, novo: StatusOrcamento) {
    setStatusMap((m) => ({ ...m, [id]: novo }));
    toast.success("Status atualizado.");
  }

  const opcoes = [
    { value: "TODOS", label: "Todos", count: orcamentos.length },
    ...ORCAMENTO_STATUS_ORDER.map((s) => ({
      value: s,
      label: ORCAMENTO_STATUS[s].label,
      count: orcamentos.filter((o) => getStatus(o.id, o.status) === s).length,
    })),
  ];

  const lista = orcamentos.filter(
    (o) => filtro === "TODOS" || getStatus(o.id, o.status) === filtro
  );

  return (
    <>
      <PageHeader
        title="Orçamentos"
        description="Levantamentos, medições e propostas."
        actions={
          <Button
            className="hidden sm:inline-flex"
            onClick={() => setFormOpen(true)}
          >
            <Plus /> Novo orçamento
          </Button>
        }
      />

      <StatusFilter value={filtro} onChange={setFiltro} options={opcoes} />
      {/* Filtro mobile */}
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
          icon={<FileText />}
          title="Nenhum orçamento neste filtro"
          description="Altere o filtro de status ou crie um novo orçamento."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus /> Novo orçamento
            </Button>
          }
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
                  <TableHead>Medição prevista</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.map((o) => {
                  const status = getStatus(o.id, o.status);
                  return (
                    <TableRow
                      key={o.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/orcamentos/${o.id}`)}
                    >
                      <TableCell className="font-medium">{o.codigo}</TableCell>
                      <TableCell>{o.clienteNome}</TableCell>
                      {/* Seleção de status inline (sem abrir a célula) */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <StatusSelect
                          tipo="orcamento"
                          value={status}
                          onChange={(v) =>
                            alterarStatus(o.id, v as StatusOrcamento)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {o.dataMedicao ? formatDateTime(o.dataMedicao) : "—"}
                      </TableCell>
                      <TableCell>{o.responsavel}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/orcamentos/${o.id}`)}
                            >
                              <FolderOpen className="h-4 w-4" /> Abrir
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                href={`https://wa.me/55${o.clienteCelular.replace(
                                  /\D/g,
                                  ""
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <MessageCircle className="h-4 w-4 text-green-600" />{" "}
                                Falar com o cliente
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(
                                  `/orcamentos/${o.id}/ficha`,
                                  "_blank"
                                )
                              }
                            >
                              <FileDown className="h-4 w-4" /> Ficha de medição
                            </DropdownMenuItem>
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
            {lista.map((o) => {
              const st = ORCAMENTO_STATUS[getStatus(o.id, o.status)];
              return (
                <Card
                  key={o.id}
                  className="p-4"
                  onClick={() => navigate(`/orcamentos/${o.id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {o.codigo}
                      </div>
                      <div className="font-medium">{o.clienteNome}</div>
                    </div>
                    <StatusSelect
                      tipo="orcamento"
                      value={getStatus(o.id, o.status)}
                      onChange={(v) =>
                        alterarStatus(o.id, v as StatusOrcamento)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    {/* badge fallback (hidden): */}
                    <span className="sr-only">{st.label}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Medição:{" "}
                    {o.dataMedicao ? formatDateTime(o.dataMedicao) : "—"}
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

      <OrcamentoForm open={formOpen} onOpenChange={setFormOpen} />
    </>
  );
}
