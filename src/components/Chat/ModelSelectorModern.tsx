import React, { useState, useMemo } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Cpu, Zap, Filter, Search, RotateCcw } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useModels } from '../../hooks/useModels';
import { getModelPricing } from '../../services/modelsApi';
import type { ModelFilters } from '../../services/modelsApi';
import './ModelSelectorModern.css';

const ModelSelectorModern: React.FC<{ compact?: boolean }> = ({ compact = true }) => {
  const { activeSessions, selectedModels, addModel, removeModel } = useChat();
  const { models, availableProviders, updateFilters, filters, loading, refreshModels } =
    useModels();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);

  const getModelDisplayName = (modelId: string) => {
    return modelId.split('/').pop() || modelId;
  };

  const getModelProvider = (modelId: string) => {
    const parts = modelId.split('/');
    return parts.length > 1 ? parts[0] : 'Inconnu';
  };

  // Filtrage des modèles disponibles pour ne pas inclure ceux déjà sélectionnés
  const filteredAvailableModels = useMemo(() => {
    return models.filter((model) => !selectedModels.includes(model.id));
  }, [models, selectedModels]);

  // Modèles à afficher avec pagination
  const modelsToDisplay = useMemo(() => {
    if (showAllModels) {
      return filteredAvailableModels;
    }
    return filteredAvailableModels.slice(0, 12); // Affichage de 12 au lieu de 6
  }, [filteredAvailableModels, showAllModels]);

  const canAddMore = selectedModels.length < 3;

  const handleAddModel = (modelId: string) => {
    addModel(modelId);
    setIsExpanded(false);
  };

  const handleRemoveModel = (modelId: string) => {
    if (selectedModels.length > 1) {
      removeModel(modelId);
    }
  };

  const handleFilterChange = (key: keyof ModelFilters, value: string) => {
    updateFilters({ [key]: value });
    setShowAllModels(false); // Réinitialiser l'affichage étendu lors d'un changement de filtre
  };

  const clearFilters = () => {
    updateFilters({
      provider: 'all',
      searchTerm: '',
      contextLength: 'all',
      priceRange: 'all',
    });
    setShowAllModels(false); // Réinitialiser l'affichage étendu lors du nettoyage des filtres
  };

  const hasActiveFilters =
    filters.provider !== 'all' ||
    filters.searchTerm ||
    filters.contextLength !== 'all' ||
    filters.priceRange !== 'all';

  return (
    <div className={`model-selector-modern ${compact ? 'compact' : ''}`}>
      {/* Header avec statistiques */}
      <div className="model-selector-modern-header">
        <div className="model-selector-modern-title">
          <Cpu size={18} />
          {!compact && <span>Modèles IA Actifs</span>}
          {compact && <span>Modèles</span>}
          <div className="model-selector-modern-badge">{selectedModels.length}/3</div>
        </div>

        <div className="model-selector-modern-controls">
          {/* Bouton de rafraîchissement des modèles */}
          <button
            onClick={refreshModels}
            className={`model-selector-modern-refresh-btn ${loading ? 'loading' : ''}`}
            aria-label="Rafraîchir la liste des modèles"
            title={`Rafraîchir la liste des modèles (${models.length} actuellement)`}
            disabled={loading}
          >
            <RotateCcw size={14} className={loading ? 'spinning' : ''} />
          </button>

          {canAddMore && filteredAvailableModels.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`model-selector-modern-filter-btn ${showFilters ? 'active' : ''}`}
              aria-label="Filtrer les modèles"
              title="Filtrer les modèles"
            >
              <Filter size={14} />
              {hasActiveFilters && <div className="filter-indicator" />}
            </button>
          )}

          {canAddMore && filteredAvailableModels.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="model-selector-modern-toggle"
              aria-label={isExpanded ? 'Fermer la sélection' : 'Ajouter un modèle'}
            >
              <Plus size={16} />
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Filtres discrets */}
      {showFilters && canAddMore && (
        <div className="model-selector-modern-filters">
          <div className="model-filters-row">
            <div className="model-filter-group">
              <Search size={14} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="model-filter-input"
              />
            </div>

            <select
              value={filters.provider}
              onChange={(e) => handleFilterChange('provider', e.target.value)}
              className="model-filter-select"
              title="Filtrer par fournisseur"
            >
              <option value="all">Tous les fournisseurs</option>
              {availableProviders.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>

            <select
              value={filters.contextLength}
              onChange={(e) => handleFilterChange('contextLength', e.target.value)}
              className="model-filter-select"
              title="Filtrer par taille de contexte"
            >
              <option value="all">Taille contexte</option>
              <option value="short">Court (≤8K)</option>
              <option value="medium">Moyen (8K-32K)</option>
              <option value="long">Long (&gt;32K)</option>
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="model-filter-select"
              title="Filtrer par gamme de prix"
            >
              <option value="all">Tous les prix</option>
              <option value="free">Gratuit (0$)</option>
              <option value="cheap">Économique (≤$5/1M)</option>
              <option value="moderate">Modéré (≤$20/1M)</option>
              <option value="premium">Premium (+$20/1M)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="model-filter-clear"
                title="Effacer les filtres"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="model-filters-stats">
            {filteredAvailableModels.length} modèle{filteredAvailableModels.length > 1 ? 's' : ''}{' '}
            trouvé{filteredAvailableModels.length > 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Modèles actifs */}
      <div className="model-selector-modern-active">
        {activeSessions.map((session) => (
          <div key={session.id} className="model-card-modern">
            <div className="model-card-modern-info">
              <div className="model-card-modern-icon">
                <Zap size={16} />
              </div>
              <div className="model-card-modern-details">
                <div className="model-card-modern-name">{getModelDisplayName(session.modelId)}</div>
                {!compact && (
                  <div className="model-card-modern-provider">
                    {getModelProvider(session.modelId)}
                  </div>
                )}
              </div>
            </div>

            {!compact && (
              <div className="model-card-modern-status">
                <div
                  className={`model-card-modern-indicator ${session.isLoading ? 'loading' : 'ready'}`}
                />
                <span className="model-card-modern-status-text">
                  {session.isLoading ? 'Actif' : 'Prêt'}
                </span>
              </div>
            )}

            {selectedModels.length > 1 && (
              <button
                onClick={() => handleRemoveModel(session.modelId)}
                className="model-card-modern-remove"
                aria-label={`Supprimer ${getModelDisplayName(session.modelId)}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Liste des modèles disponibles */}
      {isExpanded && canAddMore && (
        <div className="model-selector-modern-dropdown">
          <div className="model-selector-modern-dropdown-header">
            <span>Ajouter un modèle</span>
            <span className="model-selector-modern-available-count">
              {filteredAvailableModels.length} disponibles
            </span>
          </div>

          <div className="model-selector-modern-grid">
            {modelsToDisplay.map((model) => (
              <button
                key={model.id}
                onClick={() => handleAddModel(model.id)}
                className="model-option-modern"
              >
                <div className="model-option-modern-icon">
                  <Cpu size={14} />
                </div>
                <div className="model-option-modern-details">
                  <div className="model-option-modern-name">{getModelDisplayName(model.id)}</div>
                  {!compact && (
                    <>
                      <div className="model-option-modern-provider">
                        {getModelProvider(model.id)}
                      </div>
                      <div className="model-option-modern-price">{getModelPricing(model)}</div>
                    </>
                  )}
                </div>
                <div className="model-option-modern-add">
                  <Plus size={12} />
                </div>
              </button>
            ))}
          </div>

          {!showAllModels && filteredAvailableModels.length > 12 && (
            <div className="model-selector-modern-more">
              <button
                onClick={() => setShowAllModels(true)}
                className="model-selector-modern-show-more"
              >
                Voir tous les {filteredAvailableModels.length} modèles disponibles
              </button>
            </div>
          )}

          {showAllModels && filteredAvailableModels.length > 12 && (
            <div className="model-selector-modern-more">
              <button
                onClick={() => setShowAllModels(false)}
                className="model-selector-modern-show-more"
              >
                Afficher moins de modèles
              </button>
            </div>
          )}
        </div>
      )}

      {/* État vide */}
      {selectedModels.length === 0 && (
        <div className="model-selector-modern-empty">
          <Cpu size={24} />
          <span>Aucun modèle sélectionné</span>
        </div>
      )}
    </div>
  );
};

export default ModelSelectorModern;
