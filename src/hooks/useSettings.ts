import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types/index';

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
    }
  )
);
