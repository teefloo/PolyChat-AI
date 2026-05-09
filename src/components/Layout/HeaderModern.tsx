import React from 'react';
import { Settings, Zap, Activity, History } from 'lucide-react';
import { Logo } from '../ui/Logo';
import ThemeToggle from './ThemeToggle';
import { useSettings } from '../../hooks/useSettings';
import './HeaderModern.css';

interface HeaderProps {
  onSettingsClick: () => void;
  onModelClick?: () => void;
  onHistoryClick?: () => void;
}

const HeaderModern: React.FC<HeaderProps> = ({ onSettingsClick, onModelClick, onHistoryClick }) => {
  const { selectedModel } = useSettings();

  // Obtenir le nom d'affichage du modèle
  const getModelDisplayName = (modelName: string) => {
    if (!modelName) return 'Aucun modèle';
    return modelName.split('/').pop() || modelName;
  };

  return (
    <header className="polychat-header">
      <div className="header-modern-container">
        {/* Brand section + bouton historique à gauche */}
        <div className="header-modern-brand">
          {/* Bouton historique */}
          {onHistoryClick ? (
            <button
              onClick={onHistoryClick}
              className="header-modern-logo-btn polychat-glow"
              aria-label="Ouvrir l'historique"
              title="Historique des conversations"
            >
              <span className="header-modern-logo-btn-inner">
                <Logo size={28} variant="white" className="z-[1]" />
                {/* Icône historique qui apparaît au hover */}
                <span className="header-modern-logo-history-hover">
                  <History size={28} />
                </span>
              </span>
            </button>
          ) : (
            <div className="header-modern-logo polychat-glow">
              <Logo size={28} variant="white" className="z-[1]" />
            </div>
          )}
          {/* Titre avec hiérarchie moderne */}
          <div>
            <h1 className="header-modern-title">PolyChat</h1>
            <div className="header-modern-subtitle">
              <Activity size={12} />
              Assistant IA
            </div>
          </div>
        </div>

        {/* Section centrale pour l'indicateur de modèle */}
        <div className="header-modern-middle-section">
          {/* Indicateur de modèle cliquable */}
          <button
            onClick={onModelClick}
            className="header-modern-model-indicator"
            aria-label="Changer de modèle"
          >
            <Zap size={12} />
            {getModelDisplayName(selectedModel)}
          </button>
        </div>

        {/* Actions à droite */}
        <div className="header-modern-actions">
          {/* Toggle de thème modernisé */}
          <div className="header-modern-theme-toggle">
            <ThemeToggle />
          </div>
          {/* Bouton Settings simple et élégant */}
          <button
            onClick={onSettingsClick}
            className="header-modern-settings-btn"
            aria-label="Ouvrir les paramètres"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Barre de progression décorative */}
      <div className="header-modern-progress-bar" />
    </header>
  );
};

export default HeaderModern;
