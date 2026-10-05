import * as React from "react";
import { Loader2, Search, UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clientes, funcionarios } from "@/data/mock";
import { ORCAMENTO_STATUS, ORCAMENTO_STATUS_ORDER } from "@/data/status";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

// Barra lateral (Sheet) para criação de um novo orçamento.
export function OrcamentoForm({ open, onOpenChange }: Props) {
  const [salvando, setSalvando] = React.useState(false);
  const [celular, setCelular] = React.useState("");
  const [clienteId, setClienteId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState("AGUARDANDO_MEDICAO");

  const clienteEncontrado = React.useMemo(() => {
    if (!celular.trim()) return undefined;
    const num = celular.replace(/\D/g, "");
    return clientes.find((c) => c.celular.replace(/\D/g, "").includes(num));
  }, [celular]);

  React.useEffect(() => {
    setClienteId(clienteEncontrado?.id ?? null);
  }, [clienteEncontrado]);

  const cliente = clientes.find((c) => c.id === clienteId);
  const buscou = celular.trim().length > 0;

  function salvar() {
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      toast.success("Orçamento criado.");
      onOpenChange(false);
      // reset
      setCelular("");
      setClienteId(null);
      setStatus("AGUARDANDO_MEDICAO");
    }, 700);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Novo orçamento</SheetTitle>
          <SheetDescription>
            Localize o cliente pelo celular e preencha os dados do orçamento.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Localizar cliente */}
          <div className="space-y-2">
            <Label htmlFor="busca-cel">Celular do cliente</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="busca-cel"
                className="pl-8"
                placeholder="(19) 99999-9999"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              />
            </div>
            {buscou && clienteEncontrado && (
              <Alert variant="info">
                <AlertDescription>
                  Cliente localizado: <strong>{clienteEncontrado.nome}</strong>
                </AlertDescription>
              </Alert>
            )}
            {buscou && !clienteEncontrado && (
              <Alert variant="warning">
                <AlertDescription className="flex items-center justify-between gap-2">
                  <span>Nenhum cliente com este número.</span>
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-4 w-4" /> Cadastrar novo
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Endereço da instalação */}
          <div className="space-y-2">
            <Label>Endereço da instalação</Label>
            <Select disabled={!cliente}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    cliente
                      ? "Selecione o endereço"
                      : "Localize o cliente primeiro"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cliente?.enderecos.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.logradouro}, {e.numero} - {e.cidade}/{e.uf}
                    {e.padrao ? " (padrão)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={3}
              placeholder="Descreva o serviço. Informações de fornecedor também vão aqui."
            />
          </div>

          {/* Responsável / Medidor */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Medidor (opcional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="A definir" />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data medição / Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Data e horário da medição</Label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label>Status inicial</Label>
              <Select value={status} onValueChange={setStatus}>
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
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={salvar} disabled={salvando}>
            {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
