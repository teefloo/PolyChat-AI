import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import type { ConversationTemplate, QuickAction } from '../../types';
import { PRE_BUILT_TEMPLATES, QUICK_ACTIONS, TEMPLATE_CATEGORIES } from '../../data/templates';
import './TemplateSelector.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ConversationTemplate) => void;
  onQuickAction: (action: QuickAction, selectedText?: string) => void;
  selectedText?: string;
  onSaveCustomTemplate?: (template: ConversationTemplate) => void;
}

const TemplateSelector: React.FC<Props> = ({
  isOpen,
  onClose,
  onTemplateSelect,
  onQuickAction,
  selectedText,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'actions'>('templates');

  if (!isOpen) return null;

  // Filter templates based on search and category
  const filteredTemplates = PRE_BUILT_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = !activeCategory || template.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter quick actions based on search
  const filteredActions = QUICK_ACTIONS.filter((action) => {
    return (
      action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="template-selector-overlay" onClick={onClose}>
      <div className="template-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="template-selector-header">
          <h3 className="template-selector-title">
            <Sparkles size={24} />
            Templates et actions
          </h3>
          <button className="template-selector-close" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="template-selector-search">
          <Search size={20} />
          <input
            type="text"
            className="template-selector-search-input"
            placeholder="Rechercher des templates ou des actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="template-selector-tabs">
          <button
            className={`template-selector-tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            Templates ({filteredTemplates.length})
          </button>
          <button
            className={`template-selector-tab ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            Actions rapides ({filteredActions.length})
          </button>
        </div>

        {activeTab === 'templates' && (
          <>
            <div className="template-selector-categories">
              <button
                className={`template-category-btn ${!activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory(null)}
              >
                Tous ({PRE_BUILT_TEMPLATES.length})
              </button>
              {TEMPLATE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  className={`template-category-btn ${category.id} ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="template-category-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            <div className="template-selector-content">
              {filteredTemplates.length > 0 ? (
                <div className="template-grid">
                  {filteredTemplates.map((tpl) => {
                    return (
                      <button
                        key={tpl.id}
                        className={`template-card ${tpl.category}`}
                        onClick={() => onTemplateSelect(tpl)}
                      >
                        <div className="template-card-header">
                          <div className="template-card-icon">{tpl.icon || '📄'}</div>
                          <div className="template-card-info">
                            <h4 className="template-card-title">{tpl.name}</h4>
                            <p className="template-card-description">{tpl.description}</p>
                          </div>
                        </div>

                        {tpl.tags && tpl.tags.length > 0 && (
                          <div className="template-card-tags">
                            {tpl.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="template-card-tag">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {tpl.examples && tpl.examples.length > 0 && (
                          <div className="template-card-examples">
                            <div className="template-card-examples-title">Exemples :</div>
                            {tpl.examples.slice(0, 2).map((example, index) => (
                              <div key={index} className="template-card-example">
                                {example}
                              </div>
                            ))}
                          </div>
                        )}

                        {tpl.modelSpecific && tpl.modelSpecific.length > 0 && (
                          <div className="template-card-models">
                            <span className="template-card-models-label">Modèles :</span>
                            <span className="template-card-model">
                              {tpl.modelSpecific[0]}
                              {tpl.modelSpecific.length > 1 && ` +${tpl.modelSpecific.length - 1}`}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="template-empty-state">
                  <Sparkles size={48} />
                  <h3>Aucun template trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche ou de catégorie.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'actions' && (
          <div className="template-selector-content">
            {filteredActions.length > 0 ? (
              <div className="quick-actions-grid">
                {filteredActions.map((act) => (
                  <button
                    key={act.id}
                    className="quick-action-card"
                    onClick={() => onQuickAction(act, selectedText)}
                  >
                    <div className="quick-action-icon">{act.icon}</div>
                    <h4 className="quick-action-title">{act.name}</h4>
                    <p className="quick-action-description">{act.description}</p>
                    {act.requiresSelection && selectedText && selectedText.trim().length > 0 && (
                      <span className="quick-action-requires-selection">Sélectionné</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="template-empty-state">
                <Sparkles size={48} />
                  <h3>Aucune action trouvée</h3>
                  <p>Essayez de modifier vos critères de recherche.</p>
              </div>
            )}
          </div>
        )}

        <div className="template-selector-footer">
          <div className="template-selector-stats">
            {activeTab === 'templates'
              ? `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''}`
              : `${filteredActions.length} action${filteredActions.length !== 1 ? 's' : ''}`}
          </div>
          <button className="template-selector-create-btn">
            <Sparkles size={16} />
            Créer un template personnalisé
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
