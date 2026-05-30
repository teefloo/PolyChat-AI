import type { ChatSession } from '../types/index';

const STORAGE_KEY = 'polychat_history';

export function saveChatHistory(sessions: ChatSession[]): void {
  try {
    const filtered = sessions.filter((s) => s.messages.length > 0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Storage quota exceeded
  }
}

export function loadChatHistory(): ChatSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((s: ChatSession & { modelId?: string; modelName?: string }) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
      windows: s.windows || [{ modelId: s.modelId || '', modelName: s.modelName || '' }],
    }));
  } catch {
    return [];
  }
}
