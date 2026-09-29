import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileDown,
  ArrowRightLeft,
  Loader2,
  AlertCircle,
  Lock,
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WhatsappButton } from "@/components/whatsapp-button";
import { orcamentos } from "@/data/mock";
import {
  ORCAMENTO_STATUS,
  ORCAMENTO_STATUS_ORDER,
} from "@/data/status";
import type { StatusOrcamento } from "@/data/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function OrcamentoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orcamento = orcamentos.find((o) => o.id === id);

  const [status, setStatus] = React.useState<StatusOrcamento>(
    orcamento?.status ?? "AGUARDANDO_MEDICAO"
  );
  const [converterOpen, setConverterOpen] = React.useState(false);
  const [convertendo, setConvertendo] = React.useState(false);

  if (!orcamento) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Orçamento não encontrado</AlertTitle>
      </Alert>
    );
  }

  const st = ORCAMENTO_STATUS[status];
  const aprovado = status === "APROVADO";
  const semDocumento = false; // simulação: cliente possui documento

  function converter() {
    setConvertendo(true);
    setTimeout(() => {
      setConvertendo(false);
      setConverterOpen(false);
      toast.success("Orçamento convertido em pedido. Abrindo pedido...");
      navigate("/pedidos/p1");
    }, 900);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/orcamentos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={orcamento.codigo}
          description={`Cliente: ${orcamento.clienteNome}`}
        />
        <Badge variant={st.variant} className="ml-2">
          {st.label}
        </Badge>
      </div>

      {aprovado && (
        <Alert variant="info">
          <Lock className="h-4 w-4" />
          <AlertTitle>Registro histórico</AlertTitle>
          <AlertDescription>
            Este orçamento foi aprovado e convertido em pedido. Ele permanece
            imutável — alterações devem ser feitas no pedido correspondente.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input defaultValue={orcamento.clienteNome} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Celular</Label>
                  <Input defaultValue={orcamento.clienteCelular} disabled={aprovado} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Endereço da instalação</Label>
                <Input defaultValue={orcamento.enderecoInstalacao} disabled={aprovado} />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  defaultValue={orcamento.descricao}
                  rows={4}
                  disabled={aprovado}
                />
                <p className="text-xs text-muted-foreground">
                  Informações de fornecedores são registradas aqui (não há
                  cadastro de fornecedor no MVP).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medição</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Input defaultValue={orcamento.responsavel} disabled={aprovado} />
              </div>
              <div className="space-y-2">
                <Label>Medidor (opcional)</Label>
                <Input
                  defaultValue={orcamento.medidor ?? ""}
                  placeholder="A definir"
                  disabled={aprovado}
                />
              </div>
              <div className="space-y-2">
                <Label>Data e horário previstos</Label>
                <Input
                  type="datetime-local"
                  defaultValue={orcamento.dataMedicao?.slice(0, 16)}
                  disabled={aprovado}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor estimado</Label>
                <Input
                  defaultValue={orcamento.valor ? formatCurrency(orcamento.valor) : ""}
                  disabled={aprovado}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral: status + ações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v as StatusOrcamento);
                  toast.success("Status atualizado.");
                }}
                disabled={aprovado}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORCAMENTO_STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {ORCAMENTO_STATUS[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Mudanças de status são manuais.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <WhatsappButton
                celular={orcamento.clienteCelular}
                className="w-full justify-start"
              />
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  window.open(`/orcamentos/${orcamento.id}/ficha`, "_blank")
                }
              >
                <FileDown /> Gerar ficha de medição (PDF)
              </Button>
              <Button
                className="w-full justify-start"
                onClick={() => setConverterOpen(true)}
                disabled={aprovado}
              >
                <ArrowRightLeft /> Converter em pedido
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Converter em pedido (ADR 7.6) */}
      <AlertDialog open={converterOpen} onOpenChange={setConverterOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Converter em pedido</AlertDialogTitle>
            <AlertDialogDescription>
              Será criado um pedido vinculado a este orçamento, copiando cliente,
              telefone, endereço, descrição e valor. Após a conversão, o
              orçamento aprovado torna-se imutável.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {semDocumento ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                É necessário informar CPF ou CNPJ do cliente antes de converter.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="info">
              <AlertDescription>
                CPF/CNPJ do cliente validado. Pronto para converter.
              </AlertDescription>
            </Alert>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button onClick={converter} disabled={convertendo || semDocumento}>
              {convertendo && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmar conversão
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
