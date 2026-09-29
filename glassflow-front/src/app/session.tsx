import * as React from "react";
import type { Papel } from "@/data/types";

interface SessionState {
  papel: Papel;
  setPapel: (p: Papel) => void;
  nome: string;
}

const SessionContext = React.createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [papel, setPapel] = React.useState<Papel>("ADMINISTRADOR");
  const nome = papel === "ADMINISTRADOR" ? "Ana Vitória" : "Carlos Medeiros";
  return (
    <SessionContext.Provider value={{ papel, setPapel, nome }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error("useSession fora do SessionProvider");
  return ctx;
}
