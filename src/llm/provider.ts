/**
 * ADS INTELLIGENCE — LLM Provider Abstraction & 9Router Adapter
 * Provides LLMProvider interface, NineRouterLLMProvider (OpenAI-compatible), and FakeLLMProvider.
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMGenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  responseFormat?: 'json_object' | 'text';
}

export interface LLMResponse {
  content: string;
  modelUsed: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  latencyMs: number;
}

export interface LLMProvider {
  providerName: string;
  generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<LLMResponse>;
  generateStructured<T>(messages: LLMMessage[], schemaValidator: (json: any) => T, options?: LLMGenerateOptions): Promise<{ data: T; rawResponse: LLMResponse }>;
  healthCheck(): Promise<boolean>;
  listModels(): Promise<string[]>;
}

export class NineRouterLLMProvider implements LLMProvider {
  public providerName = '9router';
  private baseUrl: string;
  private apiKey: string;
  private defaultModel: string;
  private defaultTimeoutMs: number;

  constructor() {
    this.baseUrl = process.env.NINEROUTER_BASE_URL || 'https://api.9router.com/v1';
    this.apiKey = process.env.NINEROUTER_API_KEY || '';
    this.defaultModel = process.env.NINEROUTER_DEFAULT_MODEL || 'gpt-4o';
    this.defaultTimeoutMs = process.env.NINEROUTER_TIMEOUT_MS ? Number(process.env.NINEROUTER_TIMEOUT_MS) : 30000;

    if (!this.apiKey && process.env.NODE_ENV !== 'test') {
      throw new Error('[9Router Error] NINEROUTER_API_KEY obrigatória para runtime de produção.');
    }
  }

  public async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<LLMResponse> {
    const startTime = Date.now();
    const model = options?.model || this.defaultModel;
    const timeout = options?.timeoutMs || this.defaultTimeoutMs;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.maxTokens ?? 2000,
          response_format: options?.responseFormat === 'json_object' ? { type: 'json_object' } : undefined
        }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`[9Router API Error ${response.status}] ${errText}`);
      }

      const json: any = await response.json();
      const latencyMs = Date.now() - startTime;

      const choice = json.choices?.[0]?.message?.content || '';
      const usage: any = json.usage || {};

      return {
        content: choice,
        modelUsed: json.model || model,
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        latencyMs
      };
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw new Error(`[9Router Timeout] Excedeu ${timeout}ms.`);
      throw err;
    }
  }

  public async generateStructured<T>(
    messages: LLMMessage[],
    schemaValidator: (json: any) => T,
    options?: LLMGenerateOptions
  ): Promise<{ data: T; rawResponse: LLMResponse }> {
    const rawResponse = await this.generate(messages, { ...options, responseFormat: 'json_object' });
    const parsedJson = JSON.parse(rawResponse.content);
    return { data: schemaValidator(parsedJson), rawResponse };
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(5000)
      });
      return res.ok;
    } catch { return false; }
  }

  public async listModels(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json.data) ? json.data.map((m: any) => m.id) : [];
    } catch { return []; }
  }
}

export class FakeLLMProvider implements LLMProvider {
  public providerName = 'fake_test_provider';
  constructor(private customResponse?: string) {}
  public async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<LLMResponse> {
    return { content: '{}', modelUsed: 'fake', latencyMs: 0 };
  }
  public async generateStructured<T>(m: LLMMessage[], v: (j: any) => T): Promise<{ data: T; rawResponse: LLMResponse }> {
    return { data: v({}), rawResponse: { content: '{}', modelUsed: 'fake', latencyMs: 0 } };
  }
  public async healthCheck(): Promise<boolean> { return true; }
  public async listModels(): Promise<string[]> { return ['fake-model']; }
}
