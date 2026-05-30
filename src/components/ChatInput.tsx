import { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Global keyboard shortcut: Cmd/Ctrl+K to focus input
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
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
    }
  }, [value, isLoading, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const charCount = value.length;
  const showCounter = charCount > 100;

  const inputId = 'chat-message-input';

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
          placeholder={placeholder || "Envoyer un message…  (⌘K pour focus)"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          aria-describedby={showCounter ? 'char-counter' : undefined}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!value.trim() || isLoading || disabled}
          title="Envoyer le message (Entrée)"
          aria-label="Envoyer le message"
        >
          <Send size={16} />
        </button>
      </div>
      {showCounter && (
        <div id="char-counter" className="chat-input-counter">
          {charCount.toLocaleString()} caractères
        </div>
      )}
    </div>
  );
}
