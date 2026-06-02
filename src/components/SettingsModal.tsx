import { useEffect, useRef, useState } from 'react';
import { X, Sun, Moon, Trash2, AlertTriangle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import type { Model } from '../types/index';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: Model[];
}

function getTokenLabel(tokens: number): string {
  if (tokens <= 512) return 'Court';
  if (tokens <= 2048) return 'Court+';
  if (tokens <= 4096) return 'Moyen';
  if (tokens <= 8192) return 'Long';
  return 'Très long';
}

export function SettingsModal({ isOpen, onClose, models }: SettingsModalProps) {
  const {
    apiKey,
    setApiKey,
    selectedModel,
    setSelectedModel,
    theme,
    toggleTheme,
    systemPrompt,
    setSystemPrompt,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
  } = useSettings();

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const apiKeyRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmingClear(false);
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => {
      if (!apiKey && apiKeyRef.current) {
        apiKeyRef.current.focus();
      } else {
        closeButtonRef.current?.focus();
      }
    }, 50);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (confirmingClear) {
          setConfirmingClear(false);
        } else {
          onClose();
        }
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen, onClose, apiKey, confirmingClear]);

  if (!isOpen) return null;

  const selectedModelData = models.find((m) => m.id === selectedModel);
  const titleId = 'settings-modal-title';

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
          <h2 id={titleId} className="modal-title">
            Paramètres
          </h2>
          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer la fenêtre des paramètres"
            title="Fermer (Échap)"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="modal-body">
          {/* API Key */}
          <div className="form-group">
            <label className="form-label" htmlFor="api-key">
              Clé API OpenRouter
            </label>
            <input
              ref={apiKeyRef}
              id="api-key"
              type="password"
              className="form-input"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="form-hint">
              Obtenez votre clé sur{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                openrouter.ai/keys
              </a>
            </span>
          </div>

          {/* Default Model */}
          <div className="form-group">
            <label className="form-label" htmlFor="default-model">
              Modèle par défaut
            </label>
            <select
              id="default-model"
              className="form-input"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Choisir un modèle</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {selectedModelData && (
              <span className="form-hint">
                Contexte : {((selectedModelData.context_length || 0) / 1000).toFixed(0)}k tokens
              </span>
            )}
          </div>

          {/* Temperature */}
          <div className="form-group">
            <label className="form-label" htmlFor="temperature">
              Température{' '}
              <span className="form-range-value" aria-hidden="true">
                {temperature.toFixed(1)}
              </span>
            </label>
            <input
              id="temperature"
              type="range"
              className="form-range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={2}
              aria-valuenow={temperature}
              aria-valuetext={`${temperature.toFixed(1)} — ${temperature < 0.5 ? 'très déterministe' : temperature < 1 ? 'équilibré' : temperature < 1.5 ? 'créatif' : 'très créatif'}`}
            />
            <div className="form-range-labels" aria-hidden="true">
              <span>0 — Déterministe</span>
              <span>2 — Créatif</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="form-group">
            <label className="form-label" htmlFor="max-tokens">
              Tokens maximum{' '}
              <span className="form-range-value" aria-hidden="true">
                {maxTokens.toLocaleString()}
              </span>
              <span className="form-range-badge" aria-hidden="true">
                {getTokenLabel(maxTokens)}
              </span>
            </label>
            <input
              id="max-tokens"
              type="range"
              className="form-range"
              min="256"
              max="16384"
              step="256"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              aria-valuemin={256}
              aria-valuemax={16384}
              aria-valuenow={maxTokens}
              aria-valuetext={`${maxTokens.toLocaleString()} tokens (${getTokenLabel(maxTokens)})`}
            />
            <div className="form-range-labels" aria-hidden="true">
              <span>256</span>
              <span>16 384</span>
            </div>
          </div>

          {/* System Prompt */}
          <div className="form-group">
            <label className="form-label" htmlFor="system-prompt">
              Prompt système
            </label>
            <textarea
              id="system-prompt"
              className="form-textarea"
              placeholder="Instructions pour l'IA (optionnel)…"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
            />
            <span className="form-hint">
              Définit le comportement de l'assistant pour toutes les conversations
            </span>
          </div>

          {/* Theme */}
          <div className="form-group">
            <span className="form-label">Thème</span>
            <button
              type="button"
              className="form-input form-button"
              onClick={toggleTheme}
              aria-pressed={theme === 'dark'}
              aria-label={`Activer le thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
            >
              {theme === 'dark' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
              {theme === 'dark' ? 'Sombre' : 'Clair'}
            </button>
          </div>

          {/* Clear History */}
          <div className="form-group">
            <span className="form-label">Données</span>
            {confirmingClear ? (
              <div className="form-confirm" role="alertdialog" aria-labelledby="clear-confirm-title" aria-describedby="clear-confirm-desc">
                <div className="form-confirm-icon" aria-hidden="true">
                  <AlertTriangle size={18} />
                </div>
                <div className="form-confirm-body">
                  <div id="clear-confirm-title" className="form-confirm-title">
                    Supprimer tout l'historique ?
                  </div>
                  <div id="clear-confirm-desc" className="form-confirm-desc">
                    Cette action est irréversible. Toutes les conversations seront supprimées.
                  </div>
                </div>
                <div className="form-confirm-actions">
                  <button
                    type="button"
                    className="form-input form-button form-button-danger"
                    onClick={() => {
                      localStorage.removeItem('polychat_history');
                      window.location.reload();
                    }}
                    autoFocus
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Supprimer
                  </button>
                  <button
                    type="button"
                    className="form-input form-button"
                    onClick={() => setConfirmingClear(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="form-input form-button form-button-danger"
                onClick={() => setConfirmingClear(true)}
                aria-label="Supprimer tout l'historique des conversations"
              >
                <Trash2 size={16} aria-hidden="true" />
                Supprimer l'historique
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
