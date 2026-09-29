# GlassFlow — Protótipo Visual (Frontend)

Protótipo visual **navegável** do GlassFlow, um sistema de gestão de orçamentos e pedidos para vidraçaria. Construído em **React + TypeScript + Vite + Tailwind CSS + componentes no estilo shadcn/ui**, conforme a stack e o escopo definidos na **ADR-001**.

> ⚠️ Este é um protótipo **apenas da camada visual**. Todos os dados são **mockados** (em `src/data/mock.ts`). Não há backend, Firebase, Prisma ou persistência real — ações como salvar, converter e registrar pagamento apenas simulam feedback visual.

## Como executar

Pré-requisitos: **Node.js 18+** (recomendado 20/22).

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (geralmente `http://localhost:5173`).

Outros comandos:

```bash
npm run build      # type-check + build de produção (gera dist/)
npm run preview    # serve o build de produção localmente
npm run typecheck  # apenas verificação de tipos
```

## Rotas / Telas

| Rota | Tela | Observações |
| --- | --- | --- |
| `/login` | Login + recuperação de senha | Fora do layout autenticado |
| `/clientes` | Clientes (lista + cadastro/edição em Sheet + endereços) | Aviso ao alterar endereço padrão |
| `/orcamentos` | Orçamentos (lista com filtro por status) | |
| `/orcamentos/:id` | Orçamento (detalhe, mudança de status, converter em pedido) | Estado imutável quando `APROVADO` |
| `/orcamentos/:id/ficha` | Ficha de medição (layout A4 para impressão) | Botão "Imprimir / Salvar PDF" |
| `/pedidos` | Pedidos (lista com filtros) | |
| `/pedidos/:id` | Pedido (detalhe + resumo financeiro + registrar recebimento) | Validação de saldo; bloqueio de conclusão |
| `/pagamentos` | Resumo de pagamentos | Filtro Pagos / Com saldo pendente |
| `/arquivados` | Pedidos arquivados | **Somente ADMINISTRADOR** |
| `/administracao` | Usuários e Funcionários | **Somente ADMINISTRADOR** |

Ao abrir a raiz `/`, você é redirecionado para `/orcamentos`.

## Papéis (ADMINISTRADOR / OPERADOR)

O protótipo permite **alternar o papel** pelo menu do avatar (canto superior direito → "Ver como..."). Itens restritos (Pedidos arquivados, Administração) só aparecem para o **Administrador**, e algumas ações (arquivar, corrigir valores) também são condicionadas ao papel.

> No MVP real, as permissões são validadas no **backend** — ocultar botões no frontend é apenas UX.

## Responsividade

- **Desktop:** experiência completa.
- **Mobile:** conforme a ADR, o MVP oferece **somente consulta** — as tabelas viram cards e as ações de escrita são omitidas. Reduza a janela do navegador para ver o comportamento.

## Recursos visuais implementados

- **Tema claro/escuro** (toggle na topbar).
- **Cores semânticas de status** (orçamento, pedido e financeiro) via `Badge`.
- **Estados**: carregando (spinner), vazio (empty state), erro (`Alert`), sucesso (`toast`/Sonner), somente-leitura e sem-permissão.
- **Diálogos de confirmação** (`AlertDialog`) para ações sensíveis: alterar endereço padrão, converter em pedido, arquivar, restaurar.
- **Ação "Falar com o cliente"** abrindo o WhatsApp Web (`wa.me`).
- **Ficha de medição** em layout A4 pronto para impressão.

## Estrutura

```
src/
├─ app/            # contexto de sessão (papel) e tema
├─ components/
│  ├─ ui/          # componentes base no estilo shadcn/ui
│  └─ ...          # layout, sidebar, formulários, helpers
├─ data/           # tipos, mapas de status e dados mockados
├─ pages/          # uma tela por arquivo
├─ lib/            # utilitários (cn, formatação de moeda/data)
├─ App.tsx         # roteamento
└─ main.tsx        # entrada
```

## Relação com a ADR-001

O protótipo cobre o escopo funcional visual do MVP: autenticação, clientes/endereços, orçamentos (com os 5 status), ficha de medição, conversão em pedido, pedidos (com os 5 status operacionais), resumo de pagamentos, exclusão lógica/arquivamento (admin) e administração de usuários/funcionários. O Design System é derivado do shadcn/ui, com tokens e cores próprias definidos em `src/index.css` e `tailwind.config.js`.

Este código pode servir de base para o repositório `glassflow-front`.
