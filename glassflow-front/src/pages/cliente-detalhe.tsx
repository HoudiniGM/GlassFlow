import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, MapPin, Plus } from "lucide-react";
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
import { clientes } from "@/data/mock";
import { toast } from "sonner";

// Tela de EDIÇÃO direta do cliente (a consulta é feita pela expansão na listagem).
export default function ClienteDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cliente = clientes.find((c) => c.id === id);

  const [salvando, setSalvando] = React.useState(false);
  const [tipo, setTipo] = React.useState(cliente?.tipo ?? "PF");

  if (!cliente) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Cliente não encontrado</AlertTitle>
      </Alert>
    );
  }

  function salvar() {
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      toast.success("Cliente atualizado.");
      navigate("/clientes");
    }, 700);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/clientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={`Editar cliente`}
          description={cliente.nome}
          actions={
            <>
              <Button variant="outline" onClick={() => navigate("/clientes")}>
                Cancelar
              </Button>
              <Button onClick={salvar} disabled={salvando}>
                {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de pessoa</Label>
                <RadioGroup
                  value={tipo}
                  onValueChange={(v) => setTipo(v as "PF" | "PJ")}
                  className="flex gap-6"
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

              <div className="space-y-2">
                <Label htmlFor="nome">
                  {tipo === "PF" ? "Nome" : "Razão social"}
                </Label>
                <Input id="nome" defaultValue={cliente.nome} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input id="celular" defaultValue={cliente.celular} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc">{tipo === "PF" ? "CPF" : "CNPJ"}</Label>
                <Input
                  id="doc"
                  defaultValue={cliente.documento}
                  placeholder={
                    tipo === "PF" ? "000.000.000-00" : "00.000.000/0000-00"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail (opcional)</Label>
                <Input id="email" type="email" defaultValue={cliente.email} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Endereços</CardTitle>
              <Button variant="outline" size="sm">
                <Plus /> Adicionar endereço
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {cliente.enderecos.map((e) => (
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
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Alert>
            <AlertDescription>
              Esta tela é dedicada à edição. Para consultar rapidamente, clique
              na linha do cliente na listagem.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}
