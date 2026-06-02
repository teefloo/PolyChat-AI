import { useState, useRef, useEffect, useMemo, useId } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

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
    setActiveIndex(0);
  }, [search, isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const choose = (id: string) => {
    onSelect(id);
    setIsOpen(false);
    setSearch('');
    buttonRef.current?.focus();
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault();
      choose(filtered[activeIndex].id);
    }
  };

  return (
    <div className="model-selector" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        className="model-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        title={selected?.name || 'Choisir un modèle'}
      >
        <span
          style={{
            maxWidth: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selected?.name || 'Choisir un modèle'}
        </span>
        <ChevronDown size={14} style={{ opacity: 0.5 }} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="model-selector-dropdown">
          <div className="model-selector-search">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher un modèle…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleListKeyDown}
              autoFocus
              aria-label="Filtrer la liste des modèles"
              aria-controls={listId}
              aria-activedescendant={filtered[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined}
            />
          </div>
          <div
            className="model-selector-list"
            role="listbox"
            id={listId}
            aria-label="Liste des modèles disponibles"
          >
            {filtered.length === 0 ? (
              <div className="model-selector-empty">Aucun modèle trouvé</div>
            ) : (
              filtered.map((model, i) => (
                <div
                  key={model.id}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={model.id === selectedModel}
                  className={`model-selector-option ${
                    model.id === selectedModel ? 'active' : ''
                  } ${i === activeIndex ? 'focused' : ''}`}
                  onClick={() => choose(model.id)}
                  onMouseEnter={() => setActiveIndex(i)}
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
