<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**Un studio de chat multi-pages pour OpenRouter — comparez jusqu'à trois LLM côte à côte, dans une seule session.**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[Aperçu](#apercu) ·
[Fonctionnalités](#fonctionnalites) ·
[Premiers pas](#premiers-pas) ·
[Confidentialité & mentions légales](#confidentialite--mentions-legales) ·
[Développement](#developpement) ·
[Ressources](#ressources)

</div>

<!-- README-I18N:START -->
[English](./README.md) · **Français** · [Español](./README.es.md) · [Deutsch](./README.de.md) · [Italiano](./README.it.md) · [Português](./README.pt.md) · [汉语](./README.zh.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Русский](./README.ru.md)
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** Une interface sobre et éditoriale pour interroger plusieurs modèles de langage en parallèle, comparer leurs voix et composer la bonne réponse.

PolyChat AI est une application web monopage qui communique avec l'API [OpenRouter](https://openrouter.ai/). Sa fonctionnalité signature est la **composition multi-pages** : ouvrez jusqu'à trois colonnes de discussion côte à côte dans une même session, choisissez un modèle différent dans chacune, et diffusez leurs réponses en parallèle — idéal pour évaluer, itérer sur vos prompts, ou simplement obtenir un second avis.

Tout vit dans votre navigateur. Aucun compte, aucun serveur, aucune télémétrie : les sessions, les paramètres et les consentements sont stockés dans `localStorage`, et votre clé API ne quitte jamais l'appareil.

---

## Aperçu

| | |
| --- | --- |
| **Interface** | Interface en français, mise en page éditoriale (Fraunces · IBM Plex · JetBrains Mono) |
| **Modèles** | Tout modèle exposé par OpenRouter (GPT-4o, Claude 3.5, Gemini, Llama, Mistral…) |
| **Composition** | 1, 2 ou 3 colonnes de discussion parallèles par session, un modèle par colonne |
| **Streaming** | Streaming de tokens en direct avec arrêt et régénération par fenêtre |
| **Markdown** | `react-markdown` + `remark-gfm` (tableaux, listes de tâches, blocs de code) |
| **Thème** | Clair / Sombre, persisté entre les sessions |
| **Stockage** | `localStorage` uniquement — pas de backend, pas de cookies, pas de BDD distante |
| **Mentions légales** | Porte de consentement RGPD/CNIL au premier chargement, documents légaux en français dans l'app |

## Fonctionnalités

- **Composition multi-pages** — ouvrez jusqu'à trois colonnes de discussion dans une même session. Diffusez un seul message vers toutes les colonnes, ou envoyez un message ciblé à la fenêtre active.
- **Streaming maîtrisé** — annulation par fenêtre basée sur `AbortController`, régénérez n'importe quel message de l'assistant en un clic, arrêtez tout d'un coup.
- **Historique des sessions** — barre latérale groupée par *Aujourd'hui / Hier / date*, avec recherche inline, renommage et suppression. Les sessions vides sont élaguées automatiquement.
- **Sélecteur de modèle** — liste déroulante avec recherche, alimentée en direct par `/api/v1/models`. Défini par fenêtre.
- **Contrôles de génération** — prompt système, température et tokens maximum dans les Paramètres, appliqués à chaque requête.
- **Rendu Markdown** — GFM complet dans les messages de l'assistant, avec tableaux, listes de tâches et blocs de code.
- **Bascule de thème** — variantes claire et sombre, persistées, script de pré-peinture dans `index.html` qui évite le flash au rechargement.
- **Accessible au clavier** — pièges de focus dans les modales, `Esc` pour fermer, navigation `Tab`, lien d'accès au contenu principal, rôles ARIA sur le sélecteur de colonne.
- **Souveraineté des données** — exportez tout (paramètres, sessions, consentements) dans un seul fichier JSON, ou effacez les trois stores en un clic.

## Premiers pas

### Prérequis

- [Node.js](https://nodejs.org) 20 ou plus récent
- Une clé API [OpenRouter](https://openrouter.ai/) (paiement à l'usage, offre gratuite disponible)

### Installation et lancement

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

Le serveur de développement démarre sur `http://localhost:5173`. Ouvrez-le, cliquez sur **Configurer la clé** dans l'état vide, collez votre clé OpenRouter, et c'est parti.

### Construire et prévisualiser

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

Le script `build` est la porte de validation : il exécute `tsc -b` (qui détecte les erreurs de typage) avant le bundling. Il n'y a aucun test runner dans ce projet — voir [Développement](#developpement) pour la liste complète des commandes.

## Configuration

Toute la configuration se fait dans **Paramètres** (`Ctrl/⌘ + K`) et est persistée dans `localStorage["polychat-settings"]`.

| Champ | Description |
| --- | --- |
| **Clé API** | Votre clé OpenRouter. Stockée obfusquée par XOR dans `localStorage` (voir [Sécurité](#security) ci-dessous). |
| **Modèle** | Modèle par défaut chargé au premier lancement ; peut être remplacé par fenêtre. |
| **Thème** | Clair / Sombre. |
| **Prompt système** | Préfixé à chaque requête de la session. |
| **Température** | Température d'échantillonnage, `0.0` – `2.0`. |
| **Longueur max** | Tokens maximum par réponse (préréglages Court → Très long). |

> [!TIP]
> Tout premier lancement affiche un état vide en deux étapes : configurez votre clé, puis choisissez un modèle. La modale des paramètres permet aussi d'ouvrir le panneau de confidentialité pour gérer les consentements à tout moment.

## Confidentialité & mentions légales

C'est une application en langue française qui respecte les lignes directrices RGPD / CNIL par conception.

- **Porte de consentement au premier chargement** — l'application reste bloquée tant que vous n'acceptez pas la version légale en cours. La version est suivie dans `src/hooks/useLegal.ts` (`CURRENT_LEGAL_VERSION`) ; incrémentez-la dès que le texte légal change de manière significative.
- **Google Fonts sont soumises à consentement** — elles ne sont *pas* déclarées dans `index.css`. Elles sont injectées par `src/services/fontLoader.ts` uniquement après que vous avez accordé `fontsConsent` dans la modale de confidentialité. Le script de pré-peinture dans `index.html` lit `polychat-legal` pour définir `data-fonts` avant la première peinture, il n'y a donc aucun flash.
- **Aucun pistage, aucun cookie, aucun backend** — seules trois clés `localStorage` sont utilisées : `polychat-settings`, `polychat_history`, `polychat-legal`.
- **Export des données** — `exportAllUserData()` dans `src/services/dataExport.ts` regroupe paramètres, sessions et consentements dans un JSON téléchargeable.
- **Effacement total** — `clearAllUserData()` supprime les trois clés. Accessible depuis la modale de confidentialité.
- **Documents légaux dans l'app** — Confidentialité, Conditions, Cookies, mentions IA, Mentions légales sont rendus depuis `src/legal/documents.ts` et accessibles depuis le pied de la barre latérale et les modales.

> [!IMPORTANT]
> La clé `polychat-settings` contient votre clé API OpenRouter obfusquée par XOR via `src/services/crypto.ts`. C'est une **obfuscation, pas un chiffrement** — la clé et la fonction d'obfuscation sont livrées ensemble dans le bundle JS. Ne comptez pas dessus face à un attaquant local déterminé. Le fichier `.env` à la racine est un vestige et **n'est pas lu** par l'application ; la modale des paramètres est l'unique source de vérité pour la clé.

## Développement

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

Il n'y a **aucun test runner** dans ce dépôt — `vitest` et `jest` ne sont pas installés. Considérez `npm run build` comme le feu vert : si `tsc -b` passe, l'application est type-safe.

> [!NOTE]
> Le CSS écrit à la main dans `src/index.css` (~71 KB) est l'unique couche de style. Les paquets `tailwindcss` et `@tailwindcss/postcss` listés dans `package.json` ne sont pas utilisés et n'ont aucune configuration PostCSS. N'introduisez pas Tailwind sans approbation explicite du propriétaire.

### Structure du projet

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

## Ressources

- [Documentation OpenRouter](https://openrouter.ai/docs) — l'API à laquelle PolyChat se connecte
- [Notes de version de React 19](https://react.dev/blog/2024/12/05/react-19) — fonctionnalités concurrentes utilisées pour le streaming
- [Guide Vite](https://vite.dev/guide/) — serveur de développement et build
- [Middleware persist de Zustand](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — les trois stores `localStorage`
- [CNIL — Guide RGPD développeurs](https://www.cnil.fr/fr/developer-guide) — référence privacy-by-design

## Obtenir de l'aide

- **FAQ intégrée** — ouvrez la barre latérale et cherchez le lien d'aide ; la modale FAQ redirige vers les paramètres, les documents légaux et le panneau de confidentialité en un clic.
- **Rapports de bugs** — ouvrez un ticket sur le dépôt avec les étapes de reproduction et la sortie de `npm run build` et `npm run lint`.
- **Divulgations de sécurité** — veuillez utiliser un canal privé plutôt que de déposer un ticket public pour tout ce qui est marqué sécurité dans [Confidentialité & mentions légales](#confidentialite--mentions-legales).

<div align="center">
<sub>Composé sur papier numérique — sérif Fraunces · grotesk IBM Plex · mono JetBrains</sub>
</div>
