import { useEffect, useRef, useState } from 'react';
import { X, Shield, Cookie, Download, Trash2, AlertTriangle } from 'lucide-react';
import { useLegal, CURRENT_LEGAL_VERSION } from '../hooks/useLegal';
import { useSettings } from '../hooks/useSettings';
import { useChatStore } from '../hooks/useChatStore';
import { exportAllUserData, downloadJson, clearAllUserData } from '../services/dataExport';
import { applyFontsConsent } from '../services/fontLoader';
import type { LegalDocument } from '../legal/documents';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLegal: (id: LegalDocument['id']) => void;
}

export function PrivacyModal({ isOpen, onClose, onOpenLegal }: PrivacyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const { fontsConsent, setFontsConsent, recordExport, revokeAll } = useLegal();
  const setApiKey = useSettings((s) => s.setApiKey);
  const sessions = useChatStore((s) => s.sessions);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingRevoke, setConfirmingRevoke] = useState(false);
  const [exportFlash, setExportFlash] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmingDelete(false);
      setConfirmingRevoke(false);
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (confirmingDelete) setConfirmingDelete(false);
        else if (confirmingRevoke) setConfirmingRevoke(false);
        else onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose, confirmingDelete, confirmingRevoke]);

  if (!isOpen) return null;

  const titleId = 'privacy-modal-title';

  function handleExport() {
    const data = exportAllUserData();
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    downloadJson(data, `polychat-export-${stamp}.json`);
    recordExport();
    setExportFlash(true);
    window.setTimeout(() => setExportFlash(false), 2400);
  }

  function handleToggleFonts(granted: boolean) {
    setFontsConsent(granted);
    applyFontsConsent(granted);
  }

  function handleDeleteAllData() {
    clearAllUserData();
    setApiKey('');
    setConfirmingDelete(false);
    window.location.reload();
  }

  function handleRevokeConsent() {
    revokeAll();
    setConfirmingRevoke(false);
    setConfirmingDelete(false);
    window.location.reload();
  }

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Confidentialité</span>
            <h2 id={titleId} className="modal-title">
              Vos <em>données.</em>
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer la fenêtre Confidentialité"
            title="Fermer (Échap)"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="modal-body">
          {/* Legal docs quick access */}
          <div className="form-group">
            <span className="form-label">Documents juridiques</span>
            <div className="privacy-legal-links">
              <button
                type="button"
                className="form-input form-button privacy-legal-link"
                onClick={() => onOpenLegal('privacy')}
              >
                <Shield size={14} aria-hidden="true" />
                Politique de confidentialité
              </button>
              <button
                type="button"
                className="form-input form-button privacy-legal-link"
                onClick={() => onOpenLegal('terms')}
              >
                <Shield size={14} aria-hidden="true" />
                CGU
              </button>
              <button
                type="button"
                className="form-input form-button privacy-legal-link"
                onClick={() => onOpenLegal('cookies')}
              >
                <Cookie size={14} aria-hidden="true" />
                Cookies et stockage
              </button>
              <button
                type="button"
                className="form-input form-button privacy-legal-link"
                onClick={() => onOpenLegal('notices')}
              >
                <Shield size={14} aria-hidden="true" />
                Mentions légales
              </button>
              <button
                type="button"
                className="form-input form-button privacy-legal-link"
                onClick={() => onOpenLegal('ai')}
              >
                <Shield size={14} aria-hidden="true" />
                Avertissement IA
              </button>
            </div>
            <span className="form-hint">
              Version actuelle : {CURRENT_LEGAL_VERSION}
            </span>
          </div>

          {/* Fonts consent */}
          <div className="form-group">
            <span className="form-label">Polices de caractères</span>
            <label className="privacy-toggle">
              <input
                type="checkbox"
                checked={fontsConsent}
                onChange={(e) => handleToggleFonts(e.target.checked)}
              />
              <span className="privacy-toggle-track" aria-hidden="true">
                <span className="privacy-toggle-thumb" />
              </span>
              <span className="privacy-toggle-text">
                <span className="privacy-toggle-title">
                  Charger Google Fonts (Fraunces, IBM Plex, JetBrains Mono)
                </span>
                <span className="privacy-toggle-desc">
                  Sans ce consentement, l'application utilise les polices système. Le
                  chargement implique une requête vers Google LLC, qui reçoit votre
                  adresse IP.
                </span>
              </span>
            </label>
          </div>

          {/* Data export (portability) */}
          <div className="form-group">
            <span className="form-label">Droit à la portabilité (RGPD art. 20)</span>
            <p className="form-hint privacy-hint-block">
              Téléchargez l'intégralité de vos conversations et préférences au format JSON.
              {sessions.length > 0 && (
                <>
                  {' '}
                  {sessions.length} conversation{sessions.length > 1 ? 's' : ''} sera
                  {sessions.length > 1 ? 'ont' : ''} incluse
                  {sessions.length > 1 ? 's' : ''}.
                </>
              )}
            </p>
            <button
              type="button"
              className="form-input form-button"
              onClick={handleExport}
            >
              <Download size={16} aria-hidden="true" />
              {exportFlash ? 'Export téléchargé' : 'Exporter mes données'}
            </button>
          </div>

          {/* Delete all */}
          <div className="form-group">
            <span className="form-label">Droit à l'effacement (RGPD art. 17)</span>
            {confirmingDelete ? (
              <div className="form-confirm" role="alertdialog">
                <div className="form-confirm-icon" aria-hidden="true">
                  <AlertTriangle size={18} />
                </div>
                <div className="form-confirm-body">
                  <div className="form-confirm-title">Supprimer toutes vos données ?</div>
                  <div className="form-confirm-desc">
                    Clé API, historique de conversations, paramètres, consentements : tout
                    sera effacé. Cette action est irréversible.
                  </div>
                </div>
                <div className="form-confirm-actions">
                  <button
                    type="button"
                    className="form-input form-button form-button-danger"
                    onClick={handleDeleteAllData}
                    autoFocus
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Supprimer
                  </button>
                  <button
                    type="button"
                    className="form-input form-button"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="form-input form-button form-button-danger"
                onClick={() => setConfirmingDelete(true)}
              >
                <Trash2 size={16} aria-hidden="true" />
                Supprimer toutes mes données
              </button>
            )}
          </div>

          {/* Revoke consent */}
          <div className="form-group">
            <span className="form-label">Retirer mes consentements</span>
            <p className="form-hint privacy-hint-block">
              Vous retirez votre accord aux documents juridiques. L'application vous
              redemandera de les accepter à la prochaine visite.
            </p>
            {confirmingRevoke ? (
              <div className="form-confirm" role="alertdialog">
                <div className="form-confirm-icon" aria-hidden="true">
                  <AlertTriangle size={18} />
                </div>
                <div className="form-confirm-body">
                  <div className="form-confirm-title">Retirer les consentements ?</div>
                  <div className="form-confirm-desc">
                    La page de première visite réapparaîtra au prochain chargement.
                  </div>
                </div>
                <div className="form-confirm-actions">
                  <button
                    type="button"
                    className="form-input form-button form-button-danger"
                    onClick={handleRevokeConsent}
                    autoFocus
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Retirer
                  </button>
                  <button
                    type="button"
                    className="form-input form-button"
                    onClick={() => setConfirmingRevoke(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="form-input form-button"
                onClick={() => setConfirmingRevoke(true)}
              >
                Révoquer mes consentements
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
