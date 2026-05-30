import { saveChatHistory, loadChatHistory } from '../services/localStorage';
import type { ChatSession, Message, WindowConfig } from '../types/index';

let _sessions: ChatSession[] = [];
let _listeners: Array<() => void> = [];
let _initialized = false;

function notify() {
  _listeners.forEach((l) => l());
}

function persist() {
  saveChatHistory(_sessions);
}

export function getSessions(): ChatSession[] {
  return _sessions;
}

export function subscribe(listener: () => void): () => void {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((l) => l !== listener);
  };
}

export function initializeChat(): void {
  if (_initialized) return;
  _initialized = true;
  _sessions = loadChatHistory();
  notify();
}

export function createSession(windows: WindowConfig[]): ChatSession {
  const session: ChatSession = {
    id: crypto.randomUUID(),
    title: 'Nouvelle conversation',
    messages: [],
    windows,
    isLoading: false,
    error: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  _sessions = [session, ..._sessions];
  persist();
  notify();
  return session;
}

export function deleteSession(id: string): void {
  _sessions = _sessions.filter((s) => s.id !== id);
  persist();
  notify();
}

export function renameSession(id: string, title: string): void {
  _sessions = _sessions.map((s) => (s.id === id ? { ...s, title, updatedAt: new Date() } : s));
  persist();
  notify();
}

export function updateWindowModel(sessionId: string, windowIndex: number, modelId: string, modelName: string): void {
  _sessions = _sessions.map((s) => {
    if (s.id !== sessionId) return s;
    const windows = [...s.windows];
    windows[windowIndex] = { modelId, modelName };
    return { ...s, windows, updatedAt: new Date() };
  });
  persist();
  notify();
}

export function addMessage(sessionId: string, message: Message): void {
  _sessions = _sessions.map((s) => {
    if (s.id !== sessionId) return s;
    const updated = {
      ...s,
      messages: [...s.messages, message],
      updatedAt: new Date(),
    };
    if (message.role === 'user' && s.messages.length === 0) {
      updated.title = message.content.slice(0, 60) + (message.content.length > 60 ? '...' : '');
    }
    return updated;
  });
  persist();
  notify();
}

export function updateMessage(sessionId: string, messageId: string, content: string): void {
  _sessions = _sessions.map((s) => {
    if (s.id !== sessionId) return s;
    return {
      ...s,
      messages: s.messages.map((m) => (m.id === messageId ? { ...m, content } : m)),
      updatedAt: new Date(),
    };
  });
  persist();
  notify();
}

export function setSessionLoading(sessionId: string, isLoading: boolean): void {
  _sessions = _sessions.map((s) => (s.id === sessionId ? { ...s, isLoading } : s));
  notify();
}

export function setSessionError(sessionId: string, error: string | null): void {
  _sessions = _sessions.map((s) => (s.id === sessionId ? { ...s, error } : s));
  notify();
}

export function getSession(id: string): ChatSession | undefined {
  return _sessions.find((s) => s.id === id);
}

export function removeMessage(sessionId: string, messageId: string): void {
  _sessions = _sessions.map((s) => {
    if (s.id !== sessionId) return s;
    return {
      ...s,
      messages: s.messages.filter((m) => m.id !== messageId),
      updatedAt: new Date(),
    };
  });
  persist();
  notify();
}
