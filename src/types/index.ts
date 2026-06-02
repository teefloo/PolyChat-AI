export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  modelId?: string;
  streaming?: boolean;
}

export interface Model {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
}

export interface Settings {
  apiKey: string;
  selectedModel: string;
  theme: 'light' | 'dark';
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface PageWindow {
  id: string;
  modelId: string;
  modelName: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatSession {
  id: string;
  title: string;
  windows: PageWindow[];
  windowCount: 1 | 2 | 3;
  createdAt: Date;
  updatedAt: Date;
}
