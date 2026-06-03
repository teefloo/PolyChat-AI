import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Agentation } from 'agentation';
import type { Message, Model } from './types/index';
import { useSettings } from './hooks/useSettings';
import { useChatStore } from './hooks/useChatStore';
import { streamAIResponse, fetchModels } from './services/openRouter';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatColumn } from './components/ChatColumn';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';

function formatIssueDate(d: Date) {
  return d
    .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    .replace(/^./, (c) => c.toUpperCase());
}

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

  const today = useMemo(() => new Date(), []);
  const issueDate = useMemo(() => formatIssueDate(today), [today]);
  const issueNumber = useMemo(() => {
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return String(dayOfYear).padStart(3, '0');
  }, [today]);

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

  const stopAllGeneration = useCallback(() => {
    if (!activeSessionId) return;
    const prefix = `${activeSessionId}:`;
    for (const [key, controller] of abortRefs.current.entries()) {
      if (!key.startsWith(prefix)) continue;
      controller.abort();
      const windowId = key.slice(prefix.length);
      setWindowLoading(activeSessionId, windowId, false);
    }
    for (const key of Array.from(abortRefs.current.keys())) {
      if (key.startsWith(prefix)) abortRefs.current.delete(key);
    }
  }, [activeSessionId, setWindowLoading]);

  const stopGeneration = useCallback(
    (windowId: string) => {
      if (!activeSessionId) return;
      const key = `${activeSessionId}:${windowId}`;
      const controller = abortRefs.current.get(key);
      if (controller) {
        controller.abort();
        abortRefs.current.delete(key);
      }
      setWindowLoading(activeSessionId, windowId, false);
    },
    [activeSessionId, setWindowLoading]
  );

  const broadcastMessage = useCallback(
    (content: string) => {
      if (!activeSession) return;
      const eligible = activeSession.windows
        .slice(0, activeSession.windowCount)
        .filter((w) => w.modelId);
      for (const win of eligible) {
        sendMessage(content, win.id);
      }
    },
    [activeSession, sendMessage]
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
            issueDate={issueDate}
            issueNumber={issueNumber}
          />
          <section className="empty-state" aria-label="Bienvenue sur PolyChat">
            <div className="empty-state-left">
              <div className="empty-state-issue">
                <span>№ {issueNumber}</span>
                <span>{issueDate}</span>
              </div>
              <h1 className="empty-state-headline">
                Converser <em>avec</em><br />l'intelligence.
              </h1>
              <p className="empty-state-drop">
                Un atelier pour interroger plusieurs modèles en parallèle, comparer leurs voix, et composer la réponse juste.
              </p>
              <button type="button" className="empty-state-cta" onClick={toggleSettings}>
                Configurer la clé
              </button>
            </div>
            <div className="empty-state-right">
              <div className="empty-state-ornament" aria-hidden="true">❦</div>
              <div className="empty-state-specs">
                <div className="empty-state-spec">
                  <span className="empty-state-spec-key">Mandat</span>
                  <span className="empty-state-spec-value">
                    Comparer jusqu'à <em>trois modèles</em> côte à côte, dans une même fenêtre.
                  </span>
                </div>
                <div className="empty-state-spec">
                  <span className="empty-state-spec-key">Archives</span>
                  <span className="empty-state-spec-value">
                    Conversations conservées localement, indexées par date, <em>renommables</em> à tout moment.
                  </span>
                </div>
                <div className="empty-state-spec">
                  <span className="empty-state-spec-key">Mise en page</span>
                  <span className="empty-state-spec-value">
                    Marge, interlignage et ornements réglés pour une <em>lecture longue</em>.
                  </span>
                </div>
              </div>
              <p className="empty-state-colophon">
                Composé sur papier numérique —<br />
                sérif Fraunces · grotesk IBM Plex · mono JetBrains
              </p>
            </div>
          </section>
        </div>
        <SettingsModal isOpen={isSettingsOpen} onClose={toggleSettings} models={models} />
        <div className="paper-grain" aria-hidden="true" />
      </div>
    );
  }

  const visibleWindows = activeSession ? activeSession.windows.slice(0, activeSession.windowCount) : [];
  const windowCount = activeSession?.windowCount ?? 1;
  const isAnyWindowLoading = visibleWindows.some((w) => w.isLoading);
  const allWindowsHaveModel = visibleWindows.length > 0 && visibleWindows.every((w) => w.modelId);
  const hasAnyVisibleUserMessage = visibleWindows.some((w) =>
    w.messages.some((m) => m.role === 'user')
  );
  const showSharedInput = !hasAnyVisibleUserMessage;
  const isSharedInputDisabled = !allWindowsHaveModel;
  const sharedPlaceholder = visibleWindows.length > 1
    ? `Diffuser aux ${visibleWindows.length} colonnes…  (⌘K pour focus)`
    : 'Composer un message…  (⌘K pour focus)';

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
          issueDate={issueDate}
          issueNumber={issueNumber}
        />
        <div className="window-bar" role="toolbar" aria-label="Fenêtres de la page active">
          <span className="window-bar-label" id="window-bar-label">Composition</span>
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
              showInput={hasAnyVisibleUserMessage}
            />
          ))}
        </div>
        {showSharedInput && (
          <div className="shared-input" role="region" aria-label="Saisie partagée">
            <div className="shared-input-meta">
              <span className="shared-input-ornament" aria-hidden="true">→</span>
              <span className="shared-input-label">Diffusion</span>
              <span className="shared-input-divider" aria-hidden="true">·</span>
              <span className="shared-input-count">
                {visibleWindows.length} colonne{visibleWindows.length > 1 ? 's' : ''}
              </span>
            </div>
            <ChatInput
              onSend={broadcastMessage}
              onStop={stopAllGeneration}
              isLoading={isAnyWindowLoading}
              disabled={isSharedInputDisabled}
              placeholder={sharedPlaceholder}
            />
          </div>
        )}
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={toggleSettings} models={models} />
      <div className="paper-grain" aria-hidden="true" />
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
