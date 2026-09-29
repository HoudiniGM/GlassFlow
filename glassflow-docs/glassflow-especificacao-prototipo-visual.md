# Especificação de Protótipo Visual — GlassFlow

| Campo | Valor |
| --- | --- |
| **Documento** | Especificação de protótipo visual (para Figma) |
| **Base** | ADR-001 — Stack, arquitetura inicial e escopo do MVP do GlassFlow (v0.2) |
| **Escopo** | Apenas a camada visual/UI do MVP |
| **Design System** | shadcn/ui (componentes adaptados, conforme item 5.2 da ADR) |
| **Data** | 29/09/2026 |
| **Status** | Proposta para prototipação |

> Este documento traduz o escopo funcional da ADR-001 em especificações **exclusivamente visuais**, prontas para montar um protótipo navegável no Figma. Não define regras de negócio, contratos de API nem arquitetura — apenas telas, componentes, estados e comportamento visual. Todos os componentes citados existem no shadcn/ui e devem ser adaptados ao Design System próprio do projeto (`glassflow-front`).

---

## 1. Fundamentos visuais (Design Tokens)

Base para todas as telas. Deve ser configurada no Figma como estilos/variáveis e refletida no `components.json` / tema Tailwind do shadcn/ui.

### 1.1 Cores semânticas

