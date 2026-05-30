import { Settings, PanelLeftClose, PanelLeft } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  onSettings: () => void;
  isSidebarOpen: boolean;
  activeSessionTitle?: string;
}

export function TopBar({ onToggleSidebar, onSettings, isSidebarOpen, activeSessionTitle }: TopBarProps) {
  return (
    <div className="topbar" role="banner">
      <div className="topbar-left">
        <button
          className="topbar-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Fermer la barre latérale' : 'Ouvrir la barre latérale'}
          title={isSidebarOpen ? 'Fermer la barre latérale (⌘B)' : 'Ouvrir la barre latérale (⌘B)'}
        >
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
        {!isSidebarOpen && (
          <>
            <img src="/logos/polychat-logo-concept1-icon.svg" alt="PolyChat AI" className="topbar-logo" />
            <span className="topbar-title">PolyChat</span>
          </>
        )}
        {activeSessionTitle && (
          <span className="topbar-separator" aria-hidden="true">/</span>
        )}
        {activeSessionTitle && (
          <span className="topbar-session-title" aria-label={`Conversation: ${activeSessionTitle}`}>
            {activeSessionTitle}
          </span>
        )}
      </div>
      <div className="topbar-right">
        <button
          className="topbar-btn"
          onClick={onSettings}
          title="Ouvrir les paramètres (⌘,)"
          aria-label="Ouvrir les paramètres"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
