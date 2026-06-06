<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**Un estudio de chat multipágina para OpenRouter — compara hasta tres LLM en paralelo, en una sola sesión.**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[Resumen](#resumen) ·
[Características](#caracteristicas) ·
[Primeros pasos](#primeros-pasos) ·
[Privacidad y legal](#privacidad-y-legal) ·
[Desarrollo](#desarrollo) ·
[Recursos](#recursos)

</div>

<!-- README-I18N:START -->
[English](./README.md) · [Français](./README.fr.md) · **Español** · [Deutsch](./README.de.md) · [Italiano](./README.it.md) · [Português](./README.pt.md) · [汉语](./README.zh.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Русский](./README.ru.md)
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** Una interfaz sobria y editorial para interrogar varios modelos de lenguaje en paralelo, comparar sus voces y componer la respuesta adecuada.

PolyChat AI es una aplicación web de una sola página que se comunica con la API de [OpenRouter](https://openrouter.ai/). Su seña de identidad es la **composición multipágina**: abre hasta tres columnas de chat en paralelo dentro de una misma sesión, elige un modelo distinto en cada una y transmite sus respuestas en streaming — perfecto para comparar, iterar sobre prompts o, sencillamente, obtener una segunda opinión.

Todo se queda en tu navegador. Sin cuentas, sin servidor, sin telemetría: las sesiones, los ajustes y el consentimiento se guardan en `localStorage`, y tu clave API nunca sale del dispositivo.

---

## Resumen

| | |
| --- | --- |
| **Interfaz** | UI en francés, maquetación editorial (Fraunces · IBM Plex · JetBrains Mono) |
| **Modelos** | Cualquier modelo expuesto por OpenRouter (GPT-4o, Claude 3.5, Gemini, Llama, Mistral…) |
| **Composición** | 1, 2 o 3 columnas de chat en paralelo por sesión, un modelo por columna |
| **Streaming** | Streaming de tokens en directo con parada y regeneración por ventana |
| **Markdown** | `react-markdown` + `remark-gfm` (tablas, listas de tareas, bloques de código) |
| **Tema** | Claro / Oscuro, persistente entre sesiones |
| **Almacenamiento** | Solo `localStorage` — sin backend, sin cookies, sin base de datos remota |
| **Legal** | Pasarela de consentimiento RGPD/CNIL en la primera carga, documentos legales en francés en la app |

## Características

- **Composición multipágina** — abre hasta tres columnas de chat dentro de una misma sesión. Difunde un mismo mensaje a todas las columnas o envía uno dirigido a la ventana enfocada.
- **Streaming con control** — cancelación por ventana basada en `AbortController`, regenera cualquier mensaje del asistente con un solo clic, detén todo a la vez.
- **Historial de sesiones** — barra lateral agrupada por *Aujourd'hui / Hier / date*, con búsqueda, renombrado y borrado en línea. Las sesiones vacías se eliminan automáticamente.
- **Selector de modelo** — desplegable con búsqueda servido en directo desde `/api/v1/models`. Configurable por ventana.
- **Controles de generación** — prompt del sistema, temperatura y max-tokens en Ajustes, aplicados a cada petición.
- **Renderizado Markdown** — GFM completo en los mensajes del asistente, incluyendo tablas, listas de tareas y bloques de código.
- **Cambio de tema** — variantes clara y oscura, persistentes; un script de pre-paint en `index.html` evita el parpadeo al recargar.
- **Accesos por teclado** — trampas de foco en los modales, `Esc` para cerrar, ciclo con `Tab`, enlace de salto al contenido principal, roles ARIA en el conmutador de columnas.
- **Soberanía de datos** — exporta todo (ajustes, sesiones, consentimiento) en un único archivo JSON o borra los tres almacenes con un solo clic.

## Primeros pasos

### Requisitos previos

- [Node.js](https://nodejs.org) 20 o superior
- Una clave API de [OpenRouter](https://openrouter.ai/) (pago por uso, con plan gratuito disponible)

### Instalar y ejecutar

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

El servidor de desarrollo arranca en `http://localhost:5173`. Ábrelo, pulsa **Configurer la clé** en el estado vacío, pega tu clave de OpenRouter y listo.

### Compilar y previsualizar

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

El script `build` es la puerta de verificación: ejecuta `tsc -b` (que detecta los errores de tipo) antes de empaquetar. Este proyecto no tiene test runner — consulta [Desarrollo](#desarrollo) para ver la lista completa de comandos.

## Configuración

Toda la configuración se realiza en **Ajustes** (`Ctrl/⌘ + K`) y se persiste en `localStorage["polychat-settings"]`.

| Campo | Descripción |
| --- | --- |
| **Clé API** | Tu clave de OpenRouter. Se guarda ofuscada con XOR en `localStorage` (ver [Seguridad](#security) más abajo). |
| **Modèle** | Modelo por defecto cargado en el primer arranque; se puede sobreescribir por ventana. |
| **Thème** | Clair / Sombre. |
| **Prompt système** | Se antepone a cada petición de la sesión. |
| **Température** | Temperatura de muestreo, `0.0` – `2.0`. |
| **Longueur max** | Máximo de tokens por respuesta (preajustes Court → Très long). |

> [!TIP]
> El primer arranque muestra un estado vacío en dos pasos: configura tu clave y luego elige un modelo. El modal de ajustes también permite abrir el panel de privacidad para gestionar el consentimiento en cualquier momento.

## Privacidad y legal

Esta es una aplicación en francés y respeta por diseño las directrices del RGPD / CNIL.

- **Pasarela de consentimiento en el primer arranque** — la aplicación se bloquea hasta que aceptes la versión legal vigente. La versión se rastrea en `src/hooks/useLegal.ts` (`CURRENT_LEGAL_VERSION`); auméntala cada vez que el texto legal cambie de forma significativa.
- **Google Fonts requiere consentimiento** — *no* se declaran en `index.css`. Se inyectan desde `src/services/fontLoader.ts` solo después de conceder `fontsConsent` en el modal de privacidad. El script de pre-paint de `index.html` lee `polychat-legal` para fijar `data-fonts` antes del primer pintado, de modo que no hay parpadeo.
- **Sin rastreo, sin cookies, sin backend** — solo se usan tres claves en `localStorage`: `polychat-settings`, `polychat_history`, `polychat-legal`.
- **Exportación de datos** — `exportAllUserData()` en `src/services/dataExport.ts` agrupa ajustes, sesiones y consentimiento en un JSON descargable.
- **Borrado total** — `clearAllUserData()` elimina las tres claves. Accesible desde el modal de privacidad.
- **Documentos legales en la app** — Privacidad, Condiciones, Cookies, avisos de IA y menciones legales se renderizan desde `src/legal/documents.ts` y se pueden abrir desde el pie de la barra lateral y los modales.

> [!IMPORTANT]
> La clave `polychat-settings` almacena tu clave de la API de OpenRouter ofuscada mediante XOR en `src/services/crypto.ts`. Esto es **ofuscación, no cifrado** — la clave y la función de ofuscación están incluidas en el bundle JS. No confíes en ella frente a un atacante local decidido. El archivo `.env` de la raíz es un residuo y la aplicación **no lo lee**; el modal de ajustes es la única fuente de verdad para la clave.

## Desarrollo

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

En este repositorio **no hay test runner** — `vitest` y `jest` no están instalados. Considera `npm run build` como la luz verde: si `tsc -b` pasa, la aplicación es type-safe.

> [!NOTE]
> El CSS escrito a mano en `src/index.css` (~71 KB) es la única capa de estilos. Los paquetes `tailwindcss` y `@tailwindcss/postcss` que aparecen en `package.json` no se usan y no tienen ninguna configuración de PostCSS. No introduzcas Tailwind sin la aprobación explícita del propietario.

### Estructura del proyecto

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

- [Documentación de OpenRouter](https://openrouter.ai/docs) — la API con la que habla PolyChat
- [Notas de la versión React 19](https://react.dev/blog/2024/12/05/react-19) — funcionalidades concurrentes usadas para el streaming
- [Guía de Vite](https://vite.dev/guide/) — servidor de desarrollo y compilación
- [Middleware persist de Zustand](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — los tres almacenes en localStorage
- [CNIL — Guía RGPD para desarrolladores](https://www.cnil.fr/fr/developer-guide) — referencia de privacidad desde el diseño

## Obtener ayuda

- **FAQ en la app** — abre la barra lateral y busca el enlace de ayuda; el modal de FAQ lleva a los ajustes, los documentos legales y el panel de privacidad con un solo clic.
- **Informes de errores** — abre una incidencia en el repositorio con los pasos para reproducirla y la salida de `npm run build` y `npm run lint`.
- **Divulgaciones de seguridad** — usa un canal privado en lugar de abrir una incidencia pública para todo lo marcado como seguridad en [Privacidad y legal](#privacidad-y-legal).

<div align="center">
<sub>Compuesto en papel digital — serifa Fraunces · palo seco IBM Plex · monoespaciada JetBrains</sub>
</div>