Usar o sistema de tokens do shadcn/ui (`background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `card`, `popover`). Além do neutro base, definir cores semânticas de **status**, que são o coração visual do produto:

| Token semântico | Uso | Cor sugerida (light) |
| --- | --- | --- |
| `status-aguardando` | Aguardando medição / fornecedor / cliente / instalação | Âmbar / amarelo |
| `status-aprovado` | Orçamento aprovado | Verde |
| `status-recusado` / `status-cancelado` | Recusado / Cancelado | Vermelho suave (não `destructive` puro) |
| `status-instalado` | Instalado (com possível saldo) | Azul |
| `status-concluido` | Concluído e pago | Verde escuro / teal |
| `financeiro-pendente` | Saldo pendente | Âmbar |
| `financeiro-pago` | Quitado | Verde |
| `visibilidade-arquivado` | Pedido arquivado | Cinza (muted) |

- Suportar **light e dark mode** (padrão shadcn/ui via `next-themes`).
- Estados semânticos devem ter par de cor de fundo + texto com contraste AA.

### 1.2 Tipografia

- Fonte base: sans-serif legível (ex.: Inter / Geist), padrão shadcn/ui.
- Escala: `text-xs` a `text-3xl`. Títulos de página em `text-2xl`/`font-semibold`; rótulos de campo em `text-sm`; dados tabulares em `text-sm`.
- Números financeiros com fonte tabular (`tabular-nums`) para alinhamento em colunas.

### 1.3 Espaçamento e raio

- Grade base de 4px; espaçamentos em múltiplos (4/8/12/16/24/32).
- `radius` padrão do shadcn/ui (ex.: `0.5rem`), consistente em cards, botões e inputs.

### 1.4 Padrões transversais (definir como componentes/variantes no Figma)

- **Botões** (`Button`): variantes `default` (primária), `secondary`, `outline`, `ghost`, `destructive`, `link`; tamanhos `sm`/`default`/`lg`/`icon`.
- **Campos** (`Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup`) com estados: normal, foco (`ring`), erro, desabilitado, preenchido.
- **Status** representado sempre por `Badge` colorido (nunca só por texto/cor isolada — usar rótulo + cor para acessibilidade).
- **Feedback**: `Sonner`/`Toast` para sucesso/erro pós-ação; `Alert` para avisos persistentes na tela.
- **Carregamento**: `Skeleton` em listas/tabelas e `Spinner` (ícone `Loader2` animado) em botões durante submit.
- **Vazio (empty state)**: bloco centralizado com ícone, texto curto e ação primária.
- **Erro**: `Alert variant="destructive"` com mensagem clara (requisito de qualidade da ADR: "mensagens claras em falhas de salvamento").

---

## 2. Componentes shadcn/ui utilizados (inventário)

Todos disponíveis no shadcn/ui e a serem adaptados:

| Necessidade visual | Componente shadcn/ui |
| --- | --- |
| Estrutura de navegação lateral | `Sidebar` |
| Cabeçalho, títulos | `Breadcrumb`, `Separator` |
| Ações primárias/secundárias | `Button` |
| Listagens de dados | `Table`, `Data Table` (com TanStack) |
| Filtros por status | `Tabs`, `Toggle Group`, `Select` |
| Busca | `Input` (com ícone), `Command` (busca por celular do cliente) |
| Formulários | `Form`, `Label`, `Input`, `Textarea`, `Select`, `RadioGroup`, `Checkbox`, `Switch`, `Date Picker` (`Calendar` + `Popover`) |
| Status / rótulos | `Badge` |
| Ações contextuais em linha | `Dropdown Menu` |
| Diálogos de confirmação | `Alert Dialog` |
| Formulários em sobreposição | `Dialog`, `Sheet` |
| Detalhes agrupados | `Card`, `Tabs`, `Accordion` |
| Feedback | `Sonner` (toast), `Alert` |
| Carregamento | `Skeleton` |
| Menu do usuário / papel | `Avatar`, `Dropdown Menu` |
| Paginação | `Pagination` |
| Tooltip de ajuda | `Tooltip` |

---

## 3. Layout e shell da aplicação

**Aplica-se a todas as telas autenticadas.**

- **Uso principal em desktop** (ADR 3.5 e 5.1). Layout com `Sidebar` fixa à esquerda + área de conteúdo.
- **Sidebar** (`Sidebar`) com itens de navegação:
  - Clientes
  - Orçamentos
  - Pedidos
  - Resumo de pagamentos
  - **Pedidos arquivados** — visível **somente para `ADMINISTRADOR`**
  - **Administração** (Usuários / Funcionários) — visível **somente para `ADMINISTRADOR`**
- **Topbar**: breadcrumb da seção atual + à direita `Avatar` com `Dropdown Menu` (nome do usuário, papel exibido como `Badge` "Administrador"/"Operador", alternar tema, sair).
- Ocultar itens/botões restritos por papel no frontend é apenas UX — **a ADR exige validação de permissão no backend**; o protótipo deve deixar claro o que cada papel enxerga.
- Estado ativo do item de menu destacado.

---

## 4. Telas do protótipo

A seguir, cada tela com layout, componentes, estados e responsividade. **Total: 9 telas principais + fluxos sobrepostos.**

---

### Tela 1 — Login / Autenticação

**Origem:** ADR 5.6, 7.1.

**Layout:** tela única centralizada, `Card` centralizado (largura ~400px), sem sidebar.

**Conteúdo:**
- Logo/nome "GlassFlow" no topo.
- `Card` com título "Entrar" e descrição curta.
- Campos: `Input` e-mail (type email), `Input` senha (type password, com toggle de visibilidade — ícone `Eye`/`EyeOff`).
- `Button` primário "Entrar" (largura total).
- Link "Esqueci minha senha" (`Button variant="link"`).

**Estados:**
- Erro de credencial: `Alert variant="destructive"` acima do formulário ("E-mail ou senha inválidos").
- Loading: botão "Entrar" com spinner e desabilitado.
- Campos com validação visual (borda de erro + mensagem `text-destructive`).

**Sub-fluxo — Recuperação de senha:**
- Segunda variação do `Card`: título "Recuperar senha", `Input` e-mail, `Button` "Enviar link de recuperação", link "Voltar ao login".
- Confirmação de envio via `Alert` de sucesso ou `Sonner`.

**Responsividade:** já centralizado; em mobile ocupa largura total com padding.

---

### Tela 2 — Clientes (lista)

**Origem:** ADR 7.2.

**Layout:** título "Clientes" + `Button` primário "Novo cliente" à direita; barra de busca; `Data Table`.

**Componentes:**
- Busca (`Input` com ícone de lupa) — filtra por nome/celular.
- `Data Table` com colunas: Nome, Tipo (`Badge` "PF"/"PJ"), Celular, Endereço padrão (resumido), Ações.
- Coluna Ações: `Dropdown Menu` (Ver/editar, Falar com o cliente, Novo orçamento).
- `Pagination` no rodapé.

**Estados:** `Skeleton` de linhas ao carregar; empty state ("Nenhum cliente cadastrado" + botão "Novo cliente"); erro via `Alert`.

**Responsividade (mobile — somente consulta, ADR 7.10):** tabela vira lista de `Card`s (nome + celular + badge tipo); busca mantida; **sem** botão "Novo cliente" nem ações de edição.

---

### Tela 3 — Cliente (cadastro / edição) + Endereços

**Origem:** ADR 7.2.

**Layout:** apresentar em `Sheet` lateral ou página dedicada (recomenda-se `Sheet` largo para manter contexto da lista). Título "Novo cliente" / "Editar cliente".

**Seção — Dados do cliente:**
- `RadioGroup`: Pessoa Física / Pessoa Jurídica.
- `Input` Nome / Razão social.
- `Input` Celular (obrigatório — é a chave de busca).
- `Input` CPF/CNPJ — **rótulo indica "obrigatório apenas na conversão em pedido"** (`Tooltip` explicativo). Campo com máscara conforme PF/PJ.
- `Input` e-mail (opcional).

**Seção — Endereços:**
- Lista de endereços em `Card`s; endereço padrão marcado com `Badge` "Padrão".
- `Button outline` "Adicionar endereço" → abre `Dialog` com campos de endereço (CEP, logradouro, número, complemento, bairro, cidade, UF).
- `Switch`/`Checkbox` "Tornar este o endereço padrão".

**Aviso importante (ADR 7.2):** ao **alterar o endereço padrão** de cliente com pedidos não instalados, exibir `Alert Dialog` de confirmação: "Os pedidos já existentes NÃO serão atualizados automaticamente. A correção deve ser feita manualmente em cada pedido." Botões "Cancelar" / "Entendi, alterar".

**Estados:** validação inline por campo; `Sonner` de sucesso ao salvar; botão salvar com loading.

**Responsividade:** cadastro/edição **fora do escopo mobile** — no protótipo mobile, o acesso a esta tela não é oferecido.

---

### Tela 4 — Orçamentos (lista)

**Origem:** ADR 7.3, 7.4.

**Layout:** título "Orçamentos" + `Button` "Novo orçamento"; **filtro por status em destaque** (requisito: "filtrar rapidamente por status").

**Filtro de status (`Tabs` ou `Toggle Group` horizontal):**
`Todos` · `Aguardando medição` · `Aguardando fornecedor` · `Aguardando cliente` · `Aprovado` · `Recusado` — cada um com contagem opcional. Cada status usa a cor semântica correspondente.

**`Data Table` — colunas:** Cliente, Descrição (resumida), Status (`Badge` colorido), Medição prevista (data/hora), Responsável, Medidor, Ações.

**Coluna Ações (`Dropdown Menu`):** Abrir, Falar com o cliente (`Button`/item com ícone WhatsApp → abre WhatsApp Web), Gerar ficha de medição (PDF), Converter em pedido (habilitado só quando aplicável), Editar.

**Estados:** `Skeleton`; empty state por filtro; erro via `Alert`.

**Responsividade (mobile — consulta):** filtro de status vira `Select`; linhas viram `Card`s com Cliente + `Badge` status + data de medição; ações restritas à consulta.

---

### Tela 5 — Orçamento (cadastro / edição / detalhe)

**Origem:** ADR 7.3, 7.4, 7.5, 7.6.

**Layout:** página dedicada com `Card`s agrupando informações. Cabeçalho com identificador do orçamento + `Badge` de status + botão de mudança de status.

**Seção — Dados gerais:**
- Busca/seleção de cliente por **celular** (`Command`/`Combobox`): ao digitar o número, buscar cliente; se **não encontrado**, exibir call-to-action "Cadastrar novo cliente" (abre Tela 3 em `Dialog`/`Sheet`) — ADR 7.2.
- Seleção de **endereço da instalação** (`Select` com endereços do cliente) + opção "Adicionar outro endereço" e "Tornar padrão".
- `Textarea` Descrição (inclui infos de fornecedor — não há cadastro de fornecedor no MVP).
- `Select` Responsável (atendimento).
- `Select` Medidor (funcionário — opcional).
- `Date Picker` + hora previstos para medição (`Calendar` em `Popover` + input de horário).

**Seção — Status (`Select` de status):** com as 5 opções e cor semântica. Mudança é **manual** (ADR 7.4).

**Ações no topo/rodapé:**
- `Button` "Salvar".
- `Button outline` "Falar com o cliente" (ícone WhatsApp).
- `Button outline` "Gerar ficha de medição (PDF)".
- `Button` primário "Converter em pedido".

**Sub-fluxo — Converter em pedido (ADR 7.6):**
- `Alert Dialog` de confirmação que **valida CPF/CNPJ**: se ausente, exibir aviso e bloquear com link para completar o cadastro.
- Ao confirmar: `Sonner` de sucesso e navegação para o **pedido criado** (Tela 7) para conferência.
- Após conversão, o orçamento aprovado fica **imutável** — exibir visualmente como somente-leitura (`Badge` "Aprovado" + campos desabilitados + aviso "Registro histórico, não editável").

**Estados:** validação inline; loading nos botões; erro via `Alert`/`Sonner`.

---

### Tela 5b — Ficha de medição (PDF) — layout de impressão

**Origem:** ADR 7.5.

Não é tela de app, mas **um artefato visual a prototipar** (layout A4 retrato). Especificar no Figma um frame A4:

- Cabeçalho: nome/logo GlassFlow + identificação do orçamento.
- Nome e telefone do cliente.
- Endereço da instalação.
- Data e horário agendados.
- Descrição existente.
- Nome do responsável (quando houver).
- Nome do medidor **ou** linha em branco para preenchimento manual quando não definido.
- **Grande área em branco** (com leve grade/pontilhado opcional) para medidas, desenhos e observações manuais.
- Legível em preto e branco (para impressão).

---

### Tela 6 — Resumo de pagamentos

**Origem:** ADR 7.9.

> Nome intencional: **"Resumo de pagamentos"**, não extrato — o MVP não guarda histórico individual de recebimentos.

**Layout:** título "Resumo de pagamentos" + área de filtros + tabela + cards de totais opcionais no topo.

**Filtros:**
- `Toggle Group`/`Tabs`: Todos · Pagos · Com saldo pendente.
- Busca por cliente/pedido (`Input`).
- Filtro por período (`Date Picker` de intervalo — conforme datas disponíveis).

**`Data Table` — colunas:** Cliente, Pedido, Valor total, Valor pago, Saldo, Data do último pagamento, Situação financeira (`Badge` `PENDENTE`/`PAGO`). Valores com `tabular-nums`.

**Estados:** `Skeleton`; empty state por filtro; erro via `Alert`.

**Responsividade (mobile — consulta):** filtros viram `Select`; linhas viram `Card`s (Cliente + valores + `Badge` situação). Somente consulta.

---

### Tela 7 — Pedidos (lista)

**Origem:** ADR 7.7, 7.8, 9.1.

**Layout:** título "Pedidos" + filtros; `Data Table`. Não há "criar pedido" avulso — pedido nasce da conversão de orçamento.

**Filtros:**
- `Toggle Group`/`Tabs` por **status operacional**: `Todos` · `Aguardando fornecedor` · `Aguardando instalação` · `Instalado` · `Concluído` · `Cancelado` (cores semânticas).
- Filtro adicional por cliente (`Input`/`Combobox`).

**`Data Table` — colunas:** Cliente, Orçamento de origem (link), Status operacional (`Badge`), Situação financeira (`Badge` PENDENTE/PAGO), Valor total, Saldo, Responsável, Ações.

**Ações (`Dropdown Menu`):** Abrir, Falar com o cliente, (Admin) Arquivar — habilitado **somente** para `CONCLUIDO`/`CANCELADO`.

**Observação de visibilidade:** listagem mostra apenas pedidos **ATIVOS** (não arquivados) — ADR 9.

**Responsividade (mobile — consulta):** filtro em `Select`; linhas em `Card`s; somente consulta.

---

### Tela 8 — Pedido (detalhe / edição)

**Origem:** ADR 7.7, 7.8, 7.9.

**Layout:** página dedicada. Cabeçalho: identificação do pedido + `Badge` status operacional + `Badge` situação financeira + referência ao orçamento de origem (link). Organizar em `Tabs` ou `Card`s.

**Seção — Dados do pedido:**
- Cliente, telefone, **endereço histórico** (copiado do orçamento; ADR informa que é histórico).
- Descrição.
- Responsável e Medidor.
- `Select` de **status operacional** (mudança manual). A opção "Concluído" deve refletir visualmente a regra: se não instalado ou com saldo pendente, exibir estado desabilitado + `Tooltip`/`Alert` explicando o bloqueio (validação real é no backend).

**Endereço:** `Button` "Alterar endereço" habilitado **somente enquanto não instalado**; desabilitado com tooltip quando `INSTALADO`/`CONCLUIDO`.

**Seção — Resumo financeiro (ADR 7.9):**
- Cards/linhas: Valor total, Valor total pago, Saldo calculado, Data do último pagamento, Situação (`Badge` PENDENTE/PAGO).
- `Button` "Registrar recebimento" → `Dialog` com um único `Input` "Valor recebido".
  - **Validação visual imediata:** não permitir que o pago ultrapasse o total; se exceder, mostrar erro no campo ("O valor excede o saldo de R$ X") e desabilitar confirmação. (A ADR exige validação também no backend.)
  - Após salvar: valor some ao total pago; `Sonner` de sucesso.
- Correção de valores já salvos: ação/campo visível **somente para `ADMINISTRADOR`** (`Badge`/aviso indicando permissão restrita).

**Ações:** Salvar, Falar com o cliente, (Admin) Arquivar (se `CONCLUIDO`/`CANCELADO`).

**Estados:** loading, validação, erro (`Alert`), sucesso (`Sonner`).

---

### Tela 9 — Pedidos arquivados (somente ADMINISTRADOR)

**Origem:** ADR 9.1, 9.2, 9.3.

**Layout:** título "Pedidos arquivados" + aviso `Alert` "Área restrita a administradores. Registros em consulta somente-leitura."

**`Data Table`:** mesmas colunas de Pedidos + coluna "Arquivado em" / "Arquivado por". Todas as linhas com `Badge` cinza "Arquivado".

**Ações (`Dropdown Menu`):** Ver (somente leitura), **Restaurar** (`Alert Dialog` de confirmação — "Pedido volta às consultas comuns mantendo o status operacional anterior").

**Filtro:** incluir período; a inclusão de arquivados em relatórios é filtro explícito **apenas nesta área administrativa**.

**Visual de somente-leitura:** ao abrir um arquivado, campos desabilitados + banner "Para editar, restaure o pedido primeiro."

---

### Tela 10 — Administração: Usuários e Funcionários (somente ADMINISTRADOR)

**Origem:** ADR 7.1, 8.

**Layout:** título "Administração" com `Tabs`: **Usuários** | **Funcionários**.

**Aba Usuários:**
- `Data Table`: Nome, E-mail, Papel (`Badge` Administrador/Operador), Situação (`Badge` Ativo/Inativo), Ações.
- `Button` "Novo usuário" → `Dialog`/`Sheet`: Nome, E-mail, `RadioGroup`/`Select` Papel (Administrador/Operador), `Switch` Ativo.
- Ação inativar (`Alert Dialog`): aviso de que a **inativação deve ser coordenada com a desativação no Firebase** (ADR 5.6) — exibir como texto informativo.

**Aba Funcionários:**
- `Data Table`: Nome, Vínculo com usuário (opcional — `Badge` "Com acesso"/"Sem acesso"), Ações.
- `Button` "Novo funcionário" → `Dialog`: Nome + opção de vincular a uma conta de usuário (`Select`/`Combobox`). **Sem documento pessoal** (ADR 8.1). Funcionário pode ser apenas responsável/medidor sem conta.

**Estados:** loading, empty state, validação, `Sonner` de sucesso.

---

## 5. Padrões de estado (obrigatórios em todas as telas de dados)

Prototipar explicitamente cada estado (a ADR lista feedback, carregamento e erro como parte do Design System — item 5.2):

| Estado | Representação visual |
| --- | --- |
| **Carregando** | `Skeleton` nas linhas da tabela / cards; `Loader2` em botões durante submit |
| **Vazio** | Ilustração/ícone + mensagem curta + ação primária |
| **Erro** | `Alert variant="destructive"` com mensagem clara e ação de repetir |
| **Sucesso** | `Sonner` (toast) discreto |
| **Sem permissão** | Item oculto no menu + (se acessado por URL) tela de "Acesso restrito" |
| **Somente leitura** | Campos desabilitados + banner explicativo (orçamentos aprovados, pedidos arquivados) |

---

## 6. Responsividade (ADR 5.1 e 7.10)

Regra visual central do MVP:

- **Desktop:** experiência completa (cadastro, edição, status, pagamentos).
- **Mobile (web responsivo, não app):** **somente consulta** de Clientes, Orçamentos, Pedidos, dados da ficha e Resumo de pagamentos.
  - Sidebar colapsa em menu (`Sheet` acionado por botão hambúrguer).
  - Tabelas convertem-se em listas de `Card`s.
  - Botões e ações de escrita (Novo, Editar, Alterar status, Registrar recebimento, Converter) **não aparecem** no layout mobile.
  - Prototipar pelo menos 2 breakpoints: `desktop` (≥1024px) e `mobile` (~375px).

---

## 7. Elementos transversais a prototipar

- **Botão "Falar com o cliente":** ícone WhatsApp + rótulo; comportamento visual de abrir link externo (WhatsApp Web). Presente em Clientes, Orçamentos e Pedidos.
- **Badges de status:** biblioteca única de `Badge` com todas as variantes de status de orçamento, pedido e financeiro.
- **Confirmações destrutivas/sensíveis:** sempre via `Alert Dialog` (alterar endereço padrão, converter em pedido, arquivar, restaurar, inativar usuário).
- **Indicação de papel:** `Badge` "Administrador"/"Operador" no menu do usuário; elementos restritos claramente marcados.

---

## 8. Mapa de navegação (para protótipo navegável)

```text
Login ──► [autenticado] ──► Shell (Sidebar + Topbar)
                               ├─ Clientes ──► Cliente (Sheet: cadastro/edição) ──► Endereços (Dialog)
                               ├─ Orçamentos ──► Orçamento (detalhe) ──► Converter em pedido (Alert Dialog) ──► Pedido
                               │                                     └─► Ficha de medição (PDF A4)
                               ├─ Pedidos ──► Pedido (detalhe) ──► Registrar recebimento (Dialog)
                               ├─ Resumo de pagamentos
                               ├─ [ADMIN] Pedidos arquivados ──► Restaurar (Alert Dialog)
                               └─ [ADMIN] Administração (Tabs: Usuários | Funcionários)
```

---

## 9. Checklist de telas para o Figma

- [ ] 0. Design tokens (cores, tipografia, espaçamento, badges de status) + light/dark
- [ ] 1. Login + Recuperação de senha
- [ ] 2. Clientes (lista) — desktop + mobile
- [ ] 3. Cliente cadastro/edição + endereços (+ aviso de endereço padrão)
- [ ] 4. Orçamentos (lista, filtro por status) — desktop + mobile
- [ ] 5. Orçamento (detalhe/edição + converter em pedido + estado imutável)
- [ ] 5b. Ficha de medição (PDF A4)
- [ ] 6. Resumo de pagamentos — desktop + mobile
- [ ] 7. Pedidos (lista, filtros) — desktop + mobile
- [ ] 8. Pedido (detalhe + resumo financeiro + registrar recebimento)
- [ ] 9. Pedidos arquivados (ADMIN)
- [ ] 10. Administração — Usuários e Funcionários (ADMIN)
- [ ] Estados transversais: carregando, vazio, erro, sucesso, sem permissão, somente-leitura

---

*Especificação derivada da ADR-001 (v0.2). Escopo estritamente visual; regras de negócio, contratos de API e permissões são validados no backend conforme a ADR.*
