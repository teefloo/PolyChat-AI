import type { ChatSession, PageWindow } from '../types/index';

const STORAGE_KEY = 'polychat_history';

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type LegacySession = ChatSession & {
  modelId?: string;
  modelName?: string;
  messages?: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string | Date;
    modelId?: string;
    streaming?: boolean;
  }>;
  isLoading?: boolean;
  error?: string | null;
  windowCount?: number;
};

function migrateWindow(
  raw: {
    id?: string;
    modelId?: string;
    modelName?: string;
  },
  fallback: { modelId: string; modelName: string }
): PageWindow {
  return {
    id: raw.id || randomId(),
    modelId: raw.modelId || fallback.modelId,
    modelName: raw.modelName || fallback.modelName,
    messages: [],
    isLoading: false,
    error: null,
  };
}

function migrateSession(raw: LegacySession): ChatSession {
  const rawWindows = Array.isArray(raw.windows) ? raw.windows : [];
  const legacyMessages = Array.isArray(raw.messages) ? raw.messages : [];
  const firstWindowConfig =
    rawWindows[0] ||
    ({ modelId: raw.modelId, modelName: raw.modelName } as { modelId?: string; modelName?: string });

  const fallback = {
    modelId: firstWindowConfig?.modelId || '',
    modelName: firstWindowConfig?.modelName || '',
  };

  let windows: PageWindow[];

  if (rawWindows.length > 0) {
    windows = rawWindows.map((w, i) => {
      const migrated = migrateWindow(w, fallback);
      if (i === 0) {
        migrated.messages = legacyMessages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        migrated.isLoading = raw.isLoading ?? false;
        migrated.error = raw.error ?? null;
      }
      return migrated;
    });
  } else {
    const single = migrateWindow(firstWindowConfig, fallback);
    single.messages = legacyMessages.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
    single.isLoading = raw.isLoading ?? false;
    single.error = raw.error ?? null;
    windows = [single];
  }

  const desiredCount = typeof raw.windowCount === 'number'
    ? Math.min(3, Math.max(1, Math.floor(raw.windowCount)))
    : Math.min(3, Math.max(1, windows.length));
  const windowCount = (desiredCount === 1 || desiredCount === 2 || desiredCount === 3)
    ? (desiredCount as 1 | 2 | 3)
    : (Math.min(3, Math.max(1, windows.length)) as 1 | 2 | 3);

  if (windows.length < windowCount) {
    while (windows.length < windowCount) {
      windows.push(migrateWindow({}, fallback));
    }
  }

  return {
    id: raw.id,
    title: raw.title || 'Nouvelle conversation',
    windows,
    windowCount,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

export function saveChatHistory(sessions: ChatSession[]): void {
  try {
    const filtered = sessions.filter((s) =>
      s.windows.some((w) => w.messages.length > 0)
    );
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
    return parsed.map((s: LegacySession) => migrateSession(s));
  } catch {
    return [];
  }
}
