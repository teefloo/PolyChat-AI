import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ConsentState = {
  legalAccepted: boolean;
  legalAcceptedAt: string | null;
  legalVersion: string | null;
  fontsConsent: boolean;
  fontsConsentAt: string | null;
  exportRequestedAt: string | null;
};

export const CURRENT_LEGAL_VERSION = '2026-01-01';

interface LegalStore extends ConsentState {
  acceptLegal: () => void;
  setFontsConsent: (granted: boolean) => void;
  recordExport: () => void;
  revokeAll: () => void;
}

export const useLegal = create<LegalStore>()(
  persist(
    (set) => ({
      legalAccepted: false,
      legalAcceptedAt: null,
      legalVersion: null,
      fontsConsent: false,
      fontsConsentAt: null,
      exportRequestedAt: null,

      acceptLegal: () =>
        set({
          legalAccepted: true,
          legalAcceptedAt: new Date().toISOString(),
          legalVersion: CURRENT_LEGAL_VERSION,
        }),

      setFontsConsent: (granted) =>
        set({
          fontsConsent: granted,
          fontsConsentAt: new Date().toISOString(),
        }),

      recordExport: () => set({ exportRequestedAt: new Date().toISOString() }),

      revokeAll: () =>
        set({
          legalAccepted: false,
          legalAcceptedAt: null,
          legalVersion: null,
          fontsConsent: false,
          fontsConsentAt: null,
        }),
    }),
    {
      name: 'polychat-legal',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        legalAccepted: state.legalAccepted,
        legalAcceptedAt: state.legalAcceptedAt,
        legalVersion: state.legalVersion,
        fontsConsent: state.fontsConsent,
        fontsConsentAt: state.fontsConsentAt,
        exportRequestedAt: state.exportRequestedAt,
      }),
    }
  )
);
