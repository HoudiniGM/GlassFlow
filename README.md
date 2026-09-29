# GlassFlow

Sistema de gestão de orçamentos e pedidos para vidraçaria (projeto acadêmico). Consulte a **ADR-001** para a stack, arquitetura e escopo do MVP.

> Nota: a ADR-001 prevê três repositórios separados (`glassflow-front`, `glassflow-back`, `glassflow-docs`). Este repositório reúne, por ora, o **protótipo visual do frontend** e a **documentação de design**.

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| [`glassflow-front/`](./glassflow-front) | Protótipo visual navegável (React + TypeScript + Vite + Tailwind + shadcn/ui). Dados mockados, sem backend. |
| [`glassflow-docs/`](./glassflow-docs) | Documentação de produto e design (especificação do protótipo visual). |

## Protótipo visual

```bash
cd glassflow-front
npm install
npm run dev
```

Veja o [README do frontend](./glassflow-front/README.md) para detalhes de rotas, telas, papéis e responsividade.
