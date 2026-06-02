import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, MessageSquare, Trash2, Pencil, Check, X, MoreHorizontal } from 'lucide-react';
import type { ChatSession } from '../types/index';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

function groupByDate(sessions: ChatSession[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; sessions: ChatSession[] }[] = [];
  const map = new Map<string, ChatSession[]>();

  for (const s of sessions) {
    const d = new Date(s.updatedAt);
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let label: string;
    if (date.getTime() === today.getTime()) {
      label = "Aujourd'hui";
    } else if (date.getTime() === yesterday.getTime()) {
      label = 'Hier';
    } else {
      label = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(s);
  }

  for (const [label, items] of map) {
    groups.push({ label, sessions: items });
  }
  return groups;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  isOpen,
  onClose,
}: SidebarProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );
  const groups = groupByDate(filtered);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  // Close context menu on outside click
  useEffect(() => {
    if (contextMenuId) {
      const handler = () => setContextMenuId(null);
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    }
  }, [contextMenuId]);

  const startRename = useCallback(
    (id: string, currentTitle: string) => {
      setEditingId(id);
      setEditValue(currentTitle);
      setContextMenuId(null);
    },
    []
  );

  const confirmRename = useCallback(() => {
    if (editingId && editValue.trim()) {
      onRenameSession(editingId, editValue.trim());
    }
    setEditingId(null);
  }, [editingId, editValue, onRenameSession]);

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirmId(id);
    setContextMenuId(null);
  }, []);

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/logos/polychat-logo-concept1-icon.svg" alt="" className="sidebar-brand-icon" />
            <span className="sidebar-brand-name">PolyChat</span>
          </div>
          <div className="sidebar-search">
            <Search className="sidebar-search-icon" />
            <input
              type="text"
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher une conversation"
            />
          </div>
          <button className="sidebar-new-chat" onClick={onNewSession}>
            <Plus size={16} />
            Nouvelle conversation
          </button>
        </div>
        <div className="sidebar-sessions">
          {groups.length === 0 ? (
            <div className="sidebar-empty">
              <MessageSquare className="sidebar-empty-icon" />
              <span className="sidebar-empty-text">
                {search ? 'Aucun résultat' : 'Aucune conversation'}
              </span>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="sidebar-date-group">
                <div className="sidebar-date-label">{group.label}</div>
                {group.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`sidebar-session ${
                      session.id === activeSessionId ? 'active' : ''
                    }`}
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectSession(session.id);
                        onClose();
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-selected={session.id === activeSessionId}
                  >
                    <div className="sidebar-session-info">
                      {editingId === session.id ? (
                        <div className="sidebar-session-edit">
                          <input
                            ref={inputRef}
                            className="form-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') confirmRename();
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            onBlur={confirmRename}
                            aria-label="Nom de la conversation"
                          />
                          <button
                            className="sidebar-session-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmRename();
                            }}
                            aria-label="Confirmer le renommage"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            className="sidebar-session-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(null);
                            }}
                            aria-label="Annuler le renommage"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : deleteConfirmId === session.id ? (
                        <div className="sidebar-session-delete" role="alertdialog" aria-labelledby="sidebar-delete-text" aria-describedby="sidebar-delete-desc">
                          <span id="sidebar-delete-text" className="sidebar-delete-text">Supprimer « {session.title} » ?</span>
                          <span id="sidebar-delete-desc" className="visually-hidden">Cette action est irréversible. Tous les messages seront supprimés.</span>
                          <button
                            className="sidebar-session-btn confirm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                              setDeleteConfirmId(null);
                            }}
                            aria-label={`Supprimer la conversation ${session.title}`}
                          >
                            Supprimer
                          </button>
                          <button
                            className="sidebar-session-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(null);
                            }}
                            aria-label="Annuler la suppression"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="sidebar-session-title">
                            {session.title}
                            <span
                              className="sidebar-window-dots"
                              aria-label={`${session.windowCount} fenêtre${session.windowCount > 1 ? 's' : ''} ouverte${session.windowCount > 1 ? 's' : ''}`}
                              title={`${session.windowCount} fenêtre${session.windowCount > 1 ? 's' : ''}`}
                            >
                              {Array.from({ length: session.windowCount }, (_, i) => (
                                <span key={i} className="sidebar-window-dot" />
                              ))}
                            </span>
                          </div>
                          <div className="sidebar-session-model">
                            {session.windows.slice(0, session.windowCount).map((w, i) => (
                              <span key={w.id} className="sidebar-session-model-item">
                                {i > 0 && ' · '}
                                {w.modelName || 'Sans modèle'}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {editingId !== session.id && deleteConfirmId !== session.id && (
                      <div className="sidebar-session-actions">
                        <button
                          className="sidebar-session-btn"
                          title="Plus d'options"
                          aria-label={`Options pour ${session.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setContextMenuId(contextMenuId === session.id ? null : session.id);
                          }}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {contextMenuId === session.id && (
                          <div className="sidebar-context-menu">
                            <button
                              className="sidebar-context-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                startRename(session.id, session.title);
                              }}
                            >
                              <Pencil size={14} />
                              Renommer
                            </button>
                            <button
                              className="sidebar-context-item danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(session.id);
                              }}
                            >
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
