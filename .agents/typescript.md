# TypeScript Guidelines

## Configuration

- **Strict Mode:** Enabled in `tsconfig.app.json`.
- **Module System:** ES Modules (`"type": "module"`).

## Patterns

### Props Definition
Use `interface` for props definition.
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}
```

### Type Unions
Use `type` for string unions (e.g., status, variants).
```typescript
type MessageStatus = 'pending' | 'sent' | 'error';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
```

### Type Safety
- Avoid `any`; use `unknown` or specific types.
- Use `import type` for type-only imports (enforced by `verbatimModuleSyntax`).

## Examples

### Good
```typescript
import type { ChatMessage } from '../types/chat';

function processMessage(msg: unknown): ChatMessage {
  if (typeof msg === 'object' && msg !== null && 'content' in msg) {
    return msg as ChatMessage;
  }
  throw new Error('Invalid message');
}
```

### Avoid
```typescript
// No any types
function processMessage(msg: any): any {
  return msg;
}
```
