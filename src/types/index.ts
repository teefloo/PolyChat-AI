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

export interface WindowConfig {
  modelId: string;
  modelName: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  windows: WindowConfig[];
  isLoading: boolean;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}
