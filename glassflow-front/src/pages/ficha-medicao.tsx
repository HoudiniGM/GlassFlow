import { useParams } from "react-router-dom";
import { Printer, GlassWater } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orcamentos } from "@/data/mock";
import { formatDateTime } from "@/lib/utils";

export default function FichaMedicaoPage() {
  const { id } = useParams();
  const o = orcamentos.find((x) => x.id === id) ?? orcamentos[0];

  return (
    <div className="min-h-screen bg-muted/40 py-8">
      {/* Barra de ações (não imprime) */}
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between px-4 print:hidden">
        <span className="text-sm text-muted-foreground">
          Pré-visualização da ficha de medição (A4)
        </span>
        <Button onClick={() => window.print()}>
          <Printer /> Imprimir / Salvar PDF
        </Button>
      </div>

      {/* Folha A4 */}
      <div className="mx-auto w-[210mm] min-h-[297mm] bg-white p-[15mm] text-black shadow-lg print:shadow-none">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-2">
            <GlassWater className="h-8 w-8" />
            <div>
              <div className="text-xl font-bold">GlassFlow</div>
              <div className="text-xs">Vidraçaria · Ficha de medição</div>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">Orçamento {o.codigo}</div>
            <div>Emitida em {new Date().toLocaleDateString("pt-BR")}</div>
          </div>
        </div>

        {/* Dados */}
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <Campo label="Cliente" valor={o.clienteNome} />
          <Campo label="Telefone" valor={o.clienteCelular} />
          <div className="col-span-2">
            <Campo label="Endereço da instalação" valor={o.enderecoInstalacao} />
          </div>
          <Campo
            label="Data/horário agendados"
            valor={o.dataMedicao ? formatDateTime(o.dataMedicao) : "—"}
          />
          <Campo label="Responsável" valor={o.responsavel} />
          <div className="col-span-2">
            <span className="font-semibold">Medidor: </span>
            {o.medidor ? (
              <span>{o.medidor}</span>
            ) : (
              <span className="inline-block w-64 border-b border-black align-bottom">
                &nbsp;
              </span>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div className="mt-5 text-sm">
          <div className="font-semibold">Descrição</div>
          <p className="mt-1 leading-relaxed">{o.descricao}</p>
        </div>

        {/* Área para medidas/desenhos */}
        <div className="mt-5">
          <div className="text-sm font-semibold">
            Medidas, desenhos e observações
          </div>
          <div
            className="mt-2 h-[120mm] w-full rounded border border-black"
            style={{
              backgroundImage:
                "linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)",
              backgroundSize: "5mm 5mm",
            }}
          />
        </div>

        <div className="mt-6 flex justify-between text-xs">
          <div className="w-1/2 border-t border-black pt-1 text-center">
            Assinatura do medidor
          </div>
          <div className="ml-8 w-1/2 border-t border-black pt-1 text-center">
            Assinatura do cliente
          </div>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <span className="font-semibold">{label}: </span>
      <span>{valor}</span>
    </div>
  );
}
