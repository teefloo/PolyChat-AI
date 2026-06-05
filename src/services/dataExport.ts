import type { ChatSession } from '../types/index';
import { deobfuscate } from './crypto';

const STORAGE_KEYS = ['polychat-settings', 'polychat_history', 'polychat-legal'];

type ExportShape = {
  exportDate: string;
  app: string;
  settings: {
    selectedModel: string;
    theme: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    apiKeyPresent: boolean;
  };
  sessions: ChatSession[];
  consent: {
    legalAccepted: boolean;
    legalAcceptedAt: string | null;
    legalVersion: string | null;
    fontsConsent: boolean;
    fontsConsentAt: string | null;
  } | null;
};

function safeRead<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch {
    return null;
  }
}

export function exportAllUserData(): ExportShape {
  const settingsRaw = safeRead(() => localStorage.getItem('polychat-settings'));
  const historyRaw = safeRead(() => localStorage.getItem('polychat_history'));
  const legalRaw = safeRead(() => localStorage.getItem('polychat-legal'));

  const settingsParsed = settingsRaw ? safeRead(() => JSON.parse(settingsRaw)) : null;
  const historyParsed = historyRaw ? safeRead(() => JSON.parse(historyRaw)) : null;
  const legalParsed = legalRaw ? safeRead(() => JSON.parse(legalRaw)) : null;

  const apiKeyFromStore =
    typeof settingsParsed?.state?.apiKey === 'string'
      ? settingsParsed.state.apiKey
      : '';
  const apiKey = isProbablyObfuscated(apiKeyFromStore)
    ? safeRead(() => deobfuscate(apiKeyFromStore)) ?? '[clé API chiffrée — non affichée]'
    : apiKeyFromStore;

  const sessions: ChatSession[] = Array.isArray(historyParsed?.state?.sessions)
    ? historyParsed.state.sessions
    : [];

  return {
    exportDate: new Date().toISOString(),
    app: 'PolyChat AI',
    settings: {
      selectedModel: settingsParsed?.state?.selectedModel ?? '',
      theme: settingsParsed?.state?.theme ?? '',
      systemPrompt: settingsParsed?.state?.systemPrompt ?? '',
      temperature: settingsParsed?.state?.temperature ?? null,
      maxTokens: settingsParsed?.state?.maxTokens ?? null,
      apiKeyPresent: apiKey.length > 0,
    },
    sessions: scrubSessions(sessions),
    consent: legalParsed?.state
      ? {
          legalAccepted: legalParsed.state.legalAccepted === true,
          legalAcceptedAt: legalParsed.state.legalAcceptedAt ?? null,
          legalVersion: legalParsed.state.legalVersion ?? null,
          fontsConsent: legalParsed.state.fontsConsent === true,
          fontsConsentAt: legalParsed.state.fontsConsentAt ?? null,
        }
      : null,
  };
}

function scrubSessions(sessions: ChatSession[]): ChatSession[] {
  return sessions.map((s) => ({
    ...s,
    windows: s.windows.map((w) => ({
      ...w,
      messages: w.messages.map((m) => ({ ...m })),
    })),
  }));
}

function isProbablyObfuscated(value: string): boolean {
  if (!value) return false;
  if (value.startsWith('sk-or-')) return false;
  return /^[A-Za-z0-9+/]+=*$/.test(value);
}

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function clearAllUserData(): void {
  for (const key of STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
