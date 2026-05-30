import type { Message } from '../types/index';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

type ApiMessage = { role: string; content: string };

function toApiMessages(messages: Message[], systemPrompt?: string): ApiMessage[] {
  const apiMessages: ApiMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  if (systemPrompt?.trim()) {
    apiMessages.unshift({ role: 'system', content: systemPrompt.trim() });
  }
  return apiMessages;
}

function headers(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'PolyChat AI',
  };
}

export async function streamAIResponse(
  messages: Message[],
  apiKey: string,
  model: string,
  onChunk: (delta: string) => void,
  systemPrompt?: string,
  abortController?: AbortController,
  temperature?: number,
  maxTokens?: number
): Promise<string> {
  const apiMessages = toApiMessages(messages, systemPrompt);

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { ...headers(apiKey), Accept: 'text/event-stream' },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        stream: true,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: abortController?.signal,
    });
  } catch {
    return fetchAIResponse(messages, apiKey, model, systemPrompt, temperature, maxTokens);
  }

  if (!response.ok || !response.body) {
    return fetchAIResponse(messages, apiKey, model, systemPrompt, temperature, maxTokens);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';

  while (true) {
    let result;
    try {
      result = await reader.read();
    } catch (e: unknown) {
      if (abortController?.signal.aborted) break;
      throw e;
    }
    const { value, done } = result;
    if (done) break;
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split(/\n\n/);
      buffer = parts.pop() || '';
      for (const block of parts) {
        const lines = block
          .split(/\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;
          try {
            const json = JSON.parse(payload);
            const delta: string | undefined = json.choices?.[0]?.delta?.content;
            if (delta) {
              full += delta;
              onChunk(delta);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    }
  }
  return full;
}

export async function fetchAIResponse(
  messages: Message[],
  apiKey: string,
  model: string,
  systemPrompt?: string,
  temperature?: number,
  maxTokens?: number
): Promise<string> {
  const apiMessages = toApiMessages(messages, systemPrompt);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify({
      model,
      messages: apiMessages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function fetchModels(apiKey: string): Promise<
  Array<{ id: string; name: string; context_length?: number }>
> {
  const response = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }

  const data = await response.json();
  return (data.data || [])
    .filter(
      (m: { id: string; name?: string; context_length?: number }) =>
        m.id && m.name
    )
    .map((m: { id: string; name: string; context_length?: number }) => ({
      id: m.id,
      name: m.name,
      context_length: m.context_length,
    }));
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}
