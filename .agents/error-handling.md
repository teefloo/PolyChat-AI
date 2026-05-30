# Error Handling

## Async/Await

Wrap async calls in `try/catch`.
```typescript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fetch failed:', error.message);
    }
    throw error;
  }
}
```

## Type Guards

Check `if (error instanceof Error)` before accessing `.message`.

## UI Feedback

Display user-friendly error messages in **French**.

## Examples

### Good
```typescript
try {
  await sendMessage(content);
} catch (error) {
  const message = error instanceof Error
    ? error.message
    : 'Une erreur inconnue est survenue';
  setError(`Erreur: ${message}`);
}
```

### Avoid
```typescript
// No error handling
await sendMessage(content);

// Accessing .message without type check
catch (error) {
  setError(error.message); // Might crash if error isn't an Error
}
```
