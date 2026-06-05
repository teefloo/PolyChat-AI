import { useEffect, useRef } from 'react';
import type { LegalDocument } from '../legal/documents';

interface ConsentGateProps {
  onOpenDocument: (id: LegalDocument['id']) => void;
  onAccept: () => void;
}

const LEGAL_LINKS: { id: LegalDocument['id']; label: string }[] = [
  { id: 'notices', label: 'mentions légales' },
  { id: 'privacy', label: 'politique de confidentialité' },
  { id: 'terms', label: 'CGU' },
  { id: 'cookies', label: 'politique cookies' },
  { id: 'ai', label: 'avertissement IA' },
];

export function ConsentGate({ onOpenDocument, onAccept }: ConsentGateProps) {
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    acceptRef.current?.focus();
  }, []);

  return (
    <>
      <div className="consent-backdrop" aria-hidden="true" />
      <div
        className="consent-banner"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-banner-title"
      >
        <div className="consent-banner-body">
          <h2 id="consent-banner-title" className="consent-banner-title">
            Avant de commencer
          </h2>
          <p className="consent-banner-text">
            PolyChat AI relaie vos messages à OpenRouter et conserve vos
            conversations en local. En continuant, vous acceptez nos{' '}
            {LEGAL_LINKS.map((link, i) => {
              const isLast = i === LEGAL_LINKS.length - 1;
              const sep = i === 0 ? '' : isLast ? ' et ' : ', ';
              return (
                <span key={link.id}>
                  {sep}
                  <button
                    type="button"
                    className="consent-banner-link"
                    onClick={() => onOpenDocument(link.id)}
                  >
                    {link.label}
                  </button>
                </span>
              );
            })}
            .
          </p>
        </div>
        <div className="consent-banner-actions">
          <button
            type="button"
            className="form-input form-button consent-banner-decline"
            onClick={(e) => e.preventDefault()}
            aria-label="Refuser et rester sur la page d'accueil"
          >
            Refuser
          </button>
          <button
            ref={acceptRef}
            type="button"
            className="form-input form-button consent-banner-accept"
            onClick={onAccept}
          >
            J'accepte
          </button>
        </div>
      </div>
    </>
  );
}
