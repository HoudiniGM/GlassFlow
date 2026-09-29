import { MessageCircle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

interface WhatsappButtonProps extends ButtonProps {
  celular: string;
  label?: string;
}

// Abre o WhatsApp Web no número registrado (ADR 10.1) — não lê mensagens.
export function WhatsappButton({
  celular,
  label = "Falar com o cliente",
  variant = "outline",
  ...props
}: WhatsappButtonProps) {
  const numero = celular.replace(/\D/g, "");
  const href = `https://wa.me/55${numero}`;
  return (
    <Button variant={variant} asChild {...props}>
      <a href={href} target="_blank" rel="noreferrer">
        <MessageCircle className="text-green-600" />
        {label}
      </a>
    </Button>
  );
}
