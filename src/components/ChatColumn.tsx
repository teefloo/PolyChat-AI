import { useCallback } from 'react';
import { X, Settings } from 'lucide-react';
import { MessagesArea } from './MessagesArea';
import { ModelSelector } from './ModelSelector';
import { ChatInput } from './ChatInput';
import type { Model, PageWindow } from '../types/index';

interface ChatColumnProps {
  window: PageWindow | undefined;
  windowIndex: number;
  isFocused: boolean;
  canClose: boolean;
  onFocus: () => void;
  models: Model[];
  onUpdateModel: (modelId: string, modelName: string) => void;
  onSendMessage: (content: string) => void;
  onStopGeneration?: () => void;
  onDeleteMessage: (messageId: string) => void;
  onRegenerate: () => void;
  onOpenSettings: () => void;
  onCloseWindow: () => void;
  showInput?: boolean;
}

export function ChatColumn({
  window,
  windowIndex,
  isFocused,
  canClose,
  onFocus,
  models,
  onUpdateModel,
  onSendMessage,
  onStopGeneration,
  onDeleteMessage,
  onRegenerate,
  onOpenSettings,
  onCloseWindow,
  showInput = false,
}: ChatColumnProps) {
  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      onDeleteMessage(messageId);
    },
    [onDeleteMessage]
  );

  const handleRegenerate = useCallback(() => {
    onRegenerate();
  }, [onRegenerate]);

  const handleRetry = useCallback(() => {
    if (!window) return;
    const lastUserMsg = [...window.messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      onSendMessage(lastUserMsg.content);
    }
  }, [window, onSendMessage]);

  if (!window) {
    return (
      <div className={`chat-column${isFocused ? ' focused' : ''}`}>
        <div className="messages-empty">
          <div className="messages-empty-title">Aucune fenêtre</div>
        </div>
      </div>
    );
  }

  if (!window.modelId) {
    return (
      <section
        className={`chat-column${isFocused ? ' focused' : ''}`}
        onClick={onFocus}
        aria-label={`Fenêtre ${windowIndex + 1}, aucun modèle sélectionné`}
      >
        <div className="column-header">
          <div className="column-header-left">
            <span className="column-header-index" aria-hidden="true">
              {windowIndex + 1}
            </span>
            <ModelSelector
              models={models}
              selectedModel=""
              onSelect={(modelId) => {
                const model = models.find((m) => m.id === modelId);
                onUpdateModel(modelId, model?.name || modelId);
              }}
            />
          </div>
          {canClose && (
            <button
              type="button"
              className="column-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCloseWindow();
              }}
              aria-label="Fermer cette fenêtre"
              title="Fermer cette fenêtre"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="messages-empty">
          <Settings className="messages-empty-icon" aria-hidden="true" />
          <div className="messages-empty-title">Choisissez un modèle</div>
          <div className="messages-empty-text">
            Sélectionnez un modèle ci-dessus pour commencer à discuter
          </div>
          <button type="button" className="messages-empty-action" onClick={onOpenSettings}>
            Configurer les paramètres
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`chat-column${isFocused ? ' focused' : ''}`}
      onClick={onFocus}
      aria-label={`Fenêtre ${windowIndex + 1} avec ${window.modelName || 'modèle'}`}
    >
      <div className="column-header">
        <div className="column-header-left">
          <span className="column-header-index" aria-hidden="true">
            {windowIndex + 1}
          </span>
          <ModelSelector
            models={models}
            selectedModel={window.modelId}
            onSelect={(modelId) => {
              const model = models.find((m) => m.id === modelId);
              onUpdateModel(modelId, model?.name || modelId);
            }}
          />
        </div>
        {canClose && (
          <button
            type="button"
            className="column-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onCloseWindow();
            }}
            aria-label="Fermer cette fenêtre"
            title="Fermer cette fenêtre"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
      <MessagesArea
        messages={window.messages}
        isLoading={window.isLoading}
        error={window.error}
        onDeleteMessage={handleDeleteMessage}
        onRegenerate={handleRegenerate}
        onRetry={handleRetry}
      />
      {showInput && (
        <ChatInput
          onSend={onSendMessage}
          onStop={onStopGeneration}
          isLoading={window.isLoading}
          disabled={!window.modelId}
          placeholder="Composer un message…  (⌘K pour focus)"
        />
      )}
    </section>
  );
}
