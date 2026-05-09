import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import './ModelSwitcher.css';

/**
 * Composant de sélection de modèles ultra discret.
 * - Affichage sous forme de petite pilule (current model ou nombre)
 * - Popover flottant minimaliste sur clic pour gérer les modèles (multi ≤3)
 */
const ModelSwitcher: React.FC = () => {
  const { activeSessions, setWindowCount } = useChat();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Fermer en cliquant dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = useMemo(
    () => `${activeSessions.length} fenêtre${activeSessions.length > 1 ? 's' : ''}`,
    [activeSessions.length]
  );
  const handleToggle = () => setOpen((o) => !o);

  return (
    <div className="model-switcher" ref={ref}>
      <button
        className={`model-switcher-pill ${open ? 'open' : ''}`}
        onClick={handleToggle}
        aria-label="Sélecteur du nombre de fenêtres"
        title="Choisir le nombre de fenêtres (Alt+clic pour fermer)"
        type="button"
      >
        <Sparkles size={14} />
        <span className="model-switcher-label">{currentLabel}</span>
        <ChevronDown size={14} className="model-switcher-caret" />
      </button>

      {open && (
        <div className="model-switcher-popover" role="dialog">
          <div className="model-switcher-section active">
            <div className="model-switcher-section-title">Fenêtres ({activeSessions.length}/3)</div>
            <div className="model-switcher-window-buttons">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`window-count-btn ${activeSessions.length === n ? 'active' : ''}`}
                  onClick={() => {
                    setWindowCount(n);
                    setOpen(false);
                  }}
                  type="button"
                >
                  {n}
                </button>
              ))}
            </div>
            <ul className="model-switcher-active-list">
              {activeSessions.map((s, i) => (
                <li key={s.id} className="model-switcher-active-item">
                  <span className="model-switcher-active-name">
                    Fenêtre {i + 1}{' '}
                    {s.modelId.startsWith('pending-')
                      ? '• (choisir modèle dans la fenêtre)'
                      : `• ${s.modelId.split('/').pop()}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSwitcher;
