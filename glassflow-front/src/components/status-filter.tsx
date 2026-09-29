import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  count?: number;
}

interface StatusFilterProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}

// Filtro rápido por status (desktop). Em mobile, ver <StatusSelect>.
export function StatusFilter({ value, onChange, options }: StatusFilterProps) {
  return (
    <div className="hidden flex-wrap gap-1 rounded-lg border bg-background p-1 sm:flex">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
            value === opt.value
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground"
          )}
        >
          {opt.label}
          {typeof opt.count === "number" && (
            <span className="ml-1.5 opacity-70">{opt.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
