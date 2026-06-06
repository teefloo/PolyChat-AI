<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**一个面向 OpenRouter 的多页面聊天工作室 —— 在同一个会话中并排对比最多三个大语言模型。**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[概述](#概述) ·
[功能](#功能) ·
[开始使用](#开始使用) ·
[隐私与法律](#隐私与法律) ·
[开发](#开发) ·
[资源](#资源)

</div>

<!-- README-I18N:START -->
[English](./README.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Deutsch](./README.de.md) · [Italiano](./README.it.md) · [Português](./README.pt.md) · **汉语** · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Русский](./README.ru.md)
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** 一个安静、编辑式风格的界面，用于并行审视多个语言模型，比较它们的语气，并打磨出最合适的答案。

PolyChat AI 是一个与 [OpenRouter](https://openrouter.ai/) API 对话的单页 Web 应用。它的招牌功能是**多页面组合**：在同一个会话内并排开启最多三个聊天列，每列可选不同模型，并行流式接收回复——非常适合基准测试、提示词迭代，或者只是想要一个"第二意见"。

一切都在浏览器中完成。无账号、无服务器、无遥测：会话、设置和同意记录都存储在 `localStorage`，你的 API 密钥从不出本机。

---

## 概述

| | |
| --- | --- |
| **界面** | 法语界面，编辑式排版（Fraunces · IBM Plex · JetBrains Mono） |
| **模型** | OpenRouter 提供的任意模型（GPT-4o、Claude 3.5、Gemini、Llama、Mistral…） |
| **组合** | 每个会话可启用 1、2 或 3 个并行的聊天列，每列可独立选择模型 |
| **流式输出** | 实时 token 流式输出，每个窗口可独立停止与重新生成 |
| **Markdown** | `react-markdown` + `remark-gfm`（表格、任务列表、代码块） |
| **主题** | 浅色 / 深色，会话间持久化 |
| **存储** | 仅 `localStorage` —— 无后端、无 Cookie、无远端数据库 |
| **法律** | 首次加载时 RGPD/CNIL 同意闸门，应用内提供法语法律文档 |

## 功能

- **多页面组合** —— 在同一个会话内并排开启最多三个聊天列。可将一条消息广播至所有列，也可只发给当前聚焦的窗口。
- **可控的流式输出** —— 基于 `AbortController` 的逐窗口取消机制，一键重新生成任意助手回复，并可一次性停止所有流。
- **会话历史** —— 侧边栏按 *Aujourd'hui / Hier / 日期* 分组，支持内联搜索、重命名与删除。空会话会被自动清理。
- **模型选择器** —— 从 `/api/v1/models` 实时拉取的可搜索下拉，按窗口设置。
- **生成参数** —— 在 Settings 中设置系统提示词、温度与最大 token 数，对所有请求生效。
- **Markdown 渲染** —— 助手消息中支持完整 GFM，包括表格、任务列表与代码块。
- **主题切换** —— 浅色与深色两套主题，状态持久化；`index.html` 中的预绘制脚本避免了刷新时的闪烁。
- **键盘友好** —— 模态框内含焦点陷阱，`Esc` 关闭，`Tab` 循环，主内容可跳转链接，列切换器带 ARIA 角色。
- **数据主权** —— 一键将全部数据（设置、会话、同意记录）导出为单个 JSON 文件，或一键擦除全部三个存储。

## 开始使用

### 前置条件

- [Node.js](https://nodejs.org) 20 或更高版本
- 一个 [OpenRouter](https://openrouter.ai/) API 密钥（即用即付，提供免费额度）

### 安装与运行

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

开发服务器在 `http://localhost:5173` 启动。打开后，在空状态中点击 **Configurer la clé**，粘贴你的 OpenRouter 密钥即可开始使用。

### 构建与预览

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

`build` 脚本就是验证关卡：它会先运行 `tsc -b`（捕获类型错误），再进行打包。本项目没有测试运行器——完整命令列表请参见 [开发](#开发)。

## 配置

所有配置均在 **Settings**（`Ctrl/⌘ + K`）中完成，并持久化到 `localStorage["polychat-settings"]`。

| 字段 | 说明 |
| --- | --- |
| **Clé API** | 你的 OpenRouter 密钥。以 XOR 混淆形式存储于 `localStorage`（参见下方 [安全](#security)）。 |
| **Modèle** | 首次运行时加载的默认模型，可在每个窗口中单独覆盖。 |
| **Thème** | Clair / Sombre。 |
| **Prompt système** | 会被前置添加到该会话的每一次请求中。 |
| **Température** | 采样温度，范围 `0.0` – `2.0`。 |
| **Longueur max** | 每次回复的最大 token 数（Court → Très long 预设）。 |

> [!TIP]
> 首次启动时会看到一个两步式的空状态：先配置密钥，再选择模型。设置模态框中也可以随时打开隐私面板管理同意选项。

## 隐私与法律

这是一款法语应用，从设计上就遵循 RGPD / CNIL 准则。

- **首次加载同意闸门** —— 在你接受当前法律版本之前，应用会一直处于阻塞状态。版本号记录在 `src/hooks/useLegal.ts`（`CURRENT_LEGAL_VERSION`）；每当法律文本发生实质性变更时，应同步更新它。
- **Google Fonts 受同意门控** —— 它们**不**在 `index.css` 中声明。只有在隐私模态框中授予 `fontsConsent` 之后，`src/services/fontLoader.ts` 才会注入它们。`index.html` 中的预绘制脚本会读取 `polychat-legal` 并在首次绘制前设置 `data-fonts`，因此不会出现闪烁。
- **无跟踪、无 Cookie、无后端** —— 仅使用三个 `localStorage` 键：`polychat-settings`、`polychat_history`、`polychat-legal`。
- **数据导出** —— `src/services/dataExport.ts` 中的 `exportAllUserData()` 会将设置、会话和同意记录打包为一个可下载的 JSON。
- **完全清除** —— `clearAllUserData()` 会移除全部三个键。可在隐私模态框中触发。
- **应用内法律文档** —— 隐私政策、条款、Cookie、AI 声明、法律声明均由 `src/legal/documents.ts` 渲染，可从侧边栏底部与各模态框中访问。

> [!IMPORTANT]
> `polychat-settings` 键中保存着你的 OpenRouter API 密钥，由 `src/services/crypto.ts` 进行 XOR 混淆。这是**混淆，不是加密**——密钥和混淆函数都直接打包在 JS bundle 中。切勿依赖它来抵御执意的本地攻击者。根目录下的 `.env` 文件是历史遗留，**不会被应用读取**；密钥的唯一真实来源是设置模态框。

## 开发

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

本仓库**没有测试运行器** —— 没有安装 `vitest` 或 `jest`。请将 `npm run build` 视为绿灯信号：`tsc -b` 通过，类型就一定是安全的。

> [!NOTE]
> `src/index.css` 中手写的 CSS（约 71 KB）是唯一的样式层。`package.json` 中列出的 `tailwindcss` 和 `@tailwindcss/postcss` 包并未被使用，也没有 PostCSS 配置。在未获得明确所有者批准前，请勿引入 Tailwind。

### 项目结构

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

## 资源

- [OpenRouter 文档](https://openrouter.ai/docs) —— PolyChat 所对接的 API
- [React 19 发布说明](https://react.dev/blog/2024/12/05/react-19) —— 流式输出所使用的并发特性
- [Vite 指南](https://vite.dev/guide/) —— 开发服务器与构建
- [Zustand persist 中间件](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) —— 三个 localStorage 存储
- [CNIL — RGPD 开发者指南](https://www.cnil.fr/fr/developer-guide) —— 隐私设计参考

## 获取帮助

- **应用内 FAQ** —— 打开侧边栏找到帮助链接；FAQ 模态框可一键跳转至设置、法律文档与隐私面板。
- **缺陷报告** —— 在仓库中提交 Issue，附上复现步骤以及 `npm run build` 与 `npm run lint` 的输出。
- **安全隐患披露** —— 对于 [隐私与法律](#隐私与法律) 中标注为安全相关的内容，请使用私密渠道而非公开 Issue。

<div align="center">
<sub>以数字纸张谱写 —— 衬线 Fraunces · 等线 IBM Plex · 等宽 JetBrains</sub>
</div>
