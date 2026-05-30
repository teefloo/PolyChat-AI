import { useCallback } from 'react';
import { MessagesArea } from './MessagesArea';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { Settings } from 'lucide-react';
import type { ChatSession, Model, WindowConfig } from '../types/index';

interface ChatColumnProps {
  session: ChatSession | undefined;
  columnIndex: number;
  windowConfig: WindowConfig | undefined;
  isFocused?: boolean;
  onFocus?: () => void;
  models: Model[];
  onUpdateModel: (modelId: string, modelName: string) => void;
  onSendMessage: (content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onRegenerate: () => void;
  onOpenSettings: () => void;
  hideInput?: boolean;
}

export function ChatColumn({
  session,
  columnIndex: _columnIndex,
  windowConfig,
  isFocused,
  onFocus,
  models,
  onUpdateModel,
  onSendMessage,
  onDeleteMessage,
  onRegenerate,
  onOpenSettings,
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
    if (!session) return;
    const lastUserMsg = [...session.messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      onSendMessage(lastUserMsg.content);
    }
  }, [session, onSendMessage]);

  if (!session) {
    return (
      <div className="chat-column">
        <div className="messages-empty">
          <div className="messages-empty-title">Aucune session</div>
        </div>
      </div>
    );
  }

  if (!windowConfig?.modelId) {
    return (
      <div className="chat-column">
        <div className="column-header">
          <ModelSelector
            models={models}
            selectedModel=""
            onSelect={(modelId) => {
              const model = models.find((m) => m.id === modelId);
              onUpdateModel(modelId, model?.name || modelId);
            }}
          />
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
        <ModelSelector
          models={models}
          selectedModel={windowConfig.modelId}
          onSelect={(modelId) => {
            const model = models.find((m) => m.id === modelId);
            onUpdateModel(modelId, model?.name || modelId);
          }}
        />
      </div>
      <MessagesArea
        messages={session.messages}
        isLoading={session.isLoading}
        error={session.error}
        onDeleteMessage={handleDeleteMessage}
        onRegenerate={handleRegenerate}
        onRetry={handleRetry}
      />
      {!hideInput && (
        <ChatInput
          onSend={handleSend}
          isLoading={session.isLoading}
          disabled={!windowConfig.modelId}
        />
      )}
    </div>
  );
}
