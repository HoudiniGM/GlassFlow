import * as React from "react";
import { Plus, MapPin, Info, Loader2, AlertTriangle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { Cliente } from "@/data/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cliente: Cliente | null;
}

export function ClienteForm({ open, onOpenChange, cliente }: Props) {
  const [tipo, setTipo] = React.useState<"PF" | "PJ">(cliente?.tipo ?? "PF");
  const [salvando, setSalvando] = React.useState(false);
  const [enderecoOpen, setEnderecoOpen] = React.useState(false);
  const [avisoOpen, setAvisoOpen] = React.useState(false);

  React.useEffect(() => {
    setTipo(cliente?.tipo ?? "PF");
  }, [cliente]);

  const enderecos = cliente?.enderecos ?? [];

  function salvar() {
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      toast.success(cliente ? "Cliente atualizado." : "Cliente cadastrado.");
      onOpenChange(false);
    }, 700);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {cliente ? "Editar cliente" : "Novo cliente"}
            </SheetTitle>
            <SheetDescription>
              Dados do cliente e endereços de instalação.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Dados */}
            <div className="space-y-4">
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
                <Input id="nome" defaultValue={cliente?.nome} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  placeholder="(19) 99999-9999"
                  defaultValue={cliente?.celular}
                />
                <p className="text-xs text-muted-foreground">
                  Usado para localizar o cliente ao criar orçamentos.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc" className="flex items-center gap-1.5">
                  {tipo === "PF" ? "CPF" : "CNPJ"}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Obrigatório apenas na conversão do orçamento em pedido.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="doc"
                  placeholder={tipo === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                  defaultValue={cliente?.documento}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail (opcional)</Label>
                <Input id="email" type="email" defaultValue={cliente?.email} />
              </div>
            </div>

            {/* Endereços */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Endereços</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEnderecoOpen(true)}
                >
                  <Plus /> Adicionar endereço
                </Button>
              </div>

              {enderecos.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Nenhum endereço cadastrado.
                </p>
              )}

              {enderecos.map((e) => (
                <Card key={e.id} className="flex items-start gap-3 p-3">
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
                    {!e.padrao && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => setAvisoOpen(true)}
                      >
                        Tornar padrão
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
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

      {/* Dialog adicionar endereço */}
      <Dialog open={enderecoOpen} onOpenChange={setEnderecoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar endereço</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input placeholder="00000-000" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Logradouro</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input />
            </div>
            <div className="col-span-2 flex items-center gap-2 pt-1">
              <Switch id="padrao" />
              <Label htmlFor="padrao" className="font-normal">
                Tornar este o endereço padrão
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnderecoOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setEnderecoOpen(false);
                toast.success("Endereço adicionado.");
              }}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Aviso ao alterar endereço padrão (ADR 7.2) */}
      <AlertDialog open={avisoOpen} onOpenChange={setAvisoOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-aguardando-fg" />
              Alterar endereço padrão?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Os pedidos já existentes deste cliente{" "}
              <strong>não serão atualizados automaticamente</strong>. A correção
              deverá ser feita manualmente em cada pedido ainda não instalado.
              Pedidos já instalados nunca são afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toast.success("Endereço padrão alterado.")}
            >
              Entendi, alterar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
