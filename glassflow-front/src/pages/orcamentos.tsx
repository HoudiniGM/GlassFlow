import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MoreHorizontal, FileText, FileDown } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusFilter } from "@/components/status-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { EmptyState } from "@/components/ui/empty-state";
import { orcamentos } from "@/data/mock";
import { ORCAMENTO_STATUS, ORCAMENTO_STATUS_ORDER } from "@/data/status";
import { formatDateTime } from "@/lib/utils";

export default function OrcamentosPage() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = React.useState("TODOS");

  const opcoes = [
    { value: "TODOS", label: "Todos", count: orcamentos.length },
    ...ORCAMENTO_STATUS_ORDER.map((s) => ({
      value: s,
      label: ORCAMENTO_STATUS[s].label,
      count: orcamentos.filter((o) => o.status === s).length,
    })),
  ];

  const lista =
    filtro === "TODOS"
      ? orcamentos
      : orcamentos.filter((o) => o.status === filtro);

  return (
    <>
      <PageHeader
        title="Orçamentos"
        description="Levantamentos, medições e propostas."
        actions={
          <Button className="hidden sm:inline-flex">
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
                  const st = ORCAMENTO_STATUS[o.status];
                  return (
                    <TableRow
                      key={o.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/orcamentos/${o.id}`)}
                    >
                      <TableCell className="font-medium">{o.codigo}</TableCell>
                      <TableCell>{o.clienteNome}</TableCell>
                      <TableCell>
                        <Badge variant={st.variant}>{st.label}</Badge>
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
                              Abrir
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
              const st = ORCAMENTO_STATUS[o.status];
              return (
                <Card
                  key={o.id}
                  className="p-4"
                  onClick={() => navigate(`/orcamentos/${o.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {o.codigo}
                      </div>
                      <div className="font-medium">{o.clienteNome}</div>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
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
    </>
  );
}
