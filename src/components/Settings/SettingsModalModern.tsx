import React, { useState, useMemo } from 'react';
import { X, Key, Palette, Info, Save, Zap, MessageSquare, Search, Check } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useModels } from '../../hooks/useModels';
import { getModelPricing } from '../../services/modelsApi';
import './SettingsModalModern.css';

interface SettingsModalModernProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModalModern: React.FC<SettingsModalModernProps> = ({ isOpen, onClose }) => {
  const {
    apiKey,
    selectedModel,
    theme,
    accent,
    systemPrompt,
    tone,
    notificationsEnabled,
    ragEnabled, // Ajout du RAG
    setApiKey,
    setSelectedModel,
    setTheme,
    setAccent,
    setSystemPrompt,
    setTone,
    setNotificationsEnabled,
    setRagEnabled, // Ajout du RAG
  } = useSettings();
  const { models } = useModels();
  const [modelSearch, setModelSearch] = useState('');
  const [focusIndex, setFocusIndex] = useState(0);

  const filteredModels = useMemo(() => {
    const q = modelSearch.trim().toLowerCase();
    let base = models;
    if (q)
      base = base.filter(
        (m) => m.id.toLowerCase().includes(q) || m.name?.toLowerCase().includes(q)
      );
    base = [...base].sort((a, b) => {
      // Garder le modèle sélectionné en premier
      if (a.id === selectedModel) return -1;
      if (b.id === selectedModel) return 1;
      // Trier par date de création (plus récent d'abord). Fallback si undefined.
      const ca = (a as { created?: number }).created || 0;
      const cb = (b as { created?: number }).created || 0;
      if (cb !== ca) return cb - ca;
      // Fallback secondaire: nom/id alphabétique
      return (a.name || a.id).localeCompare(b.name || b.id);
    });
    return base.slice(0, 80);
  }, [models, modelSearch, selectedModel]);

  if (!isOpen) return null;

