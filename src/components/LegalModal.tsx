import { useEffect, useRef, useState } from 'react';
import { X, Printer } from 'lucide-react';
import type { LegalDocument } from '../legal/documents';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LegalDocument;
}

export function LegalModal({ isOpen, onClose, document: doc }: LegalModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [toc, setToc] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const headings = modalRef.current.querySelectorAll<HTMLElement>('[data-toc-target]');
    const observer = new IntersectionObserver(
      (entries) => {
        setToc((prev) => {
          const next = { ...prev };
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('data-toc-target');
              if (id) next[id] = true;
            }
          }
          return next;
        });
      },
      { rootMargin: '0px 0px -70% 0px' }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [isOpen]);

  if (!isOpen) return null;

  const titleId = `legal-modal-${doc.id}-title`;

  return (
    <div
      className="modal-overlay legal-modal-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="modal legal-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Document juridique</span>
            <h2 id={titleId} className="modal-title legal-modal-title">
              {doc.title}
            </h2>
            <span className="legal-modal-date">En vigueur au {doc.effectiveDate}</span>
          </div>
          <div className="legal-modal-header-actions">
            <button
              type="button"
              className="modal-close"
              onClick={() => window.print()}
              aria-label="Imprimer ce document"
              title="Imprimer (Ctrl+P)"
            >
              <Printer size={16} aria-hidden="true" />
            </button>
            <button
              ref={closeButtonRef}
              className="modal-close"
              onClick={onClose}
              aria-label="Fermer ce document"
              title="Fermer (Échap)"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="modal-body legal-modal-body">
          <aside className="legal-modal-toc" aria-label="Sommaire">
            <div className="legal-modal-toc-label">Sommaire</div>
            <ol>
              {doc.sections.map((s) => (
                <li key={s.id} className={toc[s.id] ? 'active' : ''}>
                  <a href={`#${s.id}`} onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(s.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>
                    {s.title.replace(/^\d+\.\s*/, '')}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
          <div className="legal-modal-content">
            <p className="legal-modal-intro">{doc.intro}</p>
            {doc.sections.map((section) => (
              <section key={section.id} className="legal-section" id={section.id}>
                <h3 data-toc-target={section.id} className="legal-section-title">
                  {section.title}
                </h3>
                {section.paragraphs.map((p, i) => {
                  if (typeof p === 'string') {
                    return (
                      <p key={i} className="legal-section-paragraph">
                        {p}
                      </p>
                    );
                  }
                  return (
                    <ul key={i} className="legal-section-list">
                      {p.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  );
                })}
              </section>
            ))}
            <div className="legal-modal-footer">
              <em>{doc.title}</em> — en vigueur au {doc.effectiveDate}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
