import { useCallback } from 'react';
import { X, Settings } from 'lucide-react';
import { MessagesArea } from './MessagesArea';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
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
  onDeleteMessage: (messageId: string) => void;
  onRegenerate: () => void;
  onOpenSettings: () => void;
  onCloseWindow: () => void;
  hideInput?: boolean;
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
  onDeleteMessage,
  onRegenerate,
  onOpenSettings,
  onCloseWindow,
  hideInput = false,
}: ChatColumnProps) {
  const handleSend = useCallback(
    (content: string) => {
      onSendMessage(content);
    },
    [onSendMessage]
  );

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
      <div className={`chat-column${isFocused ? ' focused' : ''}`} onClick={onFocus}>
        <div className="messages-empty">
          <div className="messages-empty-title">Aucune fenêtre</div>
        </div>
      </div>
    );
  }

  if (!window.modelId) {
    return (
      <div className={`chat-column${isFocused ? ' focused' : ''}`} onClick={onFocus}>
        <div className="column-header">
          <div className="column-header-left">
            <span className="column-header-index">Fenêtre {windowIndex + 1}</span>
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
              className="column-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCloseWindow();
              }}
              aria-label="Fermer cette fenêtre"
              title="Fermer cette fenêtre"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="messages-empty">
          <Settings className="messages-empty-icon" />
          <div className="messages-empty-title">Choisissez un modèle</div>
          <div className="messages-empty-text">
            Sélectionnez un modèle ci-dessus pour commencer à discuter
          </div>
          <button className="messages-empty-action" onClick={onOpenSettings}>
            Configurer les paramètres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-column${isFocused ? ' focused' : ''}`} onClick={onFocus}>
      <div className="column-header">
        <div className="column-header-left">
          <span className="column-header-index">Fenêtre {windowIndex + 1}</span>
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
            className="column-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onCloseWindow();
            }}
            aria-label="Fermer cette fenêtre"
            title="Fermer cette fenêtre"
          >
            <X size={14} />
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
      {!hideInput && (
        <ChatInput
          onSend={handleSend}
          isLoading={window.isLoading}
          disabled={!window.modelId}
          placeholder="Envoyer un message... (⌘K pour focus)"
        />
      )}
    </div>
  );
}
