import { NavLink } from "react-router-dom";
import {
  Users,
  FileText,
  Package,
  Wallet,
  Archive,
  Shield,
  GlassWater,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/app/session";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const items: NavItem[] = [
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/orcamentos", label: "Orçamentos", icon: FileText },
  { to: "/pedidos", label: "Pedidos", icon: Package },
  { to: "/pagamentos", label: "Resumo de pagamentos", icon: Wallet },
  { to: "/arquivados", label: "Pedidos arquivados", icon: Archive, adminOnly: true },
  { to: "/administracao", label: "Administração", icon: Shield, adminOnly: true },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { papel } = useSession();
  const visible = items.filter((i) => !i.adminOnly || papel === "ADMINISTRADOR");

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GlassWater className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          GlassFlow
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {visible.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                  isActive && "bg-sidebar-accent text-primary"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3 text-xs text-muted-foreground">
        Protótipo visual · dados fictícios
      </div>
    </div>
  );
}
