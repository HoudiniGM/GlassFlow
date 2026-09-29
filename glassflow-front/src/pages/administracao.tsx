import * as React from "react";
import { Plus, Lock, UserPlus, Info } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usuarios, funcionarios } from "@/data/mock";
import { useSession } from "@/app/session";
import { toast } from "sonner";

export default function AdministracaoPage() {
  const { papel } = useSession();

  if (papel !== "ADMINISTRADOR") {
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Somente administradores podem gerenciar usuários e funcionários.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <PageHeader
        title="Administração"
        description="Gestão de usuários do sistema e funcionários."
      />

      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
        </TabsList>

        {/* Usuários */}
        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex justify-end">
            <NovoUsuarioDialog />
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nome}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.papel === "ADMINISTRADOR" ? "aprovado" : "secondary"
                        }
                      >
                        {u.papel === "ADMINISTRADOR" ? "Administrador" : "Operador"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.ativo ? "instalado" : "arquivado"}>
                        {u.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              A inativação de um usuário deve ser coordenada com a desativação
              do acesso no Firebase.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Funcionários */}
        <TabsContent value="funcionarios" className="space-y-4">
          <div className="flex justify-end">
            <NovoFuncionarioDialog />
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Acesso ao sistema</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcionarios.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.nome}</TableCell>
                    <TableCell>
                      {f.usuarioVinculadoId ? (
                        <Badge variant="aprovado">Com acesso</Badge>
                      ) : (
                        <Badge variant="secondary">Sem acesso</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <p className="text-xs text-muted-foreground">
            Funcionários podem aparecer como responsável ou medidor sem
            necessariamente ter conta. Documento pessoal não é armazenado no MVP.
          </p>
        </TabsContent>
      </Tabs>
    </>
  );
}

function NovoUsuarioDialog() {
  const [papel, setPapel] = React.useState("OPERADOR");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Novo usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input type="email" />
          </div>
          <div className="space-y-2">
            <Label>Papel</Label>
            <RadioGroup value={papel} onValueChange={setPapel} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="OPERADOR" id="op" />
                <Label htmlFor="op" className="font-normal">
                  Operador
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="ADMINISTRADOR" id="adm" />
                <Label htmlFor="adm" className="font-normal">
                  Administrador
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="ativo" defaultChecked />
            <Label htmlFor="ativo" className="font-normal">
              Usuário ativo
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => toast.success("Usuário criado.")}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NovoFuncionarioDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus /> Novo funcionário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo funcionário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input />
          </div>
          <div className="space-y-2">
            <Label>Vincular a uma conta de usuário (opcional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sem vínculo" />
              </SelectTrigger>
              <SelectContent>
                {usuarios.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.nome} — {u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => toast.success("Funcionário criado.")}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
