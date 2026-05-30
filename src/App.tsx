import { useState, useCallback, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatColumn } from './components/ChatColumn';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
import { useSettings } from './hooks/useSettings';
import { useChatContext } from './context/chatContext';
import type { Message } from './types/index';
import {
  getSessions,
  subscribe,
  initializeChat,
  createSession,
  deleteSession,
  renameSession,
  updateWindowModel,
  addMessage,
  updateMessage,
  setSessionLoading,
  setSessionError,
  getSession,
  removeMessage,
} from './hooks/chatStore';
import { streamAIResponse, fetchModels } from './services/openRouter';
import type { ChatSession, Model } from './types/index';
import { ChatContext, type ChatContextValue } from './context/chatContext';
import { KeyRound, Settings } from 'lucide-react';
import { Agentation } from 'agentation';

function ChatProviderInner({ children }: { children: React.ReactNode }) {
  const { apiKey, selectedModel } = useSettings();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionIds, setActiveSessionIds] = useState<string[]>([]);
  const [focusedColumn, setFocusedColumn] = useState(0);
  const [models, setModels] = useState<Model[]>([]);
  const [windowCount, setWindowCount] = useState(1);
  const abortRefs = useRef(new Map<string, AbortController>());

  useEffect(() => {
    initializeChat();
    setSessions(getSessions());
    const unsub = subscribe(() => setSessions(getSessions()));
    return unsub;
  }, []);

  useEffect(() => {
    if (!apiKey) {
      setModels([]);
      return;
    }
    fetchModels(apiKey)
      .then((m) => {
        const parsed = m.map((item) => ({
          id: item.id,
          name: item.name,
          context_length: item.context_length,
        }));
        setModels(parsed);
        if (!selectedModel && parsed.length > 0) {
          useSettings.getState().setSelectedModel(parsed[0].id);
        }
      })
      .catch(() => setModels([]));
  }, [apiKey, selectedModel]);

  useEffect(() => {
    if (sessions.length === 0 && activeSessionIds.length === 0 && apiKey && models.length > 0) {
      const modelId = selectedModel || models[0]?.id || '';
      const modelName = models.find((m) => m.id === modelId)?.name || modelId;
      const session = createSession([{ modelId, modelName }]);
      setActiveSessionIds([session.id]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length, apiKey, models.length]);

  const createNewSession = useCallback(() => {
    const modelId = selectedModel || models[0]?.id || '';
    const modelName = models.find((m) => m.id === modelId)?.name || modelId;
    const session = createSession([{ modelId, modelName }]);
    setActiveSessionIds((prev) => {
      const next = [...prev];
      next[focusedColumn] = session.id;
      return next;
    });
  }, [selectedModel, models, focusedColumn]);

  const selectSession = useCallback((id: string) => {
    setActiveSessionIds((prev) => {
      const next = [...prev];
      next[focusedColumn] = id;
      return next;
    });
  }, [focusedColumn]);

  const deleteSessionById = useCallback((id: string) => {
    deleteSession(id);
    setActiveSessionIds((prev) => prev.map((sid) => (sid === id ? '' : sid)));
  }, []);

  const updateWindowModelById = useCallback(
    (columnIndex: number, modelId: string, modelName: string) => {
      const sessionId = activeSessionIds[columnIndex];
      if (!sessionId) return;
      updateWindowModel(sessionId, columnIndex, modelId, modelName);
    },
    [activeSessionIds]
  );

  const sendMessage = useCallback(
    (content: string, columnIndex: number) => {
      const sessionId = activeSessionIds[columnIndex];
      if (!sessionId || !apiKey) return;
      const session = getSession(sessionId);
      if (!session) return;

      const windowConfig = session.windows[columnIndex] || session.windows[0];
      const modelId = windowConfig.modelId;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      addMessage(sessionId, userMsg);

      const assistantMsgId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        modelId,
        streaming: true,
      };
      addMessage(sessionId, assistantMsg);
      setSessionLoading(sessionId, true);
      setSessionError(sessionId, null);

      const controller = new AbortController();
      abortRefs.current.set(sessionId, controller);

      const settings = useSettings.getState();

      streamAIResponse(
        [...session.messages, userMsg],
        apiKey,
        modelId,
        (delta) => {
          const current = getSession(sessionId);
          const msg = current?.messages.find((m) => m.id === assistantMsgId);
          if (msg) {
            updateMessage(sessionId, assistantMsgId, msg.content + delta);
          }
        },
        settings.systemPrompt || undefined,
        controller,
        settings.temperature,
        settings.maxTokens
      )
        .then(() => {})
        .catch((err) => {
          if (!controller.signal.aborted) {
            setSessionError(sessionId, err.message);
          }
        })
        .finally(() => {
          setSessionLoading(sessionId, false);
          abortRefs.current.delete(sessionId);
        });
    },
    [activeSessionIds, apiKey]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      const sessionId = activeSessionIds[focusedColumn];
      if (!sessionId) return;
      removeMessage(sessionId, messageId);
    },
    [activeSessionIds, focusedColumn]
  );

  const regenerate = useCallback(
    (columnIndex: number) => {
      const sessionId = activeSessionIds[columnIndex];
      if (!sessionId) return;
      const session = getSession(sessionId);
      if (!session || session.messages.length < 2) return;
      const lastUserMsg = [...session.messages].reverse().find((m) => m.role === 'user');
      if (!lastUserMsg) return;
      const lastAssistantMsg = [...session.messages].reverse().find((m) => m.role === 'assistant');
      if (lastAssistantMsg) {
        removeMessage(sessionId, lastAssistantMsg.id);
      }
      sendMessage(lastUserMsg.content, columnIndex);
    },
    [activeSessionIds, sendMessage]
  );

  const value: ChatContextValue = {
    sessions,
    activeSessionIds,
    focusedColumn,
    setFocusedColumn,
    models,
    windowCount,
    setWindowCount,
    createNewSession,
    selectSession,
    deleteSessionById,
    renameSessionById: renameSession,
    updateWindowModel: updateWindowModelById,
    sendMessage,
    deleteMessage,
    regenerate,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

function AppContent() {
  const {
    sessions,
    activeSessionIds,
    focusedColumn,
    setFocusedColumn,
    models,
    windowCount,
    setWindowCount,
    createNewSession,
    selectSession,
    deleteSessionById,
    renameSessionById,
    updateWindowModel,
    sendMessage,
    deleteMessage,
    regenerate,
  } = useChatContext();

  const { theme, isSettingsOpen, toggleSettings, apiKey } = useSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const focusedSession = activeSessionIds[focusedColumn]
    ? sessions.find((s: ChatSession) => s.id === activeSessionIds[focusedColumn])
    : undefined;

  if (!apiKey) {
    return (
      <div className="app">
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <div className="grid-bg" />
        <Sidebar
          sessions={sessions}
          activeSessionId={null}
          onSelectSession={selectSession}
          onNewSession={createNewSession}
          onDeleteSession={deleteSessionById}
          onRenameSession={renameSessionById}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      <div className="main" id="main-content" role="main">
        <TopBar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onSettings={toggleSettings}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="empty-state">
            <div className="empty-state-icon">
              <KeyRound size={48} />
            </div>
            <h2 className="empty-state-title">Bienvenue sur PolyChat</h2>
            <p className="empty-state-text">
              Configurez votre clé API OpenRouter pour commencer à discuter avec les modèles d'IA.
            </p>
            <button className="empty-state-btn" onClick={toggleSettings}>
              <Settings size={18} />
              Configurer la clé API
            </button>
          </div>
        </div>
        <SettingsModal isOpen={isSettingsOpen} onClose={toggleSettings} models={models} />
      </div>
    );
  }

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <div className="grid-bg" />
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionIds[focusedColumn] || null}
        onSelectSession={selectSession}
        onNewSession={createNewSession}
        onDeleteSession={deleteSessionById}
        onRenameSession={renameSessionById}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="main" id="main-content" role="main">
        <TopBar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onSettings={toggleSettings}
          isSidebarOpen={isSidebarOpen}
          activeSessionTitle={focusedSession?.title}
        />
        <div className="window-bar" role="toolbar" aria-label="Nombre de colonnes de conversation">
          <span className="window-bar-label">Colonnes</span>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setWindowCount(n)}
              className={`window-bar-btn ${windowCount === n ? 'active' : ''}`}
              aria-label={`${n} colonne${n > 1 ? 's' : ''}`}
              aria-pressed={windowCount === n}
            >
              {n}
            </button>
          ))}
          <button className="window-bar-new" onClick={createNewSession} aria-label="Nouvelle conversation">
            Nouveau
          </button>
        </div>
        <div className="chat-columns">
          {Array.from({ length: windowCount }, (_, i) => {
            const sessionId = activeSessionIds[i];
            const session = sessionId ? sessions.find((s) => s.id === sessionId) : undefined;
            const windowConfig = session?.windows[i];
            return (
              <ChatColumn
                key={sessionId ? `${sessionId}-${i}` : `empty-${i}`}
                session={session}
                columnIndex={i}
                windowConfig={windowConfig}
                isFocused={focusedColumn === i}
                onFocus={() => setFocusedColumn(i)}
                models={models}
                onUpdateModel={(modelId, modelName) => updateWindowModel(i, modelId, modelName)}
                onSendMessage={(content) => sendMessage(content, i)}
                onDeleteMessage={deleteMessage}
                onRegenerate={() => regenerate(i)}
                onOpenSettings={toggleSettings}
                hideInput={windowCount > 1}
              />
            );
          })}
        </div>
        {windowCount > 1 && (
          <div className="shared-input-wrapper">
            <div className="shared-input-label">
              <span className="shared-input-icon">📤</span>
              Fenêtre {focusedColumn + 1} — {focusedSession?.title || 'Nouvelle conversation'}
            </div>
            <ChatInput
              onSend={(content) => sendMessage(content, focusedColumn)}
              isLoading={focusedSession?.isLoading || false}
              disabled={!focusedSession?.windows[focusedColumn]?.modelId}
              placeholder="Envoyer un message à la fenêtre active... (⌘K pour focus)"
            />
          </div>
        )}
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={toggleSettings} models={models} />
    </div>
  );
}

function App() {
  return (
    <ChatProviderInner>
      <AppContent />
      {process.env.NODE_ENV === 'development' && <Agentation />}
    </ChatProviderInner>
  );
}

export default App;
