import { useState, useCallback, useRef, useEffect } from 'react';
import { KeyRound, Settings } from 'lucide-react';
import { Agentation } from 'agentation';
import type { Message, Model } from './types/index';
import { useSettings } from './hooks/useSettings';
import { useChatStore } from './hooks/useChatStore';
import { streamAIResponse, fetchModels } from './services/openRouter';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatColumn } from './components/ChatColumn';
import { SettingsModal } from './components/SettingsModal';

function AppContent() {
  const { apiKey, selectedModel } = useSettings();
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const focusedWindowId = useChatStore((s) => s.focusedWindowId);
  const setActiveSessionId = useChatStore((s) => s.setActiveSessionId);
  const setFocusedWindowId = useChatStore((s) => s.setFocusedWindowId);
  const createSession = useChatStore((s) => s.createSession);
  const deleteSession = useChatStore((s) => s.deleteSession);
  const renameSession = useChatStore((s) => s.renameSession);
  const setWindowCount = useChatStore((s) => s.setWindowCount);
  const hideWindow = useChatStore((s) => s.hideWindow);
  const updateWindowModel = useChatStore((s) => s.updateWindowModel);
  const addMessage = useChatStore((s) => s.addMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const setWindowLoading = useChatStore((s) => s.setWindowLoading);
  const setWindowError = useChatStore((s) => s.setWindowError);

  const [models, setModels] = useState<Model[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const abortRefs = useRef(new Map<string, AbortController>());

  const activeSession = activeSessionId
    ? sessions.find((s) => s.id === activeSessionId)
    : undefined;

  useEffect(() => {
    if (!apiKey) {
      setModels([]);
      return;
    }
    fetchModels(apiKey)
      .then((models) => {
        setModels(models);
        if (!selectedModel && models.length > 0) {
          useSettings.getState().setSelectedModel(models[0].id);
        }
      })
      .catch(() => setModels([]));
  }, [apiKey, selectedModel]);

  useEffect(() => {
    if (sessions.length === 0 && apiKey && models.length > 0) {
      const modelId = selectedModel || models[0]?.id || '';
      const modelName = models.find((m) => m.id === modelId)?.name || modelId;
      createSession(modelId, modelName);
    } else if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length, apiKey, models.length, selectedModel, activeSessionId, createSession, setActiveSessionId, sessions]);

  const createNewSession = useCallback(() => {
    const modelId = selectedModel || models[0]?.id || '';
    const modelName = models.find((m) => m.id === modelId)?.name || modelId;
    createSession(modelId, modelName);
  }, [selectedModel, models, createSession]);

  const selectSession = useCallback(
    (id: string) => {
      setActiveSessionId(id);
    },
    [setActiveSessionId]
  );

  const deleteSessionById = useCallback(
    (id: string) => {
      deleteSession(id);
    },
    [deleteSession]
  );

  const changeWindowCount = useCallback(
    (count: 1 | 2 | 3) => {
      if (!activeSessionId) return;
      setWindowCount(activeSessionId, count);
    },
    [activeSessionId, setWindowCount]
  );

  const closeWindow = useCallback(
    (windowId: string) => {
      if (!activeSession || !activeSessionId) return;
      if (activeSession.windowCount <= 1) return;
      hideWindow(activeSessionId, windowId);
    },
    [activeSession, activeSessionId, hideWindow]
  );

  const updateColumnModel = useCallback(
    (windowId: string, modelId: string, modelName: string) => {
      if (!activeSessionId) return;
      updateWindowModel(activeSessionId, windowId, modelId, modelName);
    },
    [activeSessionId, updateWindowModel]
  );

  const sendMessage = useCallback(
    (content: string, windowId: string) => {
      if (!activeSessionId || !apiKey) return;
      const session = useChatStore.getState().getSession(activeSessionId);
      if (!session) return;
      const win = session.windows.find((w) => w.id === windowId);
      if (!win || !win.modelId) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      addMessage(activeSessionId, windowId, userMsg);

      const assistantMsgId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        modelId: win.modelId,
        streaming: true,
      };
      addMessage(activeSessionId, windowId, assistantMsg);
      setWindowLoading(activeSessionId, windowId, true);
      setWindowError(activeSessionId, windowId, null);

      const controller = new AbortController();
      abortRefs.current.set(`${activeSessionId}:${windowId}`, controller);

      const settings = useSettings.getState();

      streamAIResponse(
        [...win.messages, userMsg],
        apiKey,
        win.modelId,
        (delta) => {
          const current = useChatStore.getState().getWindow(activeSessionId, windowId);
          const msg = current?.messages.find((m) => m.id === assistantMsgId);
          if (msg) {
            useChatStore
              .getState()
              .updateMessage(activeSessionId, windowId, assistantMsgId, msg.content + delta);
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
            useChatStore.getState().setWindowError(activeSessionId, windowId, err.message);
          }
        })
        .finally(() => {
          useChatStore
            .getState()
            .setWindowLoading(activeSessionId, windowId, false);
          abortRefs.current.delete(`${activeSessionId}:${windowId}`);
        });
    },
    [activeSessionId, apiKey, addMessage, setWindowLoading, setWindowError]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!activeSessionId || !focusedWindowId) return;
      removeMessage(activeSessionId, focusedWindowId, messageId);
    },
    [activeSessionId, focusedWindowId, removeMessage]
  );

  const stopGeneration = useCallback(
    (windowId: string) => {
      if (!activeSessionId) return;
      const key = `${activeSessionId}:${windowId}`;
      const controller = abortRefs.current.get(key);
      if (controller) {
        controller.abort();
        abortRefs.current.delete(key);
        setWindowLoading(activeSessionId, windowId, false);
      }
    },
    [activeSessionId, setWindowLoading]
  );

  const regenerate = useCallback(
    (windowId: string) => {
      if (!activeSessionId) return;
      const win = useChatStore.getState().getWindow(activeSessionId, windowId);
      if (!win || win.messages.length < 2) return;
      const lastUserMsg = [...win.messages].reverse().find((m) => m.role === 'user');
      if (!lastUserMsg) return;
      const lastAssistantMsg = [...win.messages].reverse().find((m) => m.role === 'assistant');
      if (lastAssistantMsg) {
        useChatStore
          .getState()
          .removeMessage(activeSessionId, windowId, lastAssistantMsg.id);
      }
      sendMessage(lastUserMsg.content, windowId);
    },
    [activeSessionId, sendMessage]
  );

  const { theme, isSettingsOpen, toggleSettings } = useSettings();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!apiKey) {
    return (
      <div className="app">
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <div className="grid-bg" />
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={selectSession}
          onNewSession={createNewSession}
          onDeleteSession={deleteSessionById}
          onRenameSession={renameSession}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="main" id="main-content" role="main">
          <TopBar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onSettings={toggleSettings}
            isSidebarOpen={isSidebarOpen}
            activeSessionTitle={activeSession?.title}
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

  const visibleWindows = activeSession ? activeSession.windows.slice(0, activeSession.windowCount) : [];
  const windowCount = activeSession?.windowCount ?? 1;

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <div className="grid-bg" />
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={selectSession}
        onNewSession={createNewSession}
        onDeleteSession={deleteSessionById}
        onRenameSession={renameSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="main" id="main-content" role="main">
        <TopBar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onSettings={toggleSettings}
          isSidebarOpen={isSidebarOpen}
          activeSessionTitle={activeSession?.title}
        />
        <div className="window-bar" role="toolbar" aria-label="Fenêtres de la page active">
          <span className="window-bar-label" id="window-bar-label">Colonnes</span>
          <div className="window-bar-group" role="group" aria-labelledby="window-bar-label">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => changeWindowCount(n as 1 | 2 | 3)}
                className={`window-bar-btn ${windowCount === n ? 'active' : ''}`}
                aria-label={`${n} colonne${n > 1 ? 's' : ''}`}
                aria-pressed={windowCount === n}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="window-bar-new"
            onClick={createNewSession}
            aria-label="Nouvelle conversation dans l'historique"
            title="Créer une nouvelle conversation"
          >
            Nouvelle conversation
          </button>
        </div>
        <div className="chat-columns">
          {visibleWindows.map((win, i) => (
            <ChatColumn
              key={win.id}
              window={win}
              windowIndex={i}
              isFocused={focusedWindowId === win.id}
              canClose={windowCount > 1}
              onFocus={() => setFocusedWindowId(win.id)}
              models={models}
              onUpdateModel={(modelId, modelName) => updateColumnModel(win.id, modelId, modelName)}
              onSendMessage={(content) => sendMessage(content, win.id)}
              onStopGeneration={() => stopGeneration(win.id)}
              onDeleteMessage={deleteMessage}
              onRegenerate={() => regenerate(win.id)}
              onOpenSettings={toggleSettings}
              onCloseWindow={() => closeWindow(win.id)}
            />
          ))}
        </div>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={toggleSettings} models={models} />
    </div>
  );
}

function App() {
  return (
    <>
      <AppContent />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}

export default App;
