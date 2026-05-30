import { createContext, useContext } from 'react';
import type { ChatSession, Model } from '../types/index';

export interface ChatContextValue {
  sessions: ChatSession[];
  activeSessionIds: string[];
  focusedColumn: number;
  setFocusedColumn: (i: number) => void;
  models: Model[];
  windowCount: number;
  setWindowCount: (n: number) => void;
  createNewSession: () => void;
  selectSession: (id: string) => void;
  deleteSessionById: (id: string) => void;
  renameSessionById: (id: string, title: string) => void;
  updateWindowModel: (columnIndex: number, modelId: string, modelName: string) => void;
  sendMessage: (content: string, columnIndex: number) => void;
  deleteMessage: (messageId: string) => void;
  regenerate: (columnIndex: number) => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}
