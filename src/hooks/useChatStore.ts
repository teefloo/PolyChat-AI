import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { ChatSession, Message, PageWindow } from '../types/index';
import { loadChatHistory } from '../services/localStorage';

interface ChatStore {
  sessions: ChatSession[];
  activeSessionId: string | null;
  focusedWindowId: string | null;

  setActiveSessionId: (id: string | null) => void;
  setFocusedWindowId: (id: string | null) => void;

  createSession: (modelId: string, modelName: string) => ChatSession;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;

  setWindowCount: (sessionId: string, count: 1 | 2 | 3) => void;
  addWindow: (sessionId: string, modelId: string, modelName: string) => void;
  hideWindow: (sessionId: string, windowId: string) => void;
  updateWindowModel: (
    sessionId: string,
    windowId: string,
    modelId: string,
    modelName: string
  ) => void;

  addMessage: (sessionId: string, windowId: string, message: Message) => void;
  updateMessage: (
    sessionId: string,
    windowId: string,
    messageId: string,
    content: string
  ) => void;
  removeMessage: (sessionId: string, windowId: string, messageId: string) => void;
  setWindowLoading: (sessionId: string, windowId: string, isLoading: boolean) => void;
  setWindowError: (sessionId: string, windowId: string, error: string | null) => void;

  getSession: (id: string) => ChatSession | undefined;
  getWindow: (sessionId: string, windowId: string) => PageWindow | undefined;
}

function newWindow(modelId: string, modelName: string): PageWindow {
  return {
    id: crypto.randomUUID(),
    modelId,
    modelName,
    messages: [],
    isLoading: false,
    error: null,
  };
}

function clampCount(n: number): 1 | 2 | 3 {
  if (n <= 1) return 1;
  if (n >= 3) return 3;
  return 2 as 1 | 2 | 3;
}

function nextFocusedAfterChange(
  session: ChatSession,
  currentFocusedId: string | null
): string | null {
  const visible = session.windows.slice(0, session.windowCount);
  if (currentFocusedId && visible.some((w) => w.id === currentFocusedId)) {
    return currentFocusedId;
  }
  return visible[0]?.id ?? null;
}

