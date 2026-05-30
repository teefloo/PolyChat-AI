import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Model } from '../types/index';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

export function ModelSelector({ models, selectedModel, onSelect }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = models.find((m) => m.id === selectedModel);

  const filtered = useMemo(() => {
    if (!search) return models;
    const q = search.toLowerCase();
    return models.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }, [models, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="model-selector" ref={dropdownRef}>
      <button className="model-selector-btn" onClick={() => setIsOpen(!isOpen)}>
        <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.name || 'Choisir un modèle'}
        </span>
        <ChevronDown size={14} style={{ opacity: 0.5 }} />
      </button>
      {isOpen && (
        <div className="model-selector-dropdown">
          <div className="model-selector-search">
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="model-selector-list">
            {filtered.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                Aucun modèle trouvé
              </div>
            ) : (
              filtered.map((model) => (
                <div
                  key={model.id}
                  className={`model-selector-option ${model.id === selectedModel ? 'active' : ''}`}
                  onClick={() => {
                    onSelect(model.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  <div>
                    <div className="model-selector-option-name">{model.name}</div>
                    {model.context_length && (
                      <div className="model-selector-option-desc">
                        {(model.context_length / 1000).toFixed(0)}k context
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
