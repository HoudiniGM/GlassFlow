import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GlassWater, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<"login" | "recuperar">("login");
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState(false);

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/orcamentos");
    }, 800);
  }

  function recuperar(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Enviamos um link de recuperação para o seu e-mail.");
    setMode("login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GlassWater className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold">GlassFlow</h1>
          <p className="text-sm text-muted-foreground">
            Gestão de orçamentos e pedidos
          </p>
        </div>

        {mode === "login" ? (
          <Card>
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>
                Acesse com seu e-mail e senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={entrar} className="space-y-4">
                {erro && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      E-mail ou senha inválidos.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@glassflow.com"
                    defaultValue="ana@glassflow.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPass ? "text" : "password"}
                      defaultValue="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs"
                    onClick={() => setMode("recuperar")}
                  >
                    Esqueci minha senha
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recuperar senha</CardTitle>
              <CardDescription>
                Informe seu e-mail para receber o link de recuperação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={recuperar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-rec">E-mail</Label>
                  <Input
                    id="email-rec"
                    type="email"
                    placeholder="voce@glassflow.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enviar link de recuperação
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs"
                    onClick={() => setMode("login")}
                  >
                    Voltar ao login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        <p className="text-center text-xs text-muted-foreground">
          Protótipo visual — autenticação simulada (Firebase no MVP real).
        </p>
      </div>
    </div>
  );
}
