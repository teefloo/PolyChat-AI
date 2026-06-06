<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**Многооконный чат для OpenRouter — сравнивайте до трёх LLM бок о бок в одной сессии.**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[Обзор](#обзор) ·
[Возможности](#возможности) ·
[Начало работы](#начало-работы) ·
[Конфиденциальность и юридическая информация](#конфиденциальность-и-юридическая-информация) ·
[Разработка](#разработка) ·
[Ресурсы](#ресурсы)

</div>

<!-- README-I18N:START -->
[English](./README.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Deutsch](./README.de.md) · [Italiano](./README.it.md) · [Português](./README.pt.md) · [汉语](./README.zh.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · **Русский**
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** Тихий редакторский интерфейс для параллельного опроса нескольких языковых моделей, сравнения их голосов и выработки правильного ответа.

PolyChat AI — это одностраничное веб-приложение, которое общается с API [OpenRouter](https://openrouter.ai/). Его отличительная черта — **многооконная композиция**: открывайте до трёх чат-колонок бок о бок в одной сессии, выбирайте для каждой свою модель и получайте их ответы параллельно в потоке — идеально для бенчмаркинга, итерации промптов или просто для получения второго мнения.

Всё живёт в вашем браузере. Без аккаунтов, без сервера, без телеметрии: сессии, настройки и согласия хранятся в `localStorage`, а ваш API-ключ никогда не покидает устройство.

---

## Обзор

| | |
| --- | --- |
| **Интерфейс** | Франкоязычный UI, редакторская вёрстка (Fraunces · IBM Plex · JetBrains Mono) |
| **Модели** | Любая модель, доступная в OpenRouter (GPT-4o, Claude 3.5, Gemini, Llama, Mistral…) |
| **Композиция** | 1, 2 или 3 параллельных чат-колонки на сессию, модель на каждую колонку |
| **Стриминг** | Потоковая передача токенов в реальном времени с остановкой и регенерацией для каждого окна |
| **Markdown** | `react-markdown` + `remark-gfm` (таблицы, списки задач, блоки кода) |
| **Темы** | Светлая / тёмная, сохраняется между сессиями |
| **Хранилище** | Только `localStorage` — без бэкенда, без cookies, без удалённой БД |
| **Юридическая сторона** | Экран согласия RGPD/CNIL при первом запуске, французские юридические документы в приложении |

## Возможности

- **Многооконная композиция** — открывайте до трёх чат-колонок внутри одной сессии. Отправляйте одно сообщение во все колонки или адресное — в активное окно.
- **Стриминг с управлением** — отмена на основе `AbortController` для каждого окна, регенерация любого ответа ассистента одним кликом, мгновенная остановка всех потоков.
- **История сессий** — боковая панель с группировкой по *Сегодня / Вчера / дата*, со встроенным поиском, переименованием и удалением. Пустые сессии автоматически удаляются.
- **Выбор модели** — выпадающий список с поиском, загружаемый в реальном времени из `/api/v1/models`. Настраивается для каждого окна.
- **Параметры генерации** — системный промпт, температура и максимум токенов в Настройках, применяются к каждому запросу.
- **Рендеринг Markdown** — полный GFM в ответах ассистента, включая таблицы, списки задач и блоки кода.
- **Переключение темы** — светлая и тёмная, сохраняется, скрипт перед отрисовкой в `index.html` устраняет мерцание при перезагрузке.
- **Удобство клавиатуры** — ловушки фокуса в модальных окнах, `Esc` для закрытия, цикл `Tab`, ссылка-пропуск к основному содержимому, ARIA-роли на переключателе колонок.
- **Суверенитет данных** — экспортируйте всё (настройки, сессии, согласия) в один JSON-файл или очистите все три хранилища одним кликом.

## Начало работы

### Предварительные требования

- [Node.js](https://nodejs.org) 20 или новее
- API-ключ [OpenRouter](https://openrouter.ai/) (оплата по факту, есть бесплатный тариф)

### Установка и запуск

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

Сервер разработки запустится на `http://localhost:5173`. Откройте его, нажмите **Configurer la clé** (Настроить ключ) в пустом состоянии, вставьте свой ключ OpenRouter — и можно работать.

### Сборка и предпросмотр

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

Скрипт `build` — это контрольный шлюз: он запускает `tsc -b` (который ловит ошибки типов) перед сборкой. В этом проекте нет тест-раннера — полный список команд смотрите в разделе [Разработка](#разработка).

## Настройка

Вся настройка выполняется в разделе **Настройки** (`Ctrl/⌘ + K`) и сохраняется в `localStorage["polychat-settings"]`.

| Поле | Описание |
| --- | --- |
| **API-ключ** | Ваш ключ OpenRouter. Хранится в `localStorage` с XOR-обфускацией (см. раздел [Безопасность](#security) ниже). |
| **Модель** | Модель по умолчанию, загружаемая при первом запуске; можно переопределить для каждого окна. |
| **Тема** | Светлая / Тёмная. |
| **Системный промпт** | Добавляется перед каждым запросом в сессии. |
| **Температура** | Температура сэмплирования, `0.0` – `2.0`. |
| **Макс. длина** | Максимум токенов на ответ (пресеты Короткий → Очень длинный). |

> [!TIP]
> При самом первом запуске отображается пустое состояние из двух шагов: настройте ключ, затем выберите модель. Модальное окно настроек также позволяет открыть панель конфиденциальности, чтобы управлять согласиями в любой момент.

## Конфиденциальность и юридическая информация

Это франкоязычное приложение, которое по своей архитектуре соответствует требованиям RGPD / CNIL.

- **Экран согласия при первом запуске** — приложение блокируется, пока вы не примете текущую версию юридических документов. Версия отслеживается в `src/hooks/useLegal.ts` (`CURRENT_LEGAL_VERSION`); обновляйте её при значимом изменении юридического текста.
- **Google Fonts защищены согласием** — они *не* объявлены в `index.css`. Они подключаются через `src/services/fontLoader.ts` только после того, как вы предоставите `fontsConsent` в модальном окне конфиденциальности. Скрипт перед отрисовкой в `index.html` читает `polychat-legal`, чтобы выставить `data-fonts` до первой отрисовки — мерцания нет.
- **Никакого трекинга, cookies или бэкенда** — используются только три ключа `localStorage`: `polychat-settings`, `polychat_history`, `polychat-legal`.
- **Экспорт данных** — `exportAllUserData()` в `src/services/dataExport.ts` объединяет настройки, сессии и согласия в загружаемый JSON.
- **Полная очистка** — `clearAllUserData()` удаляет все три ключа. Доступно из модального окна конфиденциальности.
- **Юридические документы в приложении** — Конфиденциальность, Условия, Cookies, уведомления об ИИ, Юридические уведомления рендерятся из `src/legal/documents.ts` и доступны из нижней части боковой панели и модальных окон.

> [!IMPORTANT]
> Ключ `polychat-settings` хранит ваш API-ключ OpenRouter, обфусцированный через XOR в `src/services/crypto.ts`. Это **обфускация, а не шифрование** — и ключ, и функция обфускации попадают в JS-бандл. Не полагайтесь на это против целенаправленного локального атакующего. Корневой файл `.env` — это остаток, и приложение его **не читает**; единственный источник истины для ключа — модальное окно настроек.

## Разработка

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

В этом репозитории **нет тест-раннера** — `vitest` и `jest` не установлены. Считайте `npm run build` зелёным светом: если `tsc -b` проходит, приложение типобезопасно.

> [!NOTE]
> Единственный слой стилей — это написанный вручную CSS в `src/index.css` (~71 KB). Пакеты `tailwindcss` и `@tailwindcss/postcss`, перечисленные в `package.json`, не используются и не имеют конфигурации PostCSS. Не вводите Tailwind без явного одобрения владельца.

### Структура проекта

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

## Ресурсы

- [Документация OpenRouter](https://openrouter.ai/docs) — API, с которым работает PolyChat
- [Заметки о релизе React 19](https://react.dev/blog/2024/12/05/react-19) — конкурентные возможности, используемые для стриминга
- [Руководство Vite](https://vite.dev/guide/) — сервер разработки и сборка
- [Промежуточное ПО persist в Zustand](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — три хранилища localStorage
- [CNIL — Руководство RGPD для разработчиков](https://www.cnil.fr/fr/developer-guide) — справочник по принципу privacy-by-design

## Получить помощь

- **Встроенный FAQ** — откройте боковую панель и найдите ссылку помощи; модальное окно FAQ одним кликом перенаправляет в настройки, юридические документы и панель конфиденциальности.
- **Сообщения об ошибках** — откройте issue в репозитории со шагами воспроизведения и выводом `npm run build` и `npm run lint`.
- **Сообщения о проблемах безопасности** — пожалуйста, используйте приватный канал, а не публичный issue, для всего, что отмечено как безопасность в [Конфиденциальности и юридической информации](#конфиденциальность-и-юридическая-информация).

<div align="center">
<sub>Сверстано на цифровой бумаге — антиква Fraunces · гротеск IBM Plex · моно JetBrains</sub>
</div>
