import { Settings, PanelLeftClose, PanelLeft } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  onSettings: () => void;
  isSidebarOpen: boolean;
  activeSessionTitle?: string;
}

export function TopBar({ onToggleSidebar, onSettings, isSidebarOpen, activeSessionTitle }: TopBarProps) {
  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Fermer la barre latérale' : 'Ouvrir la barre latérale'}
          aria-expanded={isSidebarOpen}
          title={isSidebarOpen ? 'Fermer la barre latérale' : 'Ouvrir la barre latérale'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose size={18} aria-hidden="true" />
          ) : (
            <PanelLeft size={18} aria-hidden="true" />
          )}
        </button>
        {!isSidebarOpen && (
          <>
            <img
              src="/logos/polychat-logo-concept1-icon.svg"
              alt=""
              aria-hidden="true"
              className="topbar-logo"
            />
            <span className="topbar-title">PolyChat</span>
          </>
        )}
        {activeSessionTitle && (
          <>
            <span className="topbar-separator" aria-hidden="true">
              /
            </span>
            <span
              className="topbar-session-title"
              title={activeSessionTitle}
              aria-label={`Conversation active : ${activeSessionTitle}`}
            >
              {activeSessionTitle}
            </span>
          </>
        )}
      </div>
      <div className="topbar-right">
        <button
          type="button"
          className="topbar-btn"
          onClick={onSettings}
          aria-label="Ouvrir les paramètres"
          title="Ouvrir les paramètres"
        >
          <Settings size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
