import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  MapPin,
  Pencil,
  MessageCircle,
  FilePlus,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DetailField, DetailGrid } from "@/components/detail-field";
import { CopyButton } from "@/components/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { WhatsappButton } from "@/components/whatsapp-button";
import { ClienteForm } from "@/components/cliente-form";
import { clientes as mockClientes } from "@/data/mock";
import type { Cliente } from "@/data/types";

export default function ClientesPage() {
  const navigate = useNavigate();
  const [busca, setBusca] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<Cliente | null>(null);
  // apenas uma linha expandida por vez
  const [expandido, setExpandido] = React.useState<string | null>(null);

  const filtrados = mockClientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.celular.includes(busca)
  );

  function novo() {
    setEditando(null);
    setFormOpen(true);
  }

  function enderecoPadraoObj(c: Cliente) {
    return c.enderecos.find((x) => x.padrao) ?? c.enderecos[0];
  }
  function enderecoPadrao(c: Cliente) {
    const e = enderecoPadraoObj(c);
    return e ? `${e.logradouro}, ${e.numero} - ${e.cidade}/${e.uf}` : "—";
  }
  function enderecoCompleto(c: Cliente) {
    const e = enderecoPadraoObj(c);
    return e
      ? `${e.logradouro}, ${e.numero}${
          e.complemento ? ` - ${e.complemento}` : ""
        } - ${e.bairro}, ${e.cidade}/${e.uf} · CEP ${e.cep}`
      : "";
  }
  function wa(celular: string) {
    return `https://wa.me/55${celular.replace(/\D/g, "")}`;
  }

  function toggle(id: string) {
    setExpandido((atual) => (atual === id ? null : id));
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Cadastro e consulta de clientes e endereços."
        actions={
          <Button onClick={novo} className="hidden sm:inline-flex">
            <Plus /> Novo cliente
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou celular..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-8"
        />
      </div>

      {filtrados.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="Nenhum cliente encontrado"
          description="Ajuste a busca ou cadastre um novo cliente."
          action={
            <Button onClick={novo}>
              <Plus /> Novo cliente
            </Button>
          }
        />
      ) : (
        <>
          {/* Tabela (desktop) — clique na linha expande os detalhes */}
          <Card className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Endereço padrão</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((c) => {
                  const aberto = expandido === c.id;
                  return (
                    <React.Fragment key={c.id}>
                      <TableRow
                        className="cursor-pointer"
                        data-state={aberto ? "selected" : undefined}
                        onClick={() => toggle(c.id)}
                      >
                        <TableCell className="font-medium">{c.nome}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{c.tipo}</Badge>
                        </TableCell>
                        <TableCell>{c.celular}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {enderecoPadrao(c)}
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
                                onClick={() => navigate(`/clientes/${c.id}`)}
                              >
                                <Pencil className="h-4 w-4" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={wa(c.celular)}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <MessageCircle className="h-4 w-4 text-green-600" />{" "}
                                  Falar com o cliente
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate("/orcamentos")}
                              >
                                <FilePlus className="h-4 w-4" /> Novo orçamento
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {aberto && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={5} className="p-3">
                            <DetailGrid>
                              <DetailField label="Nome">
                                <span className="inline-flex items-center gap-1">
                                  {c.nome}
                                  <CopyButton value={c.nome} label="Nome" />
                                </span>
                              </DetailField>
                              <DetailField label="Tipo">
                                {c.tipo === "PF"
                                  ? "Pessoa Física"
                                  : "Pessoa Jurídica"}
                              </DetailField>
                              <DetailField label="Celular">
                                <span className="inline-flex items-center gap-1">
                                  {c.celular}
                                  <CopyButton
                                    value={c.celular}
                                    label="Celular"
                                  />
                                </span>
                              </DetailField>
                              <DetailField
                                label={c.tipo === "PF" ? "CPF" : "CNPJ"}
                              >
                                {c.documento ?? "Não informado"}
                              </DetailField>
                              <DetailField label="E-mail">
                                {c.email ?? "Não informado"}
                              </DetailField>
                              <DetailField
                                label="Endereço padrão"
                                className="col-span-2 sm:col-span-1"
                              >
                                <span className="inline-flex items-start gap-1">
                                  {enderecoCompleto(c)}
                                  <CopyButton
                                    value={enderecoCompleto(c)}
                                    label="Endereço"
                                  />
                                </span>
                              </DetailField>
                            </DetailGrid>
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => navigate(`/clientes/${c.id}`)}
                              >
                                <Pencil /> Editar
                              </Button>
                              <WhatsappButton
                                celular={c.celular}
                                size="sm"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Cards (mobile — somente consulta, expande ao tocar) */}
          <div className="space-y-3 sm:hidden">
            {filtrados.map((c) => {
              const aberto = expandido === c.id;
              return (
                <Card
                  key={c.id}
                  className="p-4"
                  onClick={() => toggle(c.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-medium">{c.nome}</div>
                    <Badge variant="secondary">{c.tipo}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {c.celular}
                  </div>
                  <div className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                    {enderecoPadrao(c)}
                  </div>

                  {aberto && (
                    <div
                      className="mt-3 space-y-2 border-t pt-3 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">
                          {c.tipo === "PF" ? "CPF" : "CNPJ"}
                        </span>
                        <span>{c.documento ?? "Não informado"}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">E-mail</span>
                        <span>{c.email ?? "Não informado"}</span>
                      </div>
                      <WhatsappButton celular={c.celular} size="sm" />
                    </div>
                  )}
                </Card>
              );
            })}
            <p className="pt-2 text-center text-xs text-muted-foreground">
              No celular, o MVP permite apenas consulta.
            </p>
          </div>
        </>
      )}

      <ClienteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        cliente={editando}
      />
    </>
  );
}
