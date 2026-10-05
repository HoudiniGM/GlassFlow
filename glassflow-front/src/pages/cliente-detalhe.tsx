import * as React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Loader2,
  AlertCircle,
  MapPin,
  MessageCircle,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CopyButton } from "@/components/copy-button";
import { clientes } from "@/data/mock";
import { toast } from "sonner";

export default function ClienteDetalhePage() {
  const { id } = useParams();
  const cliente = clientes.find((c) => c.id === id);

  const [editando, setEditando] = React.useState(false);
  const [salvando, setSalvando] = React.useState(false);

  if (!cliente) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Cliente não encontrado</AlertTitle>
      </Alert>
    );
  }

  const enderecoPadrao =
    cliente.enderecos.find((e) => e.padrao) ?? cliente.enderecos[0];
  const enderecoCompleto = enderecoPadrao
    ? `${enderecoPadrao.logradouro}, ${enderecoPadrao.numero}${
        enderecoPadrao.complemento ? ` - ${enderecoPadrao.complemento}` : ""
      } - ${enderecoPadrao.bairro}, ${enderecoPadrao.cidade}/${enderecoPadrao.uf}`
    : "";

  function salvar() {
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      setEditando(false);
      toast.success("Cliente atualizado.");
    }, 700);
  }

  const soLeitura = !editando;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/clientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={cliente.nome}
          description={`Cliente ${cliente.tipo === "PF" ? "pessoa física" : "pessoa jurídica"}`}
          actions={
            editando ? (
              <>
                <Button variant="outline" onClick={() => setEditando(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvar} disabled={salvando}>
                  {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditando(true)}>
                <Pencil /> Editar
              </Button>
            )
          }
        />
      </div>

      {!editando && (
        <Alert>
          <AlertDescription>
            Visualização somente leitura. Clique em <strong>Editar</strong> para
            alterar os dados. Use os botões de cópia para enviar rapidamente via
            WhatsApp.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Dados do cliente</CardTitle>
              {!editando && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://wa.me/55${cliente.celular.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="text-green-600" /> Falar com o
                    cliente
                  </a>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de pessoa</Label>
                <RadioGroup
                  value={cliente.tipo}
                  className="flex gap-6"
                  disabled={soLeitura}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="PF" id="pf" />
                    <Label htmlFor="pf" className="font-normal">
                      Pessoa Física
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="PJ" id="pj" />
                    <Label htmlFor="pj" className="font-normal">
                      Pessoa Jurídica
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <CampoCopiavel
                label={cliente.tipo === "PF" ? "Nome" : "Razão social"}
                value={cliente.nome}
                soLeitura={soLeitura}
                copiavel
                copyLabel="Nome"
              />

              <CampoCopiavel
                label="Celular"
                value={cliente.celular}
                soLeitura={soLeitura}
                copiavel
                copyLabel="Celular"
              />

              <CampoCopiavel
                label={cliente.tipo === "PF" ? "CPF" : "CNPJ"}
                value={cliente.documento ?? ""}
                soLeitura={soLeitura}
                placeholder="Não informado"
              />

              <CampoCopiavel
                label="E-mail"
                value={cliente.email ?? ""}
                soLeitura={soLeitura}
                placeholder="Não informado"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Endereços</CardTitle>
              {editando && (
                <Button variant="outline" size="sm">
                  <Plus /> Adicionar endereço
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {cliente.enderecos.map((e) => {
                const texto = `${e.logradouro}, ${e.numero}${
                  e.complemento ? ` - ${e.complemento}` : ""
                } - ${e.bairro}, ${e.cidade}/${e.uf} · CEP ${e.cep}`;
                return (
                  <div
                    key={e.id}
                    className="flex items-start gap-3 rounded-md border p-3"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {e.logradouro}, {e.numero}
                        </span>
                        {e.padrao && <Badge variant="aprovado">Padrão</Badge>}
                      </div>
                      <div className="text-muted-foreground">
                        {e.bairro} — {e.cidade}/{e.uf} · CEP {e.cep}
                      </div>
                    </div>
                    <CopyButton value={texto} label="Endereço" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Cópia rápida para WhatsApp */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cópia rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Copie os dados para colar na conversa do WhatsApp.
              </p>
              <LinhaCopia label="Nome" value={cliente.nome} />
              <LinhaCopia label="Celular" value={cliente.celular} />
              {enderecoCompleto && (
                <LinhaCopia label="Endereço" value={enderecoCompleto} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function CampoCopiavel({
  label,
  value,
  soLeitura,
  copiavel,
  copyLabel,
  placeholder,
}: {
  label: string;
  value: string;
  soLeitura: boolean;
  copiavel?: boolean;
  copyLabel?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-1">
        <Input
          defaultValue={value}
          disabled={soLeitura}
          placeholder={placeholder}
        />
        {copiavel && value && soLeitura && (
          <CopyButton value={value} label={copyLabel ?? label} />
        )}
      </div>
    </div>
  );
}

function LinhaCopia({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border p-2">
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-sm">{value}</div>
      </div>
      <CopyButton value={value} label={label} />
    </div>
  );
}
