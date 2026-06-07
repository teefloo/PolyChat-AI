<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**Um estúdio de chat multi-página para OpenRouter — compare até três LLMs lado a lado, em uma única sessão.**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[Visão geral](#visao-geral) ·
[Recursos](#recursos) ·
[Primeiros passos](#primeiros-passos) ·
[Privacidade e legal](#privacidade-e-legal) ·
[Desenvolvimento](#desenvolvimento) ·
[Recursos](#recursos-1)

</div>

<!-- README-I18N:START -->
[English](./README.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Deutsch](./README.de.md) · [Italiano](./README.it.md) · **Português** · [汉语](./README.zh.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Русский](./README.ru.md)
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** Uma interface editorial e silenciosa para interrogar vários modelos de linguagem em paralelo, comparar suas vozes e compor a resposta certa.

PolyChat AI é um aplicativo web de página única que se comunica com a API do [OpenRouter](https://openrouter.ai/). Seu grande diferencial é a **composição multi-página**: abra até três colunas de chat lado a lado dentro de uma única sessão, escolha um modelo diferente em cada uma e transmita suas respostas em paralelo — perfeito para benchmarking, iteração de prompts ou simplesmente para obter uma segunda opinião.

Tudo acontece no seu navegador. Sem contas, sem servidor, sem telemetria: sessões, configurações e consentimento são armazenados em `localStorage`, e sua chave de API nunca sai do dispositivo.

---

## Visão geral

| | |
| --- | --- |
| **Interface** | Interface em francês, layout editorial (Fraunces · IBM Plex · JetBrains Mono) |
| **Modelos** | Qualquer modelo exposto pelo OpenRouter (GPT-4o, Claude 3.5, Gemini, Llama, Mistral…) |
| **Composição** | 1, 2 ou 3 colunas de chat paralelas por sessão, um modelo por coluna |
| **Streaming** | Streaming de tokens ao vivo, com parada e regeneração por janela |
| **Markdown** | `react-markdown` + `remark-gfm` (tabelas, listas de tarefas, blocos de código) |
| **Temas** | Claro / escuro, persistido entre sessões |
| **Armazenamento** | Apenas `localStorage` — sem backend, sem cookies, sem banco remoto |
| **Aspectos legais** | Portal de consentimento RGPD/CNIL no primeiro acesso, documentos legais em francês no app |

## Recursos

- **Composição multi-página** — abra até três colunas de chat dentro de uma única sessão. Envie uma única mensagem para todas as colunas, ou direcione uma mensagem específica para a janela em foco.
- **Streaming com controle** — cancelamento por janela baseado em `AbortController`, regenere qualquer mensagem do assistente com um clique, pare tudo de uma vez.
- **Histórico de sessões** — barra lateral agrupada por *Hoje / Ontem / data*, com busca inline, renomeação e exclusão. Sessões vazias são removidas automaticamente.
- **Seletor de modelo** — menu suspenso pesquisável, alimentado ao vivo por `/api/v1/models`. Definível por janela.
- **Controles de geração** — prompt de sistema, temperatura e max-tokens em Configurações, aplicados a cada requisição.
- **Renderização de Markdown** — GFM completo nas mensagens do assistente, incluindo tabelas, listas de tarefas e blocos de código.
- **Alternador de tema** — variantes clara e escura, persistidas, com script pré-paint em `index.html` para evitar o flash ao recarregar.
- **Suporte a teclado** — focus traps em modais, `Esc` para fechar, navegação por `Tab`, link de pular para o conteúdo principal, papéis ARIA no alternador de colunas.
- **Soberania de dados** — exporte tudo (configurações, sessões, consentimento) como um único arquivo JSON, ou apague as três lojas com um clique.

## Primeiros passos

### Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior
- Uma chave de API do [OpenRouter](https://openrouter.ai/) (pay-as-you-go, plano gratuito disponível)

### Instalar e executar

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

O servidor de desenvolvimento inicia em `http://localhost:5173`. Abra-o, clique em **Configurer la clé** no estado vazio, cole sua chave do OpenRouter, e pronto.

### Build e preview

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ localmente
```

O script `build` atua como gate de verificação: ele executa `tsc -b` (que captura erros de tipo) antes de empacotar. Não há test runner neste projeto — veja [Desenvolvimento](#desenvolvimento) para a lista completa de comandos.

## Configuração

Toda a configuração acontece em **Configurações** (`Ctrl/⌘ + K`) e é persistida em `localStorage["polychat-settings"]`.

| Campo | Descrição |
| --- | --- |
| **Chave API** | Sua chave OpenRouter. Armazenada com obfuscação XOR em `localStorage` (veja [Segurança](#security) abaixo). |
| **Modelo** | Modelo padrão carregado na primeira execução; pode ser substituído por janela. |
| **Tema** | Claro / Escuro. |
| **Prompt de sistema** | Adicionado ao início de cada requisição na sessão. |
| **Temperatura** | Temperatura de amostragem, `0.0` – `2.0`. |
| **Comprimento máximo** | Máximo de tokens por resposta (predefinições Curto → Muito longo). |

> [!TIP]
> O primeiro lançamento mostra um estado vazio em duas etapas: configure sua chave e, em seguida, escolha um modelo. O modal de configurações também permite abrir o painel de privacidade para gerenciar o consentimento a qualquer momento.

## Privacidade e legal

Este é um aplicativo em francês e respeita as diretrizes RGPD / CNIL por design.

- **Portal de consentimento no primeiro acesso** — o aplicativo é bloqueado até que você aceite a versão legal atual. A versão é rastreada em `src/hooks/useLegal.ts` (`CURRENT_LEGAL_VERSION`); incremente-a sempre que o texto legal mudar de forma significativa.
- **Google Fonts são consent-gated** — *não* estão declarados em `index.css`. São injetados por `src/services/fontLoader.ts` somente depois que você conceder `fontsConsent` no modal de privacidade. O script pré-paint em `index.html` lê `polychat-legal` para definir `data-fonts` antes do primeiro paint, então não há flash.
- **Sem rastreamento, sem cookies, sem backend** — apenas três chaves `localStorage` são usadas: `polychat-settings`, `polychat_history`, `polychat-legal`.
- **Exportação de dados** — `exportAllUserData()` em `src/services/dataExport.ts` empacota configurações, sessões e consentimento em um JSON para download.
- **Limpeza total** — `clearAllUserData()` remove as três chaves. Acessível pelo modal de privacidade.
- **Documentos legais no app** — Privacidade, Termos, Cookies, avisos de IA e avisos legais são renderizados a partir de `src/legal/documents.ts` e acessíveis pelo rodapé da barra lateral e pelos modais.

> [!IMPORTANT]
> A chave `polychat-settings` contém sua chave de API do OpenRouter obfuscada via XOR em `src/services/crypto.ts`. Isso é **obfuscação, não criptografia** — a chave e a função de obfuscação estão ambas no bundle JS. Não confie nisso contra um atacante local determinado. O arquivo `.env` na raiz é um resíduo e **não é lido** pelo app; o modal de configurações é a única fonte de verdade para a chave.

## Desenvolvimento

```bash
npm run dev       # Vite dev server com HMR
npm run build     # tsc -b + vite build (portão de type-check)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve a build de produção localmente
```

Não há **nenhum test runner** neste repositório — `vitest` e `jest` não estão instalados. Trate `npm run build` como o sinal verde: se `tsc -b` passar, o app é type-safe.

> [!NOTE]
> O CSS escrito à mão em `src/index.css` (~71 KB) é a única camada de estilo. Os pacotes `tailwindcss` e `@tailwindcss/postcss` listados em `package.json` não são usados e não têm configuração PostCSS. Não introduza Tailwind sem aprovação explícita do proprietário.

### Estrutura do projeto

```
src/
├── components/        # Flat — one file per component, PascalCase
│   ├── ChatColumn.tsx     # One of up to 3 parallel chat columns per session
│   ├── ChatInput.tsx
│   ├── MessagesArea.tsx   # react-markdown + remark-gfm rendering
│   ├── ModelSelector.tsx
│   ├── SettingsModal.tsx
│   ├── Sidebar.tsx        # Session list grouped by date
│   ├── TopBar.tsx
│   ├── ConsentGate.tsx    # RGPD/CNIL first-load gate
│   ├── LegalModal.tsx
│   ├── PrivacyModal.tsx
│   ├── LegalFooter.tsx
│   └── FAQModal.tsx
├── hooks/             # Zustand stores
│   ├── useChatStore.ts    # sessions[], activeSessionId, focusedWindowId
│   ├── useSettings.ts     # apiKey, selectedModel, theme, systemPrompt…
│   └── useLegal.ts        # legalAccepted, fontsConsent, version
├── services/
│   ├── openRouter.ts      # streamAIResponse, fetchAIResponse, fetchModels
│   ├── localStorage.ts    # Save/load sessions with migration
│   ├── crypto.ts          # XOR obfuscation helpers
│   ├── fontLoader.ts      # Injects Google Fonts only after consent
│   └── dataExport.ts      # exportAllUserData, clearAllUserData
├── legal/
│   └── documents.ts       # All French legal text
└── types/index.ts         # Message, Model, Settings, PageWindow, ChatSession
```

## Recursos

- [Documentação do OpenRouter](https://openrouter.ai/docs) — a API com a qual o PolyChat se comunica
- [Notas de lançamento do React 19](https://react.dev/blog/2024/12/05/react-19) — recursos concorrentes usados para streaming
- [Guia do Vite](https://vite.dev/guide/) — dev server e build
- [Middleware Zustand persist](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — as três lojas de localStorage
- [CNIL — Guia RGPD para desenvolvedores](https://www.cnil.fr/fr/developer-guide) — referência de privacy-by-design

## Obter ajuda

- **FAQ no app** — abra a barra lateral e procure o link de ajuda; o modal FAQ direciona para configurações, documentos legais e painel de privacidade com um clique.
- **Reportar bugs** — abra uma issue no repositório com passos de reprodução e a saída de `npm run build` e `npm run lint`.
- **Divulgações de segurança** — use um canal privado em vez de abrir uma issue pública para qualquer coisa marcada como segurança em [Privacidade e legal](#privacidade-e-legal).

<div align="center">
<sub>Composto em papel digital — sérif Fraunces · grotesk IBM Plex · mono JetBrains</sub>
</div>