const filteredStorage: StateStorage = {
  getItem: () => {
    const sessions = loadChatHistory();
    return JSON.stringify({ state: { sessions }, version: 0 });
  },
  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value);
      if (parsed?.state?.sessions) {
        const filtered = parsed.state.sessions.filter((sess: ChatSession) =>
          sess.windows.some((w) => w.messages.length > 0)
        );
        localStorage.setItem(
          name,
          JSON.stringify({ state: { sessions: filtered }, version: 0 })
        );
      } else {
        localStorage.setItem(name, value);
      }
    } catch {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      focusedWindowId: null,

      setActiveSessionId: (id) => {
        const session = id ? get().sessions.find((s) => s.id === id) : undefined;
        const firstWindow = session?.windows[0];
        set({
          activeSessionId: id,
          focusedWindowId: firstWindow ? firstWindow.id : null,
        });
      },

      setFocusedWindowId: (id) => set({ focusedWindowId: id }),

      createSession: (modelId, modelName) => {
        const session: ChatSession = {
          id: crypto.randomUUID(),
          title: 'Nouvelle conversation',
          windows: [newWindow(modelId, modelName)],
          windowCount: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: session.id,
          focusedWindowId: session.windows[0].id,
        }));
        return session;
      },

      deleteSession: (id) => {
        set((state) => {
          const sessions = state.sessions.filter((sess) => sess.id !== id);
          let { activeSessionId, focusedWindowId } = state;
          if (activeSessionId === id) {
            const nextActive = sessions[0];
            activeSessionId = nextActive ? nextActive.id : null;
            const firstWindow = nextActive?.windows[0];
            focusedWindowId = firstWindow ? firstWindow.id : null;
          }
          return { sessions, activeSessionId, focusedWindowId };
        });
      },

      renameSession: (id, title) => {
        set((state) => ({
          sessions: state.sessions.map((sess) =>
            sess.id === id ? { ...sess, title, updatedAt: new Date() } : sess
          ),
        }));
      },

      setWindowCount: (sessionId, count) => {
        const target = clampCount(count);
        set((state) => {
          const sessions = state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            const fallback = sess.windows[0] || newWindow('', '');
            const windows = [...sess.windows];
            while (windows.length < target) {
              windows.push(newWindow(fallback.modelId, fallback.modelName));
            }
            return { ...sess, windows, windowCount: target, updatedAt: new Date() };
          });
          const updated = sessions.find((s) => s.id === sessionId);
          const focusedWindowId = updated
            ? nextFocusedAfterChange(updated, state.focusedWindowId)
            : state.focusedWindowId;
          return { sessions, focusedWindowId };
        });
      },

      addWindow: (sessionId, modelId, modelName) => {
        set((state) => {
          const sessions = state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            if (sess.windowCount >= 3) return sess;
            const windows = [...sess.windows, newWindow(modelId, modelName)];
            return {
              ...sess,
              windows,
              windowCount: clampCount(sess.windowCount + 1),
              updatedAt: new Date(),
            };
          });
          return { sessions };
        });
      },

      hideWindow: (sessionId, windowId) => {
        set((state) => {
          const sessions = state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            if (sess.windowCount <= 1) return sess;
            const visibleWindows = sess.windows.slice(0, sess.windowCount);
            const removedIdx = visibleWindows.findIndex((w) => w.id === windowId);
            if (removedIdx === -1) return sess;
            const removed = visibleWindows[removedIdx];
            const remaining = visibleWindows.filter((w) => w.id !== windowId);
            const newOrder = [...remaining, removed];
            const windows = [
              ...newOrder,
              ...sess.windows.slice(sess.windowCount),
            ];
            return {
              ...sess,
              windows,
              windowCount: clampCount(sess.windowCount - 1),
              updatedAt: new Date(),
            };
          });
          const updated = sessions.find((s) => s.id === sessionId);
          let focusedWindowId = state.focusedWindowId;
          if (updated && state.focusedWindowId === windowId) {
            focusedWindowId = nextFocusedAfterChange(updated, null);
          } else if (updated) {
            focusedWindowId = nextFocusedAfterChange(updated, state.focusedWindowId);
          }
          return { sessions, focusedWindowId };
        });
      },

      updateWindowModel: (sessionId, windowId, modelId, modelName) => {
        set((state) => ({
          sessions: state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            return {
              ...sess,
              windows: sess.windows.map((w) =>
                w.id === windowId ? { ...w, modelId, modelName } : w
              ),
              updatedAt: new Date(),
            };
          }),
        }));
      },

      addMessage: (sessionId, windowId, message) => {
        set((state) => ({
          sessions: state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            const firstWindow = sess.windows[0];
            const shouldAutoTitle =
              firstWindow &&
              firstWindow.id === windowId &&
              message.role === 'user' &&
              firstWindow.messages.length === 0 &&
              (sess.title === 'Nouvelle conversation' || sess.title === '');
            const windows = sess.windows.map((w) =>
              w.id === windowId ? { ...w, messages: [...w.messages, message] } : w
            );
            const updated: ChatSession = {
              ...sess,
              windows,
              updatedAt: new Date(),
            };
            if (shouldAutoTitle) {
              updated.title =
                message.content.slice(0, 60) + (message.content.length > 60 ? '...' : '');
            }
            return updated;
          }),
        }));
      },

      updateMessage: (sessionId, windowId, messageId, content) => {
        set((state) => ({
          sessions: state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            return {
              ...sess,
              windows: sess.windows.map((w) =>
                w.id === windowId
                  ? {
                      ...w,
                      messages: w.messages.map((m) =>
                        m.id === messageId ? { ...m, content } : m
                      ),
                    }
                  : w
              ),
              updatedAt: new Date(),
            };
          }),
        }));
      },

      removeMessage: (sessionId, windowId, messageId) => {
        set((state) => ({
          sessions: state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            return {
              ...sess,
              windows: sess.windows.map((w) =>
                w.id === windowId
                  ? { ...w, messages: w.messages.filter((m) => m.id !== messageId) }
                  : w
              ),
              updatedAt: new Date(),
            };
          }),
        }));
      },

      setWindowLoading: (sessionId, windowId, isLoading) => {
        set((state) => ({
          sessions: state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            return {
              ...sess,
              windows: sess.windows.map((w) =>
                w.id === windowId ? { ...w, isLoading } : w
              ),
            };
          }),
        }));
      },

      setWindowError: (sessionId, windowId, error) => {
        set((state) => ({
          sessions: state.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            return {
              ...sess,
              windows: sess.windows.map((w) =>
                w.id === windowId ? { ...w, error } : w
              ),
            };
          }),
        }));
      },

      getSession: (id) => get().sessions.find((sess) => sess.id === id),
      getWindow: (sessionId, windowId) => {
        const sess = get().sessions.find((s) => s.id === sessionId);
        return sess?.windows.find((w) => w.id === windowId);
      },
    }),
    {
      name: 'polychat_history',
      storage: createJSONStorage(() => filteredStorage),
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);
