import * as React from "react";
import { ShieldAlert, MoreHorizontal, RotateCcw, Eye, Lock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { pedidosArquivados } from "@/data/mock";
import { PEDIDO_STATUS } from "@/data/status";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useSession } from "@/app/session";
import { toast } from "sonner";

export default function ArquivadosPage() {
  const { papel } = useSession();
  const [restaurarId, setRestaurarId] = React.useState<string | null>(null);

  if (papel !== "ADMINISTRADOR") {
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Somente administradores podem acessar os pedidos arquivados.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <PageHeader
        title="Pedidos arquivados"
        description="Consulta somente-leitura. Restaure um pedido para editá-lo."
      />

      <Alert variant="warning">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Área administrativa</AlertTitle>
        <AlertDescription>
          Pedidos arquivados não aparecem em listagens, buscas ou relatórios
          comuns. Apenas administradores têm acesso a esta área.
        </AlertDescription>
      </Alert>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status final</TableHead>
              <TableHead className="text-right">Valor total</TableHead>
              <TableHead>Arquivado em</TableHead>
              <TableHead>Arquivado por</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidosArquivados.map((p) => {
              const st = PEDIDO_STATUS[p.status];
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.codigo}</TableCell>
                  <TableCell>{p.clienteNome}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Badge variant={st.variant}>{st.label}</Badge>
                    <Badge variant="arquivado">Arquivado</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(p.valorTotal)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.arquivadoEm ? formatDate(p.arquivadoEm) : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.arquivadoPor ?? "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4" /> Ver (somente leitura)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRestaurarId(p.id)}>
                          <RotateCcw className="h-4 w-4" /> Restaurar
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

      <AlertDialog
        open={!!restaurarId}
        onOpenChange={(o) => !o && setRestaurarId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              O pedido voltará às consultas comuns mantendo o status operacional
              anterior ao arquivamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => toast.success("Pedido restaurado.")}>
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
