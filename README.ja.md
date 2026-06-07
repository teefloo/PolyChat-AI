<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**OpenRouter 向けのマルチページチャットスタジオ — 1 つのセッション内で最大 3 つの LLM を並べて比較できます。**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[概要](#概要) ·
[機能](#機能) ·
[はじめに](#はじめに) ·
[プライバシーと規約](#プライバシーと規約) ·
[開発](#開発) ·
[リソース](#リソース)

</div>

<!-- README-I18N:START -->
[English](./README.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Deutsch](./README.de.md) · [Italiano](./README.it.md) · [Português](./README.pt.md) · [汉语](./README.zh.md) · **日本語** · [한국어](./README.ko.md) · [Русский](./README.ru.md)
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** 複数の言語モデルを並列で問いかけ、その声質を比較し、最良の回答を組み立てるための静かでエディトリアルなインターフェースです。

PolyChat AI は [OpenRouter](https://openrouter.ai/) API と通信するシングルページ Web アプリケーションです。その最大の特徴は **マルチページ構成** で、1 つのセッション内に最大 3 つのチャット列を並べて開けます。それぞれに異なるモデルを選んで回答を並列にストリーミングでき、ベンチマーク、プロンプトの反復、あるいは単に別の意見を得るために最適です。

すべてはブラウザ内に保持されます。アカウントも、サーバーも、テレメトリも存在しません。セッション、設定、同意情報は `localStorage` に保存され、API キーが端末の外に送信されることはありません。

---

## 概要

| | |
| --- | --- |
| **インターフェース** | フランス語 UI、エディトリアルなレイアウト (Fraunces · IBM Plex · JetBrains Mono) |
| **モデル** | OpenRouter が公開するあらゆるモデル (GPT-4o、Claude 3.5、Gemini、Llama、Mistral…) |
| **構成** | 1 セッションあたり 1、2、3 の並列チャット列、列ごとにモデルを指定 |
| **ストリーミング** | ウィンドウごとに停止・再生成可能なライブトークンストリーミング |
| **Markdown** | `react-markdown` + `remark-gfm` (表、タスクリスト、コードブロック) |
| **テーマ** | ライト / ダーク、セッションをまたいで永続化 |
| **ストレージ** | `localStorage` のみ — バックエンドなし、Cookie なし、リモート DB なし |
| **規約** | 初回起動時の RGPD/CNIL 同意ゲート、アプリ内のフランス語規約文書 |

## 機能

- **マルチページ構成** — 1 つのセッション内で最大 3 つのチャット列を開けます。1 つのメッセージをすべての列にブロードキャストしたり、フォーカス中のウィンドウにだけ送信したりできます。
- **制御可能なストリーミング** — `AbortController` ベースのウィンドウ単位キャンセル、ワンクリックでアシスタントの回答を再生成、すべてを一度に停止できます。
- **セッション履歴** — サイドバーは *今日 / 昨日 / 日付* でグループ化され、インライン検索、名前変更、削除が可能です。空のセッションは自動的に整理されます。
- **モデル選択** — `/api/v1/models` からライブで取得される検索可能なドロップダウン。ウィンドウごとに設定可能です。
- **生成コントロール** — 設定でシステムプロンプト、温度、最大トークン数を指定でき、すべてのリクエストに適用されます。
- **Markdown レンダリング** — アシスタントの回答に GFM の全機能をサポート（表、タスクリスト、コードフェンスを含む）。
- **テーマ切替** — ライトとダークのバリアントを永続化。`index.html` の事前描画スクリプトにより再読み込み時のフラッシュを防止します。
- **キーボード操作** — モーダル内のフォーカストラップ、`Esc` で閉じる、`Tab` サイクル、メインコンテンツへのスキップリンク、列スイッチャーの ARIA ロール。
- **データの主権** — 設定、セッション、同意情報を 1 つの JSON ファイルとして書き出せます。あるいはワンクリックで 3 つのストアをすべて消去できます。

## はじめに

### 前提条件

- [Node.js](https://nodejs.org) 20 以降
- [OpenRouter](https://openrouter.ai/) の API キー（従量課金、無料枠あり）

### インストールと実行

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

開発サーバーは `http://localhost:5173` で起動します。アクセスして、空の状態の **キーを設定** をクリックし、OpenRouter のキーを貼り付ければ準備完了です。

### ビルドとプレビュー

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

`build` スクリプトは検証ゲートとして機能します。`tsc -b` を実行して型エラーを検出してからバンドルします。このプロジェクトにはテストランナーはありません — すべてのコマンド一覧は [開発](#開発) を参照してください。

## 設定

すべての設定は **設定** （`Ctrl/⌘ + K`）で行い、`localStorage["polychat-settings"]` に永続化されます。

| 項目 | 説明 |
| --- | --- |
| **API キー** | OpenRouter のキー。XOR で難読化した状態で `localStorage` に保存されます（後述の [セキュリティ](#security) を参照）。 |
| **モデル** | 初回起動時に読み込まれるデフォルトモデル。ウィンドウごとに上書き可能です。 |
| **テーマ** | ライト / ダーク。 |
| **システムプロンプト** | セッション内のすべてのリクエストの前に付加されます。 |
| **温度** | サンプリング温度、`0.0` – `2.0`。 |
| **最大長** | レスポンスごとの最大トークン数（短め → 非常に長めのプリセット）。 |

> [!TIP]
> 初回起動時には 2 段階の空の状態が表示されます。まずキーを設定し、次にモデルを選択してください。設定モーダルからは、同意情報を管理するためのプライバシーパネルにもいつでもアクセスできます。

## プライバシーと規約

本アプリケーションはフランス語版で、設計段階から RGPD / CNIL のガイドラインに準拠しています。

- **初回起動時の同意ゲート** — 現在の規約バージョンに同意するまでアプリはブロックされます。バージョンは `src/hooks/useLegal.ts` の `CURRENT_LEGAL_VERSION` で管理されています。規約文書を意味のある形で変更した際はこの値を更新してください。
- **Google Fonts は同意後に読み込まれます** — `index.css` には宣言されていません。`src/services/fontLoader.ts` が、プライバシーモーダルで `fontsConsent` を許可したあとにのみフォントを注入します。`index.html` の事前描画スクリプトが `polychat-legal` を読み取って初回描画前に `data-fonts` を設定するため、フラッシュは発生しません。
- **トラッキングなし、Cookie なし、バックエンドなし** — 使用される `localStorage` キーは 3 つのみ：`polychat-settings`、`polychat_history`、`polychat-legal`。
- **データ書き出し** — `src/services/dataExport.ts` の `exportAllUserData()` が、設定、セッション、同意情報を 1 つの JSON にまとめてダウンロード可能にします。
- **全消去** — `clearAllUserData()` は 3 つのキーをすべて削除します。プライバシーモーダルから実行できます。
- **アプリ内規約文書** — プライバシー、利用規約、Cookie、AI 通知、法的事項は `src/legal/documents.ts` からレンダリングされ、サイドバーのフッターとモーダルからアクセスできます。

> [!IMPORTANT]
> `polychat-settings` キーには、`src/services/crypto.ts` を介して XOR 難読化された OpenRouter の API キーが保存されます。これは **暗号化ではなく難読化** です。キーと難読化関数の両方が JS バンドルに含まれています。ローカルからの執拗な攻撃を防ぐ目的では使用しないでください。ルートの `.env` ファイルは残骸であり、アプリからは **読み取られません**。設定モーダルがキーの唯一の信頼できる情報源です。

## 開発

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

このリポジトリには **テストランナーは導入されていません** — `vitest` と `jest` はインストールされていません。`npm run build` を合格の証として扱ってください。`tsc -b` が通れば、アプリは型安全です。

> [!NOTE]
> `src/index.css` の手書き CSS（~71 KB）が唯一のスタイリング層です。`package.json` に記載されている `tailwindcss` と `@tailwindcss/postcss` は使用されておらず、PostCSS 設定もありません。所有者の明示的な承認なしに Tailwind を導入しないでください。

### プロジェクト構成

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

## リソース

- [OpenRouter ドキュメント](https://openrouter.ai/docs) — PolyChat が通信する API
- [React 19 リリースノート](https://react.dev/blog/2024/12/05/react-19) — ストリーミングに使用されているコンカレント機能
- [Vite ガイド](https://vite.dev/guide/) — 開発サーバーとビルド
- [Zustand persist ミドルウェア](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — 3 つの localStorage ストア
- [CNIL — RGPD 開発者ガイド](https://www.cnil.fr/fr/developer-guide) — プライバシー・バイ・デザインの参考資料

## ヘルプ

- **アプリ内 FAQ** — サイドバーを開いてヘルプリンクを探してください。FAQ モーダルから、設定、規約文書、プライバシーパネルへワンクリックで移動できます。
- **バグ報告** — リポジトリに Issue を作成し、再現手順と `npm run build` および `npm run lint` の出力を記載してください。
- **セキュリティ開示** — [プライバシーと規約](#プライバシーと規約) 内でセキュリティに関連する項目については、公開 Issue ではなく非公開チャンネルをご利用ください。

<div align="center">
<sub>デジタル用紙に組まれた — セリフ Fraunces · グロテスク IBM Plex · モノスペース JetBrains</sub>
</div>
