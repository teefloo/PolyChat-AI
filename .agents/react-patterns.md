# React Patterns

## Components

- Functional components only.
- Use `React.FC<Props>` or directly typed props `({ prop }: Props)`.

## State Management

- **Local UI state:** `useState`
- **Global app state:** `zustand` (stores in `src/hooks/` or `src/store/`)

## Effects

- Strict dependency arrays.
- Cleanup functions for listeners/timers.

## Tailwind CSS (v4)

- **Styling:** Utility classes first.
- **Dynamic Classes:** Use template literals for conditional classes.
- **Variables:** CSS variables defined in `src/styles/` for themes (colors, spacing).
- **Variants:** Define component variants as objects.

## Examples

### Good Component
```typescript
import { useState } from 'react';
import type { ButtonProps } from '../types/ui';

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-200'}`}
    >
      {label}
    </button>
  );
}
```

### Good Effect
```typescript
import { useEffect } from 'react';

export function useEventListener(event: string, handler: () => void) {
  useEffect(() => {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }, [event, handler]);
}
```

### Avoid
```typescript
// No cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// Missing dependency
useEffect(() => {
  fetchData(url);
}, []);
```
