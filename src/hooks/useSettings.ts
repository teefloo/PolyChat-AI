import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { Settings } from '../types/index';
import { obfuscate, deobfuscate, isObfuscated } from '../services/crypto';

interface SettingsStore extends Settings {
  isSettingsOpen: boolean;
  setApiKey: (apiKey: string) => void;
  setSelectedModel: (model: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSystemPrompt: (systemPrompt: string) => void;
  setTemperature: (temperature: number) => void;
  setMaxTokens: (maxTokens: number) => void;
  toggleTheme: () => void;
  toggleSettings: () => void;
  closeSettings: () => void;
}

const obfuscatedStorage: StateStorage = {
  getItem: (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.apiKey && isObfuscated(parsed.state.apiKey)) {
        parsed.state.apiKey = deobfuscate(parsed.state.apiKey);
      }
      return JSON.stringify(parsed);
    } catch {
      return raw;
    }
  },
  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value);
      if (parsed?.state?.apiKey) {
        parsed.state.apiKey = obfuscate(parsed.state.apiKey);
      }
      localStorage.setItem(name, JSON.stringify(parsed));
    } catch {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      apiKey: '',
      selectedModel: '',
      theme: 'dark',
      systemPrompt: '',
      temperature: 0.7,
      maxTokens: 4096,
      isSettingsOpen: false,

      setApiKey: (apiKey) => set({ apiKey }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setTheme: (theme) => set({ theme }),
      setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
      setTemperature: (temperature) => set({ temperature }),
      setMaxTokens: (maxTokens) => set({ maxTokens }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
      toggleSettings: () => set({ isSettingsOpen: !get().isSettingsOpen }),
      closeSettings: () => set({ isSettingsOpen: false }),
    }),
    {
      name: 'polychat-settings',
      storage: createJSONStorage(() => obfuscatedStorage),
      partialize: (state) => ({
        apiKey: state.apiKey,
        selectedModel: state.selectedModel,
        theme: state.theme,
        systemPrompt: state.systemPrompt,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
      }),
    }
  )
);

