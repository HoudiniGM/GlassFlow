import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/app/session";
import { ThemeProvider } from "@/app/theme";
import { AppLayout } from "@/components/app-layout";

import LoginPage from "@/pages/login";
import ClientesPage from "@/pages/clientes";
import ClienteDetalhePage from "@/pages/cliente-detalhe";
import OrcamentosPage from "@/pages/orcamentos";
import OrcamentoDetalhePage from "@/pages/orcamento-detalhe";
import FichaMedicaoPage from "@/pages/ficha-medicao";
import PedidosPage from "@/pages/pedidos";
import PedidoDetalhePage from "@/pages/pedido-detalhe";
import PagamentosPage from "@/pages/pagamentos";
import ArquivadosPage from "@/pages/arquivados";
import AdministracaoPage from "@/pages/administracao";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/orcamentos/:id/ficha", element: <FichaMedicaoPage /> },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/orcamentos" replace /> },
      { path: "clientes", element: <ClientesPage /> },
      { path: "clientes/:id", element: <ClienteDetalhePage /> },
      { path: "orcamentos", element: <OrcamentosPage /> },
      { path: "orcamentos/:id", element: <OrcamentoDetalhePage /> },
      { path: "pedidos", element: <PedidosPage /> },
      { path: "pedidos/:id", element: <PedidoDetalhePage /> },
      { path: "pagamentos", element: <PagamentosPage /> },
      { path: "arquivados", element: <ArquivadosPage /> },
      { path: "administracao", element: <AdministracaoPage /> },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <TooltipProvider delayDuration={200}>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
