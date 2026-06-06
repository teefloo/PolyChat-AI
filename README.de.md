<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**Ein Multi-Page-Chat-Studio für OpenRouter — vergleiche bis zu drei LLMs nebeneinander in einer einzigen Sitzung.**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[Übersicht](#uebersicht) ·
[Funktionen](#funktionen) ·
[Erste Schritte](#erste-schritte) ·
[Datenschutz & Rechtliches](#datenschutz--rechtliches) ·
[Entwicklung](#entwicklung) ·
[Ressourcen](#ressourcen)

</div>

<!-- README-I18N:START -->
[English](./README.md) · [Français](./README.fr.md) · [Español](./README.es.md) · **Deutsch** · [Italiano](./README.it.md) · [Português](./README.pt.md) · [汉语](./README.zh.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Русский](./README.ru.md)
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** Eine ruhige, editorische Oberfläche, um mehrere Sprachmodelle parallel zu befragen, ihre Stimmen zu vergleichen und die richtige Antwort zu formulieren.

PolyChat AI ist eine Single-Page-Webanwendung, die mit der [OpenRouter](https://openrouter.ai/)-API kommuniziert. Ihr Markenzeichen ist die **Multi-Page-Komposition**: Öffne bis zu drei Chat-Spalten nebeneinander in einer einzigen Sitzung, wähle in jeder ein anderes Modell und streame die Antworten parallel — perfekt für Benchmarking, iteratives Prompt-Tuning oder einfach, um eine zweite Meinung einzuholen.

Alles lebt in deinem Browser. Keine Konten, kein Server, keine Telemetrie: Sitzungen, Einstellungen und Einwilligungen werden in `localStorage` gespeichert, und dein API-Schlüssel verlässt das Gerät nie.

---

## Übersicht

| | |
| --- | --- |
| **Oberfläche** | Französischsprachige UI, editorisches Layout (Fraunces · IBM Plex · JetBrains Mono) |
| **Modelle** | Jedes von OpenRouter bereitgestellte Modell (GPT-4o, Claude 3.5, Gemini, Llama, Mistral…) |
| **Komposition** | 1, 2 oder 3 parallele Chat-Spalten pro Sitzung, Modell pro Spalte |
| **Streaming** | Live-Token-Streaming mit Stopp und Regeneration pro Fenster |
| **Markdown** | `react-markdown` + `remark-gfm` (Tabellen, Aufgabenlisten, Code-Blöcke) |
| **Theming** | Hell / Dunkel, sitzungsübergreifend gespeichert |
| **Speicher** | Nur `localStorage` — kein Backend, keine Cookies, keine Remote-DB |
| **Rechtliches** | RGPD/CNIL-Einwilligungs-Gate beim ersten Laden, französische Rechtstexte in der App |

## Funktionen

- **Multi-Page-Komposition** — öffne bis zu drei Chat-Spalten in einer einzigen Sitzung. Sende eine einzelne Nachricht an alle Spalten oder gezielt an das fokussierte Fenster.
- **Streaming mit Kontrolle** — Abbruch pro Fenster auf Basis von `AbortController`, generiere jede Assistenten-Nachricht mit einem Klick neu, halte alles auf einmal an.
- **Sitzungsverlauf** — Seitenleiste gruppiert nach *Aujourd'hui / Hier / date*, mit Inline-Suche, Umbenennen und Löschen. Leere Sitzungen werden automatisch entfernt.
- **Modellauswahl** — durchsuchbares Dropdown, live aus `/api/v1/models` bezogen. Pro Fenster einstellbar.
- **Generierungseinstellungen** — System-Prompt, Temperatur und max-tokens in den Einstellungen, gelten für jede Anfrage.
- **Markdown-Darstellung** — vollständiges GFM in den Assistenten-Nachrichten, inklusive Tabellen, Aufgabenlisten und Code-Blöcken.
- **Theme-Umschalter** — helle und dunkle Variante, gespeichert, das Pre-Paint-Skript in `index.html` vermeidet das Flackern beim Neuladen.
- **Tastaturfreundlich** — Focus-Traps in Modalen, `Esc` zum Schließen, `Tab`-Navigation, Skip-Link zum Hauptinhalt, ARIA-Rollen am Spaltenumschalter.
- **Datenhoheit** — exportiere alles (Einstellungen, Sitzungen, Einwilligungen) als einzelne JSON-Datei, oder lösche alle drei Speicher mit einem Klick.

## Erste Schritte

### Voraussetzungen

- [Node.js](https://nodejs.org) 20 oder neuer
- Einen [OpenRouter](https://openrouter.ai/)-API-Schlüssel (Pay-as-you-go, kostenloser Tarif verfügbar)

### Installieren und Starten

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

Der Dev-Server startet auf `http://localhost:5173`. Öffne die Seite, klicke im leeren Zustand auf **Configurer la clé**, füge deinen OpenRouter-Schlüssel ein, und du kannst loslegen.

### Bauen und Vorschau

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

Das `build`-Skript ist das Verifikations-Gate: Es führt `tsc -b` aus (das Typfehler abfängt), bevor gebündelt wird. Es gibt keinen Test-Runner in diesem Projekt — siehe [Entwicklung](#entwicklung) für die vollständige Befehlsliste.

## Konfiguration

Die gesamte Konfiguration erfolgt in den **Einstellungen** (`Ctrl/⌘ + K`) und wird in `localStorage["polychat-settings"]` gespeichert.

| Feld | Beschreibung |
| --- | --- |
| **Clé API** | Dein OpenRouter-Schlüssel. XOR-obfuskiert in `localStorage` gespeichert (siehe [Sicherheit](#security) unten). |
| **Modèle** | Standardmodell, das beim ersten Start geladen wird; kann pro Fenster überschrieben werden. |
| **Thème** | Clair / Sombre. |
| **Prompt système** | Wird jeder Anfrage in der Sitzung vorangestellt. |
| **Température** | Sampling-Temperatur, `0.0` – `2.0`. |
| **Longueur max** | Maximale Tokens pro Antwort (Voreinstellungen Court → Très long). |

> [!TIP]
> Beim allerersten Start zeigt die App einen zweistufigen leeren Zustand: Konfiguriere zuerst deinen Schlüssel, wähle dann ein Modell. Über das Einstellungs-Modal kannst du jederzeit das Datenschutz-Panel öffnen, um deine Einwilligungen zu verwalten.

## Datenschutz & Rechtliches

Dies ist eine französischsprachige Anwendung, die RGPD- / CNIL-Richtlinien bereits im Design respektiert.

- **Einwilligungs-Gate beim ersten Laden** — die App blockiert, bis du die aktuelle Rechtsversion akzeptierst. Die Version wird in `src/hooks/useLegal.ts` (`CURRENT_LEGAL_VERSION`) verwaltet; erhöhe sie, sobald sich die Rechtstexte wesentlich ändern.
- **Google Fonts sind einwilligungspflichtig** — sie sind *nicht* in `index.css` deklariert. Sie werden von `src/services/fontLoader.ts` erst eingebunden, nachdem du im Datenschutz-Modal `fontsConsent` erteilt hast. Das Pre-Paint-Skript in `index.html` liest `polychat-legal`, um `data-fonts` vor dem ersten Rendern zu setzen — kein Flackern.
- **Kein Tracking, keine Cookies, kein Backend** — es werden nur drei `localStorage`-Schlüssel verwendet: `polychat-settings`, `polychat_history`, `polychat-legal`.
- **Datenexport** — `exportAllUserData()` in `src/services/dataExport.ts` bündelt Einstellungen, Sitzungen und Einwilligungen in einer herunterladbaren JSON-Datei.
- **Vollständige Löschung** — `clearAllUserData()` entfernt alle drei Schlüssel. Erreichbar über das Datenschutz-Modal.
- **In-App-Rechtstexte** — Datenschutz, AGB, Cookies, KI-Hinweise und Impressum werden aus `src/legal/documents.ts` gerendert und sind über die Footer-Leiste der Seitenleiste und die Modale erreichbar.

> [!IMPORTANT]
> Der Schlüssel `polychat-settings` enthält deinen OpenRouter-API-Schlüssel, der mittels `src/services/crypto.ts` XOR-obfuskiert ist. Dies ist **Verschleierung, keine Verschlüsselung** — der Schlüssel und die Verschleierungsfunktion werden beide im JS-Bundle ausgeliefert. Verlasse dich nicht darauf gegenüber einem entschlossenen lokalen Angreifer. Die `.env`-Datei im Stammverzeichnis ist ein Überbleibsel und wird **nicht** von der App gelesen; das Einstellungs-Modal ist die einzige Quelle der Wahrheit für den Schlüssel.

## Entwicklung

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

Es gibt **keinen Test-Runner** in diesem Repository — `vitest` und `jest` sind nicht installiert. Betrachte `npm run build` als das Go-Signal: Wenn `tsc -b` durchläuft, ist die App typsicher.

> [!NOTE]
> Das handgeschriebene CSS in `src/index.css` (~71 KB) ist die einzige Styling-Ebene. Die in `package.json` aufgeführten Pakete `tailwindcss` und `@tailwindcss/postcss` werden nicht verwendet und besitzen keine PostCSS-Konfiguration. Führe Tailwind nicht ohne ausdrückliche Genehmigung des Eigentümers ein.

### Projektstruktur

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

## Ressourcen

- [OpenRouter-Dokumentation](https://openrouter.ai/docs) — die API, mit der PolyChat spricht
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19) — Concurrent Features, die für das Streaming genutzt werden
- [Vite-Handbuch](https://vite.dev/guide/) — Dev-Server und Build
- [Zustand-Persist-Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — die drei localStorage-Speicher
- [CNIL — RGPD-Entwicklerhandbuch](https://www.cnil.fr/fr/developer-guide) — Privacy-by-Design-Referenz

## Hilfe erhalten

- **In-App-FAQ** — öffne die Seitenleiste und suche den Hilfe-Link; das FAQ-Modal führt mit einem Klick zu den Einstellungen, den Rechtsdokumenten und dem Datenschutz-Panel.
- **Fehlerberichte** — öffne ein Issue im Repository mit Reproduktionsschritten und der Ausgabe von `npm run build` und `npm run lint`.
- **Sicherheitsmeldungen** — bitte nutze einen privaten Kanal, anstatt ein öffentliches Issue zu eröffnen, für alles, was in [Datenschutz & Rechtliches](#datenschutz--rechtliches) als Sicherheit markiert ist.

<div align="center">
<sub>Gesetzt auf digitalem Papier — Serif Fraunces · serifenlos IBM Plex · Mono JetBrains</sub>
</div>
