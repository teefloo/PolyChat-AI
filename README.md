<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**A multi-page chat studio for OpenRouter — compare up to three LLMs side by side, in one session.**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[Overview](#overview) ·
[Features](#features) ·
[Getting started](#getting-started) ·
[Privacy & legal](#privacy--legal) ·
[Development](#development) ·
[Resources](#resources)

</div>

---

> **Converser avec l'intelligence.** A quiet, editorial interface for interrogating several language models in parallel, comparing their voices, and composing the right answer.

PolyChat AI is a single-page web app that talks to the [OpenRouter](https://openrouter.ai/) API. Its signature feature is **multi-page composition**: open up to three chat columns side-by-side inside a single session, pick a different model in each, and stream their answers in parallel — perfect for benchmarking, prompt iteration, or simply getting a second opinion.

Everything lives in your browser. No accounts, no server, no telemetry: sessions, settings and consent are stored in `localStorage`, and your API key never leaves the device.

---

## Overview

| | |
| --- | --- |
| **Interface** | French-language UI, editorial layout (Fraunces · IBM Plex · JetBrains Mono) |
| **Models** | Any model exposed by OpenRouter (GPT-4o, Claude 3.5, Gemini, Llama, Mistral…) |
| **Composition** | 1, 2 or 3 parallel chat columns per session, model per column |
| **Streaming** | Live token streaming with per-window stop and regeneration |
| **Markdown** | `react-markdown` + `remark-gfm` (tables, task lists, code blocks) |
| **Theming** | Light / dark, persisted across sessions |
| **Storage** | `localStorage` only — no backend, no cookies, no remote DB |
| **Legal** | RGPD/CNIL consent gate on first load, French legal documents in-app |

## Features

- **Multi-page composition** — open up to three chat columns inside one session. Broadcast a single message to all columns, or send a targeted one to the focused window.
- **Streaming with control** — `AbortController`-based cancellation per window, regenerate any assistant message with one click, stop everything at once.
- **Session history** — sidebar grouped by *Aujourd'hui / Hier / date*, with inline search, rename and delete. Empty sessions are pruned automatically.
- **Model picker** — searchable dropdown sourced live from `/api/v1/models`. Set per-window.
- **Generation controls** — system prompt, temperature and max-tokens in Settings, applied to every request.
- **Markdown rendering** — full GFM in the assistant messages, including tables, task lists and code fences.
- **Theme toggle** — light and dark variants, persisted, pre-paint script in `index.html` avoids the flash on reload.
- **Keyboard-friendly** — focus traps in modals, `Esc` to dismiss, `Tab` cycling, skip-link to main content, ARIA roles on the column switcher.
- **Data sovereignty** — export everything (settings, sessions, consent) as a single JSON file, or wipe all three stores in one click.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 20 or newer
- An [OpenRouter](https://openrouter.ai/) API key (pay-as-you-go, free tier available)

### Install and run

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

The dev server starts on `http://localhost:5173`. Open it, click **Configurer la clé** in the empty state, paste your OpenRouter key, and you're in.

### Build and preview

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

The `build` script is the verification gate: it runs `tsc -b` (which catches type errors) before bundling. There is no test runner in this project — see [Development](#development) for the full command list.

## Configuration

All configuration happens in **Settings** (`Ctrl/⌘ + K`) and is persisted in `localStorage["polychat-settings"]`.

| Field | Description |
| --- | --- |
| **Clé API** | Your OpenRouter key. Stored XOR-obfuscated in `localStorage` (see [Security](#security) below). |
| **Modèle** | Default model loaded on first run; can be overridden per window. |
| **Thème** | Clair / Sombre. |
| **Prompt système** | Prepended to every request in the session. |
| **Température** | Sampling temperature, `0.0` – `2.0`. |
| **Longueur max** | Max tokens per response (Court → Très long presets). |

> [!TIP]
> The very first launch shows a two-step empty state: configure your key, then choose a model. The settings modal also lets you open the privacy panel to manage consent at any time.

## Privacy & legal

This is a French-language application and respects RGPD / CNIL guidelines by design.

- **First-load consent gate** — the app blocks until you accept the current legal version. The version is tracked in `src/hooks/useLegal.ts` (`CURRENT_LEGAL_VERSION`); bump it whenever the legal text changes meaningfully.
- **Google Fonts are consent-gated** — they are *not* declared in `index.css`. They are injected by `src/services/fontLoader.ts` only after you grant `fontsConsent` in the privacy modal. The pre-paint script in `index.html` reads `polychat-legal` to set `data-fonts` before the first paint, so there is no flash.
- **No tracking, no cookies, no backend** — only three `localStorage` keys are used: `polychat-settings`, `polychat_history`, `polychat-legal`.
- **Data export** — `exportAllUserData()` in `src/services/dataExport.ts` bundles settings, sessions and consent into a downloadable JSON.
- **Full wipe** — `clearAllUserData()` removes all three keys. Accessible from the privacy modal.
- **In-app legal documents** — Privacy, Terms, Cookies, AI notices, Legal notices are rendered from `src/legal/documents.ts` and reachable from the sidebar footer and modals.

> [!IMPORTANT]
> The `polychat-settings` key holds your OpenRouter API key XOR-obfuscated via `src/services/crypto.ts`. This is **obfuscation, not encryption** — the key and the obfuscation function both ship in the JS bundle. Don't rely on it against a determined local attacker. The root `.env` file is leftover and **not read** by the app; the settings modal is the only source of truth for the key.

## Development

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

There is **no test runner** in this repository — `vitest` and `jest` are not installed. Treat `npm run build` as the green light: if `tsc -b` passes, the app is type-safe.

> [!NOTE]
> The hand-written CSS in `src/index.css` (~71 KB) is the only styling layer. The `tailwindcss` and `@tailwindcss/postcss` packages listed in `package.json` are not used and have no PostCSS config. Do not introduce Tailwind without explicit owner approval.

### Project layout

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

## Resources

- [OpenRouter documentation](https://openrouter.ai/docs) — the API PolyChat talks to
- [React 19 release notes](https://react.dev/blog/2024/12/05/react-19) — concurrent features used for streaming
- [Vite guide](https://vite.dev/guide/) — dev server and build
- [Zustand persist middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — the three localStorage stores
- [CNIL — Guide RGPD développeurs](https://www.cnil.fr/fr/developer-guide) — privacy-by-design reference

## Getting help

- **In-app FAQ** — open the sidebar and look for the help link; the FAQ modal routes to settings, legal documents and the privacy panel in one click.
- **Bug reports** — open an issue on the repository with reproduction steps and the output of `npm run build` and `npm run lint`.
- **Security disclosures** — please use a private channel rather than filing a public issue for anything marked security in [Privacy & legal](#privacy--legal).

<div align="center">
<sub>Composé sur papier numérique — sérif Fraunces · grotesk IBM Plex · mono JetBrains</sub>
</div>
