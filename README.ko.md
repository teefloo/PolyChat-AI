<!-- prettier-ignore -->
<div align="center">

<img src="public/logos/polychat-logo-concept1-horizontal.svg" alt="PolyChat AI" width="320" />

**OpenRouter를 위한 멀티페이지 채팅 스튜디오 — 한 세션에서 최대 세 개의 LLM을 나란히 비교해 보세요.**

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-100%2B_models-6366f1?style=flat-square)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![RGPD](https://img.shields.io/badge/RGPD%20%2F%20CNIL-Consent--gated-0ea5e9?style=flat-square)](src/legal/documents.ts)

[개요](#개요) ·
[기능](#기능) ·
[시작하기](#시작하기) ·
[개인정보 및 법적 고지](#개인정보-및-법적-고지) ·
[개발](#개발) ·
[리소스](#리소스)

</div>

<!-- README-I18N:START -->
[English](./README.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Deutsch](./README.de.md) · [Italiano](./README.it.md) · [Português](./README.pt.md) · [汉语](./README.zh.md) · [日本語](./README.ja.md) · **한국어** · [Русский](./README.ru.md)
<!-- README-I18N:END -->

---

> **Converser avec l'intelligence.** 여러 언어 모델에 병렬로 질문을 던지고, 그 음색을 비교하며, 가장 그럴듯한 답을 다듬을 수 있는 차분하고 에디토리얼한 인터페이스예요.

PolyChat AI는 [OpenRouter](https://openrouter.ai/) API와 통신하는 단일 페이지 웹 애플리케이션이에요. 가장 큰 특징은 **멀티페이지 구성**으로, 한 세션 안에서 최대 세 개의 채팅 열을 나란히 열고 각각 다른 모델을 골라 답변을 병렬로 스트리밍할 수 있어요. 벤치마킹이나 프롬프트 반복, 혹은 단순히 다른 모델의 시각을 확인하고 싶을 때 안성맞춤이에요.

모든 데이터는 브라우저 안에만 머물러요. 계정도, 서버도, 텔레메트리도 없으며 세션과 설정, 동의 기록은 `localStorage`에 저장되고, API 키는 기기를 떠나지 않아요.

---

## 개요

| | |
| --- | --- |
| **인터페이스** | 프랑스어 UI, 에디토리얼 레이아웃 (Fraunces · IBM Plex · JetBrains Mono) |
| **모델** | OpenRouter에서 제공하는 모든 모델 (GPT-4o, Claude 3.5, Gemini, Llama, Mistral…) |
| **구성** | 세션당 1~3개의 병렬 채팅 열, 열마다 모델을 따로 지정 |
| **스트리밍** | 토큰 단위 실시간 스트리밍, 열별 중단 및 재생성 |
| **마크다운** | `react-markdown` + `remark-gfm` (테이블, 작업 목록, 코드 블록) |
| **테마** | 라이트 / 다크, 세션 간 유지 |
| **저장소** | `localStorage`만 사용 — 백엔드, 쿠키, 원격 DB 없음 |
| **법적 고지** | 첫 로드 시 RGPD/CNIL 동의 게이트, 프랑스어 법률 문서 인앱 제공 |

## 기능

- **멀티페이지 구성** — 한 세션 안에서 최대 세 개의 채팅 열을 열어 보세요. 모든 열에 한 번에 메시지를 브로드캐스트하거나, 포커스된 창에만 선택적으로 보낼 수 있어요.
- **제어 가능한 스트리밍** — `AbortController` 기반의 창별 중단, 클릭 한 번으로 어시스턴트 메시지를 재생성하고, 한꺼번에 모두 멈출 수도 있어요.
- **세션 기록** — 사이드바를 *오늘 / 어제 / 날짜별*로 그룹화해 보여 주며, 인라인 검색과 이름 변경, 삭제를 지원해요. 빈 세션은 자동으로 정리돼요.
- **모델 선택** — `/api/v1/models`에서 실시간으로 불러오는 검색 가능한 드롭다운이에요. 창별로 설정할 수 있어요.
- **생성 옵션** — 설정에서 시스템 프롬프트, 온도, 최대 토큰 수를 지정해 모든 요청에 적용해요.
- **마크다운 렌더링** — 어시스턴트 메시지에서 GFM을 그대로 지원해 테이블, 작업 목록, 코드 블록까지 표시해요.
- **테마 전환** — 라이트와 다크 모드를 전환할 수 있고, `index.html`의 사전 페인트 스크립트가 새로 고침 시 깜빡임을 방지해요.
- **키보드 친화적** — 모달의 포커스 트랩, `Esc`로 닫기, `Tab` 순환, 메인 콘텐츠로 가는 건너뛰기 링크, 열 전환기의 ARIA 역할 지원.
- **데이터 주권** — 설정, 세션, 동의 기록을 하나의 JSON 파일로 내보내거나, 세 가지 저장소를 한 번에 비울 수 있어요.

## 시작하기

### 사전 요구 사항

- [Node.js](https://nodejs.org) 20 이상
- [OpenRouter](https://openrouter.ai/) API 키 (종량제, 무료 등급 제공)

### 설치 및 실행

```bash
git clone https://github.com/Teeflo/PolyChat-AI.git
cd PolyChat-AI
npm install
npm run dev
```

개발 서버는 `http://localhost:5173`에서 시작돼요. 페이지를 열고 빈 화면에서 **키 설정**을 클릭한 뒤 OpenRouter 키를 붙여넣으면 바로 시작할 수 있어요.

### 빌드 및 미리 보기

```bash
npm run build      # tsc -b && vite build — type-check + bundle
npm run preview    # serve dist/ locally
```

`build` 스크립트가 검증 게이트 역할을 해요. 번들링 전에 `tsc -b`를 실행해서 타입 오류를 잡아내요. 이 프로젝트에는 테스트 러너가 없어요 — 전체 명령어 목록은 [개발](#개발) 섹션을 참고하세요.

## 설정

모든 설정은 **설정**(`Ctrl/⌘ + K`)에서 이루어지며 `localStorage["polychat-settings"]`에 저장돼요.

| 필드 | 설명 |
| --- | --- |
| **API 키** | OpenRouter 키. `localStorage`에 XOR 난독화되어 저장돼요 (아래 [보안](#security) 참고). |
| **모델** | 첫 실행 시 기본으로 사용되는 모델이에요. 창별로 재정의할 수 있어요. |
| **테마** | 라이트 / 다크. |
| **시스템 프롬프트** | 세션의 모든 요청 앞에 자동으로 붙는 프롬프트예요. |
| **온도** | 샘플링 온도, `0.0` – `2.0`. |
| **최대 길이** | 응답당 최대 토큰 수 (짧게 → 아주 길게 프리셋). |

> [!TIP]
> 처음 실행하면 두 단계로 구성된 빈 화면이 나타나요. 먼저 키를 설정한 다음 모델을 선택하세요. 설정 모달에서는 언제든지 개인정보 패널을 열어 동의를 관리할 수 있어요.

## 개인정보 및 법적 고지

이 앱은 프랑스어 애플리케이션이며 설계 단계부터 RGPD/CNIL 가이드라인을 준수해요.

- **첫 로드 동의 게이트** — 현재 법률 버전을 수락하기 전까지 앱이 차단돼요. 버전은 `src/hooks/useLegal.ts`의 `CURRENT_LEGAL_VERSION`에서 추적돼요. 법률 텍스트가 의미 있게 바뀔 때마다 이 값을 올려 주세요.
- **Google Fonts는 동의 후에만 로드돼요** — `index.css`에 선언되어 있지 않으며, 개인정보 모달에서 `fontsConsent` 권한을 부여한 뒤에야 `src/services/fontLoader.ts`가 삽입해요. `index.html`의 사전 페인트 스크립트가 `polychat-legal`을 읽어 첫 페인트 전에 `data-fonts`를 설정하므로 깜빡임이 발생하지 않아요.
- **추적, 쿠키, 백엔드 모두 없음** — 단 세 개의 `localStorage` 키만 사용해요. `polychat-settings`, `polychat_history`, `polychat-legal`.
- **데이터 내보내기** — `src/services/dataExport.ts`의 `exportAllUserData()`가 설정, 세션, 동의 기록을 묶어 다운로드 가능한 JSON으로 만들어 줘요.
- **전체 초기화** — `clearAllUserData()`가 세 키를 모두 삭제해요. 개인정보 모달에서 실행할 수 있어요.
- **인앱 법률 문서** — 개인정보 처리방침, 이용약관, 쿠키, AI 고지, 법적 고지가 `src/legal/documents.ts`에서 렌더링되며 사이드바 푸터와 모달에서 접근할 수 있어요.

> [!IMPORTANT]
> `polychat-settings` 키에는 `src/services/crypto.ts`로 XOR 난독화된 OpenRouter API 키가 저장돼요. 이는 **난독화이지 암호화가 아니에요** — 키와 난독화 함수가 모두 JS 번들에 포함되어 출고돼요. 집요한 로컬 공격자에 대한 보안 수단으로 의존해서는 안 돼요. 루트 디렉터리의 `.env` 파일은 잔존물일 뿐이며 앱에서 **읽지 않아요**. 설정 모달이 키에 대한 유일한 진실의 원천이에요.

## 개발

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b + vite build (type-check gate)
npm run lint      # ESLint flat config (React Hooks + react-refresh)
npm run format    # Prettier — 2 spaces, single quotes, 100 cols
npm run preview   # Serve the production build locally
```

이 저장소에는 **테스트 러너가 없어요** — `vitest`와 `jest`는 설치되어 있지 않아요. `npm run build`를 통과의 기준으로 삼으세요. `tsc -b`가 통과하면 앱이 타입 안전해요.

> [!NOTE]
> `src/index.css`의 직접 작성한 CSS(약 71 KB)가 유일한 스타일링 계층이에요. `package.json`에 명시된 `tailwindcss`와 `@tailwindcss/postcss` 패키지는 사용되지 않으며 PostCSS 설정도 없어요. 명시적인 소유자 승인 없이 Tailwind를 도입하지 마세요.

### 프로젝트 구조

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

## 리소스

- [OpenRouter 문서](https://openrouter.ai/docs) — PolyChat이 통신하는 API
- [React 19 릴리스 노트](https://react.dev/blog/2024/12/05/react-19) — 스트리밍에 사용된 동시성 기능
- [Vite 가이드](https://vite.dev/guide/) — 개발 서버와 빌드
- [Zustand persist 미들웨어](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) — 세 개의 localStorage 저장소
- [CNIL — RGPD 개발자 가이드](https://www.cnil.fr/fr/developer-guide) — 개인정보 보호 설계 참고 자료

## 도움말

- **인앱 FAQ** — 사이드바에서 도움말 링크를 클릭해 보세요. FAQ 모달에서 설정, 법률 문서, 개인정보 패널을 클릭 한 번으로 열어볼 수 있어요.
- **버그 신고** — 재현 절차와 `npm run build`, `npm run lint`의 출력을 함께 첨부해 저장소에 이슈를 열어 주세요.
- **보안 공개** — [개인정보 및 법적 고지](#개인정보-및-법적-고지)에서 보안 항목으로 표시된 부분은 공개 이슈 대신 비공개 채널을 이용해 주세요.

<div align="center">
<sub>디지털 종이 위에 짜인 조판 — Fraunces 세리프 · IBM Plex 그로텍 · JetBrains 모노</sub>
</div>
