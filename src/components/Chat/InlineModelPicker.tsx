import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Sparkles, Search } from 'lucide-react';
import { useModels } from '../../hooks/useModels';
import { useChat } from '../../hooks/useChat';
import { getModelPricing } from '../../services/modelsApi';

interface InlineModelPickerProps {
  sessionId?: string;
  currentModelId?: string;
  currentModelName?: string;
  onSelect: (modelId: string) => void;
}

// Sélecteur custom pour choisir ou changer un modèle dans une fenêtre
const InlineModelPicker: React.FC<InlineModelPickerProps> = ({ onSelect, currentModelId }) => {
  const { models, loading } = useModels();
  const { selectedModels } = useChat();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Allow current model to be re-selected in this window
  const filtered = useMemo(() => {
    const base = models.filter((m) => !selectedModels.includes(m.id) || m.id === currentModelId);
    if (!query.trim()) return base.slice(0, 40);
    const q = query.toLowerCase();
    return base
      .filter((m) => m.id.toLowerCase().includes(q) || m.name?.toLowerCase().includes(q))
      .slice(0, 60);
  }, [models, selectedModels, query, currentModelId]);

  // Find current model for display
  const currentModel = useMemo(() => {
    if (!currentModelId) return null;
    return models.find((m) => m.id === currentModelId) || null;
  }, [models, currentModelId]);

  return (
    <div className={`inline-model-picker ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className="imp-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        title={
          currentModel
            ? `Changer de modèle (actuel: ${currentModel.name || currentModel.id})`
            : 'Choisir un modèle'
        }
      >
        {currentModel ? (
          <>
            <span className="imp-name">
              {currentModel.name?.split('/').pop() || currentModel.id}
            </span>
          </>
        ) : (
          <>
            <Sparkles size={14} />
            <span>Choisir un modèle</span>
          </>
        )}
        <ChevronDown size={14} className="imp-caret" />
      </button>
      {open && (
        <div className="imp-pop" aria-label="Liste des modèles disponibles">
          <div className="imp-search">
            <Search size={14} />
            <input
              placeholder="Filtrer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Filtrer les modèles"
            />
          </div>
          {loading && <div className="imp-empty">Chargement…</div>}
          {!loading && filtered.length === 0 && <div className="imp-empty">Aucun résultat</div>}
          {!loading && filtered.length > 0 && (
            <ul className="imp-list" role="listbox" aria-label="Modèles filtrés">
              {filtered.map((m) => (
                <li
                  key={m.id}
                  role="option"
                  aria-selected="false"
                  className="imp-item"
                  onClick={() => {
                    const isInitial = !currentModelId || currentModelId.startsWith('pending-');
                    if (!isInitial && m.id !== currentModelId) {
                      if (
                        !window.confirm(
                          'Changer de modèle ? Cette action peut réinitialiser le contexte.'
                        )
                      )
                        return;
                    }
                    onSelect(m.id);
                    setOpen(false);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    const isInitial = !currentModelId || currentModelId.startsWith('pending-');
                    if (
                      (e.key === 'Enter' || e.key === ' ') &&
                      (isInitial ||
                        m.id === currentModelId ||
                        window.confirm(
                          'Changer de modèle ? Cette action peut réinitialiser le contexte.'
                        ))
                    ) {
                      e.preventDefault();
                      onSelect(m.id);
                      setOpen(false);
                    }
                  }}
                >
                  {(() => {
                    const provider = m.id.split('/')[0];
                    // Récupération brute pour format court
                    let shortPrice = '–';
                    let priceClass = 'imp-price-paid';
                    try {
                      const prompt = parseFloat(m.pricing?.prompt || '0') || 0;
                      const completion = parseFloat(m.pricing?.completion || '0') || 0;
                      if (prompt === 0 && completion === 0) {
                        shortPrice = 'Gratuit';
                        priceClass = 'imp-price-free';
                      } else {
                        const p = prompt * 1_000_000; // $/1M
                        const c = completion * 1_000_000;
                        const fp = p ? p.toFixed(p < 0.1 ? 3 : 2) : '0';
                        const fc = c ? c.toFixed(c < 0.1 ? 3 : 2) : '0';
                        shortPrice =
                          p && c && fp !== fc
                            ? `${fp}/${fc}$`
                            : `${(p || c).toFixed((p || c) < 0.1 ? 3 : 2)}$`;
                      }
                    } catch {
                      /* ignore */
                    }
                    return (
                      <>
                        <span className="imp-name">{m.id.split('/').pop()}</span>
                        <div className="imp-meta-row">
                          <span className="imp-provider">{provider}</span>
                          <span className={`imp-price ${priceClass}`} title={getModelPricing(m)}>
                            {shortPrice}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default InlineModelPicker;
