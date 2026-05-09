import React from 'react';
import { useUsageStats } from '../../hooks/useUsageStats';
import { X } from 'lucide-react';
import './SettingsModalModern.css';

interface Props {
  onClose: () => void;
}

const UsageDashboard: React.FC<Props> = ({ onClose }) => {
  const stats = useUsageStats();
  const models = Object.entries(stats.perModel);

  return (
    <div className="settings-modal-modern-overlay" onClick={onClose}>
      <div className="settings-modal-modern" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header-modern">
          <h2>Tableau de bord d'usage</h2>
          <button
            className="settings-modal-modern-close"
            onClick={onClose}
            aria-label="Fermer le tableau de bord"
          >
            <X size={16} />
          </button>
        </div>
        <div className="settings-content-modern">
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <h3>Général</h3>
            </div>
            <div className="settings-info-grid-modern">
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Conversations</span>
                <span className="settings-info-value-modern">{stats.totalConversations}</span>
              </div>
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Messages</span>
                <span className="settings-info-value-modern">{stats.totalMessages}</span>
              </div>
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Temps réponse moyen</span>
                <span className="settings-info-value-modern">{stats.avgResponseTimeMs} ms</span>
              </div>
            </div>
          </div>
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <h3>Par modèle</h3>
            </div>
            {models.length === 0 ? (
              <div className="settings-help-modern">
                <span>Aucune donnée pour l'instant.</span>
              </div>
            ) : (
              <div className="settings-info-grid-modern">
                {models.map(([id, m]) => (
                  <div key={id} className="settings-info-item-modern span-2">
                    <span className="settings-info-label-modern">{id}</span>
                    <span className="settings-info-value-modern">
                      {m.conversations} conv • {m.messages} msgs • {m.avgResponseTimeMs} ms
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageDashboard;
