import * as React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  Lock,
  Plus,
  Archive,
  ShieldCheck,
  Loader2,
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WhatsappButton } from "@/components/whatsapp-button";
import { pedidos } from "@/data/mock";
import {
  PEDIDO_STATUS,
  PEDIDO_STATUS_ORDER,
  FINANCEIRO,
  situacaoFinanceira,
} from "@/data/status";
import type { StatusPedido } from "@/data/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useSession } from "@/app/session";
import { toast } from "sonner";

export default function PedidoDetalhePage() {
  const { id } = useParams();
  const { papel } = useSession();
  const pedido = pedidos.find((p) => p.id === id);

  const [status, setStatus] = React.useState<StatusPedido>(
    pedido?.status ?? "AGUARDANDO_INSTALACAO"
  );
  const [valorPago, setValorPago] = React.useState(pedido?.valorPago ?? 0);
  const [pagOpen, setPagOpen] = React.useState(false);
  const [recebimento, setRecebimento] = React.useState("");
  const [salvando, setSalvando] = React.useState(false);

  if (!pedido) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Pedido não encontrado</AlertTitle>
      </Alert>
    );
  }

  const st = PEDIDO_STATUS[status];
  const saldo = pedido.valorTotal - valorPago;
  const fin = FINANCEIRO[situacaoFinanceira(pedido.valorTotal, valorPago)];
  const instalado = status === "INSTALADO" || status === "CONCLUIDO";
  const podeConcluir = status === "INSTALADO" && saldo <= 0;
  const arquivavel = status === "CONCLUIDO" || status === "CANCELADO";
  const isAdmin = papel === "ADMINISTRADOR";

  const valorNum = Number(recebimento.replace(",", ".")) || 0;
  const excede = valorNum > saldo;

  function registrar() {
    if (excede || valorNum <= 0) return;
    setSalvando(true);
    setTimeout(() => {
      setValorPago((v) => v + valorNum);
      setSalvando(false);
      setPagOpen(false);
      setRecebimento("");
      toast.success("Recebimento registrado.");
    }, 600);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/pedidos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={pedido.codigo}
          description={`Cliente: ${pedido.clienteNome}`}
        />
        <Badge variant={st.variant}>{st.label}</Badge>
        <Badge variant={fin.variant}>{fin.label}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Origem:{" "}
        <Link
          to="/orcamentos"
          className="text-primary underline-offset-4 hover:underline"
        >
          {pedido.orcamentoCodigo}
        </Link>
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input defaultValue={pedido.clienteNome} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue={pedido.clienteCelular} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Endereço da instalação (histórico)
                  {instalado && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Só pode ser alterado enquanto o pedido não estiver
                        instalado.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </Label>
                <div className="flex gap-2">
                  <Input defaultValue={pedido.enderecoInstalacao} disabled />
                  <Button variant="outline" disabled={instalado}>
                    Alterar
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea defaultValue={pedido.descricao} rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Input defaultValue={pedido.responsavel} />
                </div>
                <div className="space-y-2">
                  <Label>Medidor</Label>
                  <Input
                    defaultValue={pedido.medidor ?? ""}
                    placeholder="A definir"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo financeiro */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Resumo de pagamentos</CardTitle>
              <Button size="sm" onClick={() => setPagOpen(true)}>
                <Plus /> Registrar recebimento
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Resumo label="Valor total" valor={formatCurrency(pedido.valorTotal)} />
                <Resumo label="Valor pago" valor={formatCurrency(valorPago)} />
                <Resumo label="Saldo" valor={formatCurrency(saldo)} />
                <div>
                  <div className="text-xs text-muted-foreground">Situação</div>
                  <Badge variant={fin.variant} className="mt-1">
                    {fin.label}
                  </Badge>
                </div>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Último pagamento:{" "}
                {pedido.ultimoPagamentoEm
                  ? formatDateTime(pedido.ultimoPagamentoEm)
                  : "—"}{" "}
                · O MVP mantém o resumo acumulado, sem histórico individual de
                recebimentos.
              </p>
              {isAdmin && (
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertDescription>
                    Como administrador, você pode corrigir valores já salvos.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lateral */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status operacional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v as StatusPedido);
                  toast.success("Status atualizado.");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PEDIDO_STATUS_ORDER.map((s) => {
                    const bloqueiaConclusao = s === "CONCLUIDO" && !podeConcluir;
                    return (
                      <SelectItem
                        key={s}
                        value={s}
                        disabled={bloqueiaConclusao}
                      >
                        {PEDIDO_STATUS[s].label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {!podeConcluir && (
                <p className="text-xs text-muted-foreground">
                  "Concluído" exige pedido instalado e saldo quitado (validado
                  no backend).
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <WhatsappButton
                celular={pedido.clienteCelular}
                className="w-full justify-start"
              />
              <Button className="w-full justify-start">Salvar</Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!arquivavel}
                  onClick={() => toast.success("Pedido arquivado.")}
                >
                  <Archive /> Arquivar
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Registrar recebimento */}
      <Dialog open={pagOpen} onOpenChange={setPagOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Registrar recebimento</DialogTitle>
            <DialogDescription>
              Informe apenas o valor recebido. Ele será somado ao total já pago.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor recebido (R$)</Label>
            <Input
              id="valor"
              inputMode="decimal"
              placeholder="0,00"
              value={recebimento}
              onChange={(e) => setRecebimento(e.target.value)}
              aria-invalid={excede}
            />
            {excede ? (
              <p className="text-xs text-destructive">
                O valor excede o saldo de {formatCurrency(saldo)}.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Saldo disponível: {formatCurrency(saldo)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPagOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={registrar}
              disabled={excede || valorNum <= 0 || salvando}
            >
              {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Resumo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold tabular-nums">{valor}</div>
    </div>
  );
}
