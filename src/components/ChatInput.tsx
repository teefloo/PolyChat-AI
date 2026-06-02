import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, onStop, isLoading, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reactId = useId();
  const inputId = `chat-message-input-${reactId.replace(/[:]/g, '')}`;

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Global keyboard shortcut: Cmd/Ctrl+K to focus the FIRST available input
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const all = document.querySelectorAll<HTMLTextAreaElement>('textarea.chat-input');
        const target = all[0];
        if (target && !target.disabled) {
          target.focus();
        }
      }
    }
    document.addEventListener('keydown', handleGlobalKey);
    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [value, isLoading, disabled, onSend]);

  const handleStop = useCallback(() => {
    onStop?.();
    textareaRef.current?.focus();
  }, [onStop]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (isLoading) return;
        handleSend();
      }
    },
    [handleSend, isLoading]
  );

  const charCount = value.length;
  const showCounter = charCount > 100;

  return (
    <div className="chat-input-wrapper">
      <label htmlFor={inputId} className="visually-hidden">
        Message à envoyer
      </label>
      <div className="chat-input-container">
        <textarea
          id={inputId}
          ref={textareaRef}
          className="chat-input"
          placeholder={placeholder || 'Envoyer un message…  (⌘K pour focus)'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          aria-describedby={showCounter ? `${inputId}-counter` : undefined}
        />
        {isLoading && onStop ? (
          <button
            type="button"
            className="chat-stop-btn"
            onClick={handleStop}
            title="Arrêter la génération"
            aria-label="Arrêter la génération de la réponse"
          >
            <Square size={12} fill="currentColor" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!value.trim() || isLoading || disabled}
            title="Envoyer le message (Entrée)"
            aria-label="Envoyer le message"
          >
            <Send size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      {showCounter && (
        <div id={`${inputId}-counter`} className="chat-input-counter" role="status">
          {charCount.toLocaleString()} caractères
        </div>
      )}
    </div>
  );
}
