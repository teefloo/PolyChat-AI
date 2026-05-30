import { useRef, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Trash2, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react';
import type { Message } from '../types/index';

interface MessagesAreaProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onDeleteMessage?: (id: string) => void;
  onRegenerate?: () => void;
  onRetry?: () => void;
}

export function MessagesArea({ messages, isLoading, error, onDeleteMessage, onRegenerate, onRetry }: MessagesAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wasAtBottom = useRef(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateAtBottom = () => {
      const dist = container.scrollHeight - container.scrollTop - container.clientHeight;
      wasAtBottom.current = dist < 50;
    };

    const onWheel = () => updateAtBottom();
    const onTouchMove = () => updateAtBottom();

    container.addEventListener('wheel', onWheel, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const id = requestAnimationFrame(() => {
      if (wasAtBottom.current) {
        container.scrollTop = container.scrollHeight;
      }
      const dist = container.scrollHeight - container.scrollTop - container.clientHeight;
      wasAtBottom.current = dist < 50;
    });
    return () => cancelAnimationFrame(id);
  }, [messages, isLoading]);

  const lastAssistantIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return i;
    }
    return -1;
  }, [messages]);

  if (messages.length === 0 && !isLoading && !error) {
    return (
      <div className="messages-empty" role="status">
        <Bot className="messages-empty-icon" aria-hidden="true" />
        <div className="messages-empty-title">Nouvelle conversation</div>
        <div className="messages-empty-text">
          Envoyez un message pour commencer à discuter avec l'IA.
        </div>
        <div className="messages-empty-hints">
          <div className="messages-empty-hint">
            <kbd>⌘</kbd> + <kbd>K</kbd> pour focus rapidement
          </div>
          <div className="messages-empty-hint">
            <kbd>Entrée</kbd> pour envoyer · <kbd>Maj</kbd> + <kbd>Entrée</kbd> pour un saut de ligne
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="messages-area" role="log" aria-label="Conversation" aria-live="polite">
      {messages.map((msg, i) => (
        <div key={msg.id} className={`message ${msg.role}`} role="article" aria-label={msg.role === 'user' ? 'Votre message' : 'Réponse de l\'assistant'}>
          <div className="message-avatar" aria-hidden="true">
            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
          </div>
          <div className="message-content" aria-live={msg.streaming ? 'polite' : 'off'}>
            {msg.role === 'assistant' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
            {msg.streaming && (
              <span className="streaming-dot" aria-label="En cours de rédaction" role="status" />
            )}
          </div>
          {msg.role === 'assistant' && onDeleteMessage && i === lastAssistantIndex && !isLoading && (
            <div className="message-actions">
              {deleteConfirmId === msg.id ? (
                <div className="delete-confirm" role="alertdialog" aria-labelledby="delete-confirm-text" aria-describedby="delete-confirm-desc">
                  <span id="delete-confirm-text">Supprimer ce message ?</span>
                  <span id="delete-confirm-desc" className="visually-hidden">Cette action est irréversible.</span>
                  <button
                    className="column-action-btn confirm"
                    onClick={() => {
                      onDeleteMessage(msg.id);
                      setDeleteConfirmId(null);
                    }}
                    aria-label="Confirmer la suppression"
                  >
                    Supprimer
                  </button>
                  <button
                    className="column-action-btn"
                    onClick={() => setDeleteConfirmId(null)}
                    aria-label="Annuler la suppression"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className="column-action-btn"
                    title="Supprimer ce message"
                    aria-label="Supprimer ce message"
                    onClick={() => setDeleteConfirmId(msg.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                  {onRegenerate && (
                    <button
                      className="column-action-btn"
                      title="Régénérer la réponse"
                      aria-label="Régénérer la réponse"
                      onClick={onRegenerate}
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Error display */}
      {error && (
        <div className="message-error" role="alert" aria-live="assertive">
          <div className="message-error-icon" aria-hidden="true">
            <AlertCircle size={16} />
          </div>
          <div className="message-error-content">
            <div className="message-error-title">Erreur</div>
            <div className="message-error-text">{error}</div>
          </div>
          {onRetry && (
            <button className="message-error-retry" onClick={onRetry} aria-label="Réessayer l'envoi du message">
              <RefreshCw size={14} />
              Réessayer
            </button>
          )}
        </div>
      )}

      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <div className="message assistant" role="status" aria-label="L'assistant réfléchit">
          <div className="message-avatar" aria-hidden="true">
            <Bot size={14} />
          </div>
          <div className="message-content">
            <span className="streaming-dot" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}
