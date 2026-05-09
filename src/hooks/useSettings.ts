import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types/index';

const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  selectedModel: '', // Aucun modèle par défaut - l'utilisateur choisit
  theme: 'dark', // Thème sombre par défaut pour le design moderne
  accent: 'blue',
  systemPrompt: '', // Instruction système vide par défaut
  tone: 'neutre',
  notificationsEnabled: true,
  ragEnabled: true, // RAG activé par défaut
  hasOnboarded: false,
};

interface SettingsStore extends Settings {
  isSettingsOpen: boolean;
  showConfigurationPopup: boolean;
  configurationPopupType: 'missing-api-key' | 'configuration-error' | null;
  setApiKey: (apiKey: string) => void;
  setSelectedModel: (model: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setAccent: (accent: NonNullable<Settings['accent']>) => void;
  setSystemPrompt: (systemPrompt: string) => void;
  setTone: (tone: NonNullable<Settings['tone']>) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setRagEnabled: (enabled: boolean) => void;
  setHasOnboarded: (hasOnboarded: boolean) => void;
  setShowConfigurationPopup: (
    show: boolean,
    type?: 'missing-api-key' | 'configuration-error'
  ) => void;
  toggleTheme: () => void;
  toggleSettings: () => void;
  closeSettings: () => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      isSettingsOpen: false,
      showConfigurationPopup: false,
      configurationPopupType: null,
      setApiKey: (apiKey) => set({ apiKey }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
      setTone: (tone) => set({ tone }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setRagEnabled: (ragEnabled) => set({ ragEnabled }),
      setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
      setShowConfigurationPopup: (show, type) =>
        set({
          showConfigurationPopup: show,
          configurationPopupType: show ? type || null : null,
        }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
      toggleSettings: () => set({ isSettingsOpen: !get().isSettingsOpen }),
      closeSettings: () => set({ isSettingsOpen: false }),
    }),
    {
      name: 'polychat-settings',
    }
  )
);
