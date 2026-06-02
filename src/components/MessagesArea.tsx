import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Trash2, RotateCcw, AlertCircle, RefreshCw, ArrowDown } from 'lucide-react';
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateAtBottom = () => {
      const dist = container.scrollHeight - container.scrollTop - container.clientHeight;
      wasAtBottom.current = dist < 50;
      setShowScrollButton(dist >= 100);
    };

    const onWheel = () => updateAtBottom();
    const onTouchMove = () => updateAtBottom();
    const onScroll = () => updateAtBottom();

    container.addEventListener('wheel', onWheel, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('scroll', onScroll);
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
      setShowScrollButton(dist >= 100);
    });
    return () => cancelAnimationFrame(id);
  }, [messages, isLoading]);

  const lastAssistantIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return i;
    }
    return -1;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    wasAtBottom.current = true;
    setShowScrollButton(false);
  }, []);

  if (messages.length === 0 && !isLoading && !error) {
    return (
      <div className="messages-empty">
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
    <div ref={containerRef} className="messages-area" role="log" aria-label="Conversation" aria-live="polite" aria-busy={isLoading}>
      {messages.map((msg, i) => (
        <div
          key={msg.id}
          className={`message ${msg.role}`}
          role="article"
          aria-label={msg.role === 'user' ? 'Votre message' : "Réponse de l'assistant"}
        >
          <div className="message-avatar" aria-hidden="true">
            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
          </div>
          <div className="message-content" aria-live={msg.streaming ? 'polite' : 'off'}>
            {msg.role === 'assistant' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
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
                <div
                  className="delete-confirm"
                  role="alertdialog"
                  aria-labelledby={`delete-confirm-text-${msg.id}`}
                  aria-describedby={`delete-confirm-desc-${msg.id}`}
                >
                  <span id={`delete-confirm-text-${msg.id}`}>Supprimer ce message ?</span>
                  <span id={`delete-confirm-desc-${msg.id}`} className="visually-hidden">
                    Cette action est irréversible.
                  </span>
                  <button
                    type="button"
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
                    type="button"
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
                    type="button"
                    className="column-action-btn"
                    title="Supprimer ce message"
                    aria-label="Supprimer ce message"
                    onClick={() => setDeleteConfirmId(msg.id)}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                  {onRegenerate && (
                    <button
                      type="button"
                      className="column-action-btn"
                      title="Régénérer la réponse"
                      aria-label="Régénérer la réponse"
                      onClick={onRegenerate}
                    >
                      <RotateCcw size={14} aria-hidden="true" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}

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
            <button
              type="button"
              className="message-error-retry"
              onClick={onRetry}
              aria-label="Réessayer l'envoi du message"
            >
              <RefreshCw size={14} aria-hidden="true" />
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

      {showScrollButton && (
        <button
          type="button"
          className="messages-scroll-bottom"
          onClick={scrollToBottom}
          aria-label="Aller au dernier message"
          title="Aller au dernier message"
        >
          <ArrowDown size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
