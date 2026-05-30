import { useEffect, useRef } from 'react';
import { X, Sun, Moon, Trash2 } from 'lucide-react';
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
  const apiKeyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Auto-focus API key input if empty
      if (!apiKey) {
        setTimeout(() => apiKeyRef.current?.focus(), 100);
      }
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, apiKey]);

  if (!isOpen) return null;

  const selectedModelData = models.find((m) => m.id === selectedModel);

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Paramètres</h2>
          <button className="modal-close" onClick={onClose} title="Fermer (Échap)">
            <X size={18} />
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
              <span className="form-range-value">{temperature.toFixed(1)}</span>
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
            />
            <div className="form-range-labels">
              <span>0 — Déterministe</span>
              <span>2 — Créatif</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="form-group">
            <label className="form-label" htmlFor="max-tokens">
              Tokens maximum{' '}
              <span className="form-range-value">{maxTokens.toLocaleString()}</span>
              <span className="form-range-badge">{getTokenLabel(maxTokens)}</span>
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
            />
            <div className="form-range-labels">
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
            <label className="form-label">Thème</label>
            <button className="form-input form-button" onClick={toggleTheme}>
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'dark' ? 'Sombre' : 'Clair'}
            </button>
          </div>

          {/* Clear History */}
          <div className="form-group">
            <label className="form-label">Données</label>
            <button
              className="form-input form-button form-button-danger"
              onClick={() => {
                if (confirm('Supprimer tout l\'historique des conversations ? Cette action est irréversible.')) {
                  localStorage.removeItem('polychat_history');
                  window.location.reload();
                }
              }}
            >
              <Trash2 size={16} />
              Supprimer l'historique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
