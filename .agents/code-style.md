# Code Style Guidelines

## Formatting

- **Tool:** Prettier (configuration inferred from `.prettierrc` or defaults if missing).
- **Rules:** 2 spaces indent, semi-colons, single quotes (JS/TS), double quotes (JSX), trailing commas (ES5).

## Imports & Module Structure

- **Module System:** ES Modules (`"type": "module"`).
- **Type Imports:** Explicitly use `import type` for types (enforced by `verbatimModuleSyntax`).
- **Ordering:**
  1. React / External libraries
  2. Types (`../types/...`)
  3. Services / Hooks / Context
  4. Components
  5. Utils / Assets / Styles

## Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| Components | PascalCase | `ChatInput.tsx` |
| Hooks | camelCase + `use` | `useChatStore.ts` |
| Types | PascalCase | `ChatMessage`, `Session` |
| Props Interfaces | PascalCase + `Props` | `ButtonProps` |
| Functions | camelCase | `handleSendMessage` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_MODEL_ID` |

## Examples

### Good
```typescript
import { useState } from 'react';
import type { ChatMessage } from '../types/chat';
import { ChatInput } from '../components/ChatInput';
import { useChatStore } from '../hooks/useChatStore';

const API_URL = 'https://api.example.com';
```

### Avoid
```typescript
// Wrong import order
import { useChatStore } from '../hooks/useChatStore';
import { useState } from 'react';
import type { ChatMessage } from '../types/chat';
```
