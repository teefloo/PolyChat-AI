import type { LegalDocument } from '../legal/documents';

interface LegalFooterProps {
  onOpenDocument: (id: LegalDocument['id']) => void;
  onManageConsent: () => void;
  onOpenFAQ?: () => void;
}

const ITEMS: Array<{ id: LegalDocument['id']; label: string }> = [
  { id: 'notices', label: 'Mentions légales' },
  { id: 'privacy', label: 'Confidentialité' },
  { id: 'terms', label: 'CGU' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'ai', label: 'Avertissement IA' },
];

export function LegalFooter({
  onOpenDocument,
  onManageConsent,
  onOpenFAQ,
}: LegalFooterProps) {
  return (
    <footer className="legal-footer" role="contentinfo">
      <div className="legal-footer-eyebrow">Documents juridiques</div>
      <nav aria-label="Documents juridiques" className="legal-footer-nav">
        {ITEMS.map((item, i) => (
          <span key={item.id} className="legal-footer-link-wrap">
            {i > 0 && (
              <span className="legal-footer-sep" aria-hidden="true">
                ·
              </span>
            )}
            <button
              type="button"
              className="legal-footer-link"
              onClick={() => onOpenDocument(item.id)}
            >
              {item.label}
            </button>
          </span>
        ))}
      </nav>
      {onOpenFAQ && (
        <button
          type="button"
          className="legal-footer-manage"
          onClick={onOpenFAQ}
        >
          <span>Questions fréquentes (FAQ)</span>
          <span className="legal-footer-manage-arrow" aria-hidden="true">
            →
          </span>
        </button>
      )}
      <button
        type="button"
        className="legal-footer-manage"
        onClick={onManageConsent}
      >
        <span>Gérer mes consentements</span>
        <span className="legal-footer-manage-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </footer>
  );
}