  const handleSave = () => {
    onClose();
  };
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value);
  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setSystemPrompt(e.target.value);
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.className = `theme-${newTheme}`;
  };
  const handleAccentChange = (
    newAccent: 'violet' | 'blue' | 'green' | 'rose' | 'orange' | 'teal' | 'red' | 'cyan'
  ) => {
    setAccent(newAccent);
    document.documentElement.setAttribute('data-accent', newAccent);
  };

  const getModelDisplayName = (modelId: string) => modelId.split('/').pop() || modelId;
  const getModelProvider = (modelId: string) => {
    const parts = modelId.split('/');
    return parts.length > 1 ? parts[0] : 'Inconnu';
  };

  // Navigation clavier dans la liste
  const handleKeyNav = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredModels.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIndex((i) => (i + 1) % filteredModels.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIndex((i) => (i - 1 + filteredModels.length) % filteredModels.length);
    } else if (e.key === 'Enter') {
      const m = filteredModels[focusIndex];
      if (m) setSelectedModel(m.id);
    }
  };

  return (
    <div
      className="settings-modal-modern-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="settings-modal-modern" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-modal-modern-header">
          <div className="settings-modal-modern-title" id="settings-title">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
            </svg>
            <h2>Paramètres</h2>
          </div>
          <button
            onClick={onClose}
            className="settings-modal-modern-close"
            aria-label="Fermer les paramètres"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu */}
        <div className="settings-modal-modern-content">
          {/* Section API Key */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <Key size={18} aria-hidden="true" />
              <h3>Clé API OpenRouter</h3>
              <div className="settings-section-modern-badge required">Requis</div>
            </div>
            <div className="settings-field-modern">
              <label htmlFor="apiKey" className="settings-label-modern">
                Votre clé API
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="sk-or-v1-..."
                className="settings-input-modern"
              />
              <div className="settings-help-modern">
                <Info size={12} aria-hidden="true" />
                <span>
                  Obtenez votre clé API sur{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="settings-link-modern"
                  >
                    OpenRouter.ai
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Section Modèle par défaut améliorée */}
          <div className="settings-section-modern model-enhanced" id="default-model-section">
            <div className="settings-section-modern-header">
              <Zap size={18} aria-hidden="true" />
              <h3>Modèle par défaut</h3>
              <div className="settings-section-modern-badge optional">Optionnel</div>
            </div>
            <div className="settings-model-enhanced-container">
              <div className="model-enhanced-search">
                <Search size={14} aria-hidden="true" />
                <input
                  id="defaultModel"
                  placeholder="Rechercher (nom / fournisseur)..."
                  value={modelSearch}
                  onChange={(e) => {
                    setModelSearch(e.target.value);
                    setFocusIndex(0);
                  }}
                  onKeyDown={handleKeyNav}
                  aria-label="Rechercher un modèle"
                />
                {modelSearch && (
                  <button
                    type="button"
                    className="model-search-clear"
                    onClick={() => setModelSearch('')}
                    aria-label="Effacer la recherche"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <div
                className="model-enhanced-list"
                role="listbox"
                aria-label="Liste des modèles disponibles"
              >
                {filteredModels.length === 0 && (
                  <div className="model-enhanced-empty">Aucun résultat</div>
                )}
                {filteredModels.length > 0 && (
                  <div className="model-option-header" aria-hidden="true">
                    <span className="hdr-name">Modèle</span>
                    <span className="hdr-ctx">Ctx</span>
                    <span className="hdr-price">Prix (Entrée/Sortie)</span>
                    <span className="hdr-sel">✔</span>
                  </div>
                )}
                {filteredModels.map((m) => {
                  const display = getModelDisplayName(m.id);
                  const provider = getModelProvider(m.id);
                  const pricingFull = getModelPricing(m);
                  // Générer un prix compact "x / y" (valeurs $/1M) en gardant 2 décimales max
                  let compactPrice = pricingFull;
                  if (pricingFull.startsWith('In:')) {
                    const parts = pricingFull.split('|').map((p) => p.trim());
                    if (parts.length === 2) {
                      const inMatch = parts[0].match(/In:\s*([0-9.]+)\$/); // ex In: 0.70$/1M tokens
                      const outMatch = parts[1].match(/Out:\s*([0-9.]+)\$/);
                      if (inMatch && outMatch) {
                        compactPrice = `${inMatch[1]}/${outMatch[1]}`; // ex 0.70/1.40
                      }
                    }
                  }
                  const ctx = m.context_length ? `${Math.round(m.context_length / 1000)}k` : '-';
                  const isFree = pricingFull.toLowerCase().includes('gratuit');
                  const isSelected = m.id === selectedModel;
                  const isFocused = focusIndex === filteredModels.indexOf(m) && !isSelected;

                  // Tooltip détaillé basé sur m.pricing directement (prix par token *1M)
                  let tooltip = pricingFull;
                  try {
                    const p = parseFloat(
                      (m as { pricing?: { prompt: string; completion: string } }).pricing?.prompt ||
                        '0'
                    );
                    const c = parseFloat(
                      (m as { pricing?: { prompt: string; completion: string } }).pricing
                        ?.completion || '0'
                    );
                    if (p === 0 && c === 0) {
                      tooltip = 'Gratuit (0$)\nEntrée: 0$/1M\nSortie: 0$/1M';
                    } else {
                      const pM = (p * 1000000).toFixed(p * 1000000 < 1 ? 3 : 2);
                      const cM = (c * 1000000).toFixed(c * 1000000 < 1 ? 3 : 2);
                      tooltip = `Entrée: ${pM}$/1M tokens\nSortie: ${cM}$/1M tokens`;
                    }
                  } catch {
                    // Ignore parsing errors
                  }

                  const handleTooltipCheck = (el: HTMLElement) => {
                    // Retirer état précédent
                    el.classList.remove('tooltip-top');
                    // Attendre calcul layout
                    requestAnimationFrame(() => {
                      const r = el.getBoundingClientRect();
                      const estimatedHeight = 90; // hauteur moyenne tooltip
                      const spaceBelow = window.innerHeight - r.bottom;
                      if (spaceBelow < estimatedHeight) {
                        el.classList.add('tooltip-top');
                      }
                    });
                  };
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="option"
                      className={`model-option-item grid-layout ${isSelected ? 'active' : ''} ${isFocused ? 'focus' : ''}`}
                      onClick={() => setSelectedModel(m.id)}
                      title={`${display} – ${tooltip.replace(/\n/g, ' | ')}`}
                      id={`model-opt-${m.id}`}
                    >
                      <span className="model-cell name-cell">
                        <span className="model-option-name" title={display}>
                          {display}
                        </span>
                        <span className="model-option-provider" title={provider}>
                          {provider}
                        </span>
                      </span>
                      <span className="model-cell ctx-cell">{ctx}</span>
                      <span className="model-cell price-cell">
                        <span
                          className={`price-block price-block-tooltip ${isFree ? 'free' : 'paid'}`}
                          data-tooltip={tooltip}
                          aria-label={tooltip.replace(/\n/g, ' ')}
                          tabIndex={0}
                          onMouseEnter={(e) => handleTooltipCheck(e.currentTarget)}
                          onFocus={(e) => handleTooltipCheck(e.currentTarget)}
                          onMouseLeave={(e) => e.currentTarget.classList.remove('tooltip-top')}
                          onBlur={(e) => e.currentTarget.classList.remove('tooltip-top')}
                        >
                          {isFree ? 'Free' : compactPrice}
                        </span>
                      </span>
                      <span className="model-cell sel-cell">
                        {isSelected && <Check size={14} className="model-selected-icon" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="settings-help-modern">
                <Info size={12} aria-hidden="true" />
                <span>
                  Sélectionnera ce modèle automatiquement pour les nouvelles conversations.
                </span>
              </div>
            </div>
          </div>

          {/* Section Instruction Système */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <MessageSquare size={18} aria-hidden="true" />
              <h3>Instruction Système</h3>
              <div className="settings-section-modern-badge optional">Optionnel</div>
            </div>
            <div className="settings-field-modern">
              <label htmlFor="systemPrompt" className="settings-label-modern">
                Définir le contexte de l'IA
              </label>
              <textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={handleSystemPromptChange}
                placeholder="Ex: Tu es un assistant spécialisé..."
                className="settings-textarea-modern"
                rows={4}
              />
              <div className="settings-help-modern">
                <Info size={12} aria-hidden="true" />
                <span>Instruction envoyée au début de chaque nouvelle conversation.</span>
              </div>
            </div>
          </div>

          {/* Section Ton de l'IA */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <MessageSquare size={18} aria-hidden="true" />
              <h3>Ton de l'IA</h3>
              <div className="settings-section-modern-badge optional">Optionnel</div>
            </div>
            <div className="settings-field-modern">
              <div id="ai-tone-label" className="settings-label-modern">
                Style de réponse
              </div>
              <div
                className="settings-radio-group-modern"
                role="radiogroup"
                aria-labelledby="ai-tone-label"
              >
                {(['neutre', 'formel', 'amical', 'professionnel', 'enthousiaste'] as const).map(
                  (t) => (
                    <label
                      key={t}
                      className={`settings-radio-chip-modern ${tone === t ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="ai-tone"
                        value={t}
                        checked={tone === t}
                        onChange={() => setTone(t)}
                      />
                      <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                    </label>
                  )
                )}
              </div>
              <div className="settings-help-modern">
                <Info size={12} aria-hidden="true" />
                <span>Ajouté à l'instruction système.</span>
              </div>
            </div>
          </div>

          {/* Section Notifications */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <MessageSquare size={18} aria-hidden="true" />
              <h3>Notifications</h3>
              <div className="settings-section-modern-badge optional">Optionnel</div>
            </div>
            <div className="settings-field-modern">
              <label className="settings-label-modern">Notifications navigateur</label>
              <div className="settings-toggle-modern">
                <label htmlFor="notif-toggle" className="sr-only">
                  Activer les notifications
                </label>
                <input
                  id="notif-toggle"
                  title="Activer les notifications"
                  type="checkbox"
                  checked={!!notificationsEnabled}
                  aria-describedby="notif-status"
                  onChange={async (e) => {
                    const enabled = e.target.checked;
                    if (enabled && 'Notification' in window) {
                      const res = await Notification.requestPermission();
                      setNotificationsEnabled(res === 'granted');
                    } else {
                      setNotificationsEnabled(false);
                    }
                  }}
                />
                <span id="notif-status">{notificationsEnabled ? 'Activées' : 'Désactivées'}</span>
              </div>
              <div className="settings-help-modern">
                <Info size={12} aria-hidden="true" />
                <span>Alerte quand une réponse est prête.</span>
              </div>
            </div>
          </div>

          {/* Section Fonctionnalités IA */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <Zap size={18} aria-hidden="true" />
              <h3>Fonctionnalités IA</h3>
              <div className="settings-section-modern-badge experimental">Expérimental</div>
            </div>
            <div className="settings-field-modern">
              <label className="settings-label-modern">Amélioration du contexte (RAG)</label>
              <div className="settings-toggle-modern">
                <label htmlFor="rag-toggle" className="sr-only">
                  Activer le RAG
                </label>
                <input
                  id="rag-toggle"
                  title="Activer le RAG"
                  type="checkbox"
                  checked={!!ragEnabled}
                  aria-describedby="rag-status"
                  onChange={(e) => setRagEnabled(e.target.checked)}
                />
                <span id="rag-status">{ragEnabled ? 'Activé' : 'Désactivé'}</span>
              </div>
              <div className="settings-help-modern">
                <Info size={12} aria-hidden="true" />
                <span>
                  Enrichit le contexte avec les messages les plus pertinents de l'historique.
                </span>
              </div>
            </div>
          </div>

          {/* Section Thème */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <Palette size={18} aria-hidden="true" />
              <h3>Apparence</h3>
              <div className="settings-section-modern-badge experimental">Bêta</div>
            </div>
            <div className="settings-field-modern">
              <label className="settings-label-modern">Thème de l'interface</label>
              <div className="settings-theme-options-modern">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`settings-theme-option-modern ${theme === 'dark' ? 'active' : ''}`}
                >
                  <div className="settings-theme-preview-modern dark">
                    <div className="settings-theme-preview-header-modern dark-header" />
                    <div className="settings-theme-preview-content-modern dark-content" />
                  </div>
                  <span>🌙 Sombre (Cyber)</span>
                  {theme === 'dark' && <span className="theme-active-indicator">✓</span>}
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`settings-theme-option-modern ${theme === 'light' ? 'active' : ''}`}
                >
                  <div className="settings-theme-preview-modern light">
                    <div className="settings-theme-preview-header-modern light-header" />
                    <div className="settings-theme-preview-content-modern light-content" />
                  </div>
                  <span>☀️ Clair</span>
                  {theme === 'light' && <span className="theme-active-indicator">✓</span>}
                </button>
              </div>
              <div className="settings-help-modern">
                <Info size={12} aria-hidden="true" />
                <span>
                  Thème actuel: <strong>{theme === 'dark' ? 'Sombre (Cyber)' : 'Clair'}</strong>
                </span>
              </div>
            </div>
            <div className="settings-field-modern">
              <label className="settings-label-modern">Couleur d'accent</label>
              <div className="settings-accent-grid">
                {(
                  ['violet', 'blue', 'green', 'rose', 'orange', 'teal', 'red', 'cyan'] as const
                ).map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`accent-swatch ${accent === a ? 'active' : ''} accent-${a}`}
                    aria-label={`Accent ${a}`}
                    title={`Accent ${a}`}
                    onClick={() => handleAccentChange(a)}
                  />
                ))}
              </div>
              <div className="settings-help-modern">
                <Info size={12} aria-hidden="true" />
                <span>
                  Accent actuel: <strong>{accent}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <Info size={18} aria-hidden="true" />
              <h3>Informations</h3>
            </div>
            <div className="settings-info-grid-modern">
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Version</span>
                <span className="settings-info-value-modern">PolyChat AI v2.0</span>
              </div>
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Modèles disponibles</span>
                <span className="settings-info-value-modern">{models.length}</span>
              </div>
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Statut API</span>
                <span
                  className={`settings-info-value-modern ${apiKey ? 'connected' : 'disconnected'}`}
                >
                  {apiKey ? 'Connecté' : 'Non configuré'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="settings-modal-modern-footer">
          <button
            onClick={onClose}
            className="settings-btn-modern secondary"
            aria-label="Annuler les modifications"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="settings-btn-modern primary"
            aria-label="Sauvegarder les paramètres"
          >
            <Save size={16} aria-hidden="true" />
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModalModern;
