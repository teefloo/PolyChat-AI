<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**Uno studio di chat multi-pagina per OpenRouter — confronta fino a tre LLM fianco a fianco, in un'unica sessione.**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[Panoramica](#panoramica) ·
[Funzionalità](#funzionalita) ·
[Per iniziare](#per-iniziare) ·
[Privacy & note legali](#privacy--note-legali) ·
[Sviluppo](#sviluppo) ·
[Risorse](#risorse)

</div>

<!-- README-I18N:START -->
[English](./README.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Deutsch](./README.de.md) · **Italiano** · [Português](./README.pt.md) · [汉语](./README.zh.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Русский](./README.ru.md)
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** Un'interfaccia silenziosa ed editoriale per interrogare più modelli linguistici in parallelo, confrontare le loro voci e comporre la risposta giusta.

PolyChat AI è un'applicazione web a pagina singola che comunica con l'API di [OpenRouter](https://openrouter.ai/). La sua caratteristica distintiva è la **composizione multi-pagina**: apri fino a tre colonne di chat affiancate in un'unica sessione, scegli un modello diverso per ciascuna e trasmetti le loro risposte in parallelo — perfetto per benchmark, iterazione dei prompt o semplicemente per ottenere un secondo parere.

Tutto vive nel tuo browser. Nessun account, nessun server, nessuna telemetria: sessioni, impostazioni e consensi sono memorizzati in `localStorage` e la tua chiave API non lascia mai il dispositivo.

---

## Panoramica

| | |
| --- | --- |
| **Interfaccia** | UI in lingua francese, layout editoriale (Fraunces · IBM Plex · JetBrains Mono) |
| **Modelli** | Qualsiasi modello esposto da OpenRouter (GPT-4o, Claude 3.5, Gemini, Llama, Mistral…) |
| **Composizione** | 1, 2 o 3 colonne di chat in parallelo per sessione, modello per colonna |
| **Streaming** | Streaming di token in tempo reale con interruzione e rigenerazione per finestra |
| **Markdown** | `react-markdown` + `remark-gfm` (tabelle, elenchi di attività, blocchi di codice) |
| **Temi** | Chiaro / scuro, persistente tra le sessioni |
| **Archiviazione** | Solo `localStorage` — nessun backend, nessun cookie, nessun database remoto |
| **Note legali** | Cancello di consenso RGPD/CNIL al primo avvio, documenti legali francesi in-app |

## Funzionalità

- **Composizione multi-pagina** — apri fino a tre colonne di chat in un'unica sessione. Invia un singolo messaggio a tutte le colonne, oppure un messaggio mirato alla finestra attiva.
- **Streaming con controllo** — cancellazione basata su `AbortController` per finestra, rigenera qualsiasi messaggio dell'assistente con un clic, interrompi tutto in una volta.
- **Cronologia delle sessioni** — barra laterale raggruppata per *Oggi / Ieri / data*, con ricerca inline, rinomina ed eliminazione. Le sessioni vuote vengono rimosse automaticamente.
- **Selettore del modello** — menu a tendina ricercabile, popolato in diretta da `/api/v1/models`. Configurabile per finestra.
- **Controlli di generazione** — prompt di sistema, temperatura e numero massimo di token nelle Impostazioni, applicati a ogni richiesta.
- **Rendering Markdown** — GFM completo nei messaggi dell'assistente, incluse tabelle, elenchi di attività e blocchi di codice.
- **Cambio tema** — varianti chiara e scura, persistenti; lo script pre-paint in `index.html` evita il flash al ricaricamento.
- **Tastiera-friendly** — focus trap nelle modali, `Esc` per chiudere, navigazione con `Tab`, skip-link al contenuto principale, ruoli ARIA nel selettore di colonna.
- **Sovranità dei dati** — esporta tutto (impostazioni, sessioni, consensi) in un unico file JSON, oppure cancella i tre archivi con un solo clic.

## Per iniziare

### Prerequisiti

- [Node.js](https://nodejs.org) 20 o versioni successive
- Una chiave API di [OpenRouter](https://openrouter.ai/) (pay-as-you-go, livello gratuito disponibile)

### Installazione e avvio

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

Il server di sviluppo si avvia su `http://localhost:5173`. Aprilo, clicca su **Configurer la clé** nello stato vuoto, incolla la tua chiave OpenRouter e il gioco è fatto.

### Build e anteprima

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

Lo script `build` è il cancello di verifica: esegue `tsc -b` (che intercetta gli errori di tipo) prima del bundling. In questo progetto non c'è un test runner — consulta [Sviluppo](#sviluppo) per l'elenco completo dei comandi.

## Configurazione

Tutta la configurazione avviene in **Impostazioni** (`Ctrl/⌘ + K`) ed è persistente in `localStorage["polychat-settings"]`.

| Campo | Descrizione |
| --- | --- |
| **Chiave API** | La tua chiave OpenRouter. Memorizzata con offuscamento XOR in `localStorage` (vedi [Sicurezza](#security) qui sotto). |
| **Modello** | Modello predefinito caricato al primo avvio; può essere sovrascritto per finestra. |
| **Tema** | Chiaro / Scuro. |
| **Prompt di sistema** | Anteposto a ogni richiesta della sessione. |
| **Temperatura** | Temperatura di campionamento, `0.0` – `2.0`. |
| **Lunghezza massima** | Numero massimo di token per risposta (preset Corto → Molto lungo). |

> [!TIP]
> Al primo avvio viene mostrato uno stato vuoto in due passaggi: configura la tua chiave, poi scegli un modello. La modale delle impostazioni ti permette anche di aprire il pannello privacy per gestire il consenso in qualsiasi momento.

## Privacy & note legali

Questa è un'applicazione in lingua francese e rispetta le linee guida RGPD / CNIL fin dalla progettazione.

- **Cancello di consenso al primo avvio** — l'app si blocca finché non accetti la versione legale corrente. La versione è tracciata in `src/hooks/useLegal.ts` (`CURRENT_LEGAL_VERSION`); incrementala ogni volta che il testo legale cambia in modo significativo.
- **Google Fonts sono protette dal consenso** — *non* sono dichiarate in `index.css`. Vengono iniettate da `src/services/fontLoader.ts` solo dopo aver concesso `fontsConsent` nella modale della privacy. Lo script pre-paint in `index.html` legge `polychat-legal` per impostare `data-fonts` prima del primo paint, evitando così qualsiasi flash.
- **Nessun tracciamento, nessun cookie, nessun backend** — vengono utilizzate solo tre chiavi `localStorage`: `polychat-settings`, `polychat_history`, `polychat-legal`.
- **Esportazione dei dati** — `exportAllUserData()` in `src/services/dataExport.ts` raggruppa impostazioni, sessioni e consensi in un JSON scaricabile.
- **Cancellazione completa** — `clearAllUserData()` rimuove tutte e tre le chiavi. Accessibile dalla modale della privacy.
- **Documenti legali in-app** — Privacy, Termini, Cookie, informative IA e note legali sono renderizzati da `src/legal/documents.ts` e raggiungibili dal footer della barra laterale e dalle modali.

> [!IMPORTANT]
> La chiave `polychat-settings` contiene la tua chiave API OpenRouter, offuscata tramite XOR in `src/services/crypto.ts`. Si tratta di **offuscamento, non di crittografia** — la chiave e la funzione di offuscamento sono entrambe incluse nel bundle JS. Non fare affidamento su di essa contro un attaccante locale determinato. Il file `.env` nella root è un residuo e **non viene letto** dall'app; la modale delle impostazioni è l'unica fonte di verità per la chiave.

## Sviluppo

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

In questo repository **non c'è un test runner** — `vitest` e `jest` non sono installati. Considera `npm run build` come il via libera: se `tsc -b` passa, l'app è type-safe.

> [!NOTE]
> Il CSS scritto a mano in `src/index.css` (~71 KB) è l'unico livello di stile. I pacchetti `tailwindcss` e `@tailwindcss/postcss` elencati in `package.json` non sono utilizzati e non hanno alcuna configurazione PostCSS. Non introdurre Tailwind senza l'esplicita approvazione del proprietario.

### Struttura del progetto

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

## Risorse

- [Documentazione di OpenRouter](https://openrouter.ai/docs) — l'API con cui comunica PolyChat
- [Note di rilascio di React 19](https://react.dev/blog/2024/12/05/react-19) — funzionalità concorrenti usate per lo streaming
- [Guida Vite](https://vite.dev/guide/) — server di sviluppo e build
- [Middleware persist di Zustand](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — i tre archivi localStorage
- [CNIL — Guida RGPD per sviluppatori](https://www.cnil.fr/fr/developer-guide) — riferimento per la privacy by design

## Ottenere aiuto

- **FAQ in-app** — apri la barra laterale e cerca il link di aiuto; la modale FAQ ti porta a impostazioni, documenti legali e pannello privacy con un solo clic.
- **Segnalazioni di bug** — apri una issue sul repository con i passi per riprodurlo e l'output di `npm run build` e `npm run lint`.
- **Divulgazioni di sicurezza** — utilizza un canale privato anziché aprire una issue pubblica per qualsiasi cosa contrassegnata come sicurezza in [Privacy & note legali](#privacy--note-legali).

<div align="center">
<sub>Composto su carta digitale — serif Fraunces · grotesk IBM Plex · mono JetBrains</sub>
</div>
