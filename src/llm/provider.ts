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
  private maxRetries: number = 2;

  constructor() {
    this.baseUrl = process.env.NINEROUTER_BASE_URL || 'https://api.9router.com/v1';
    this.apiKey = process.env.NINEROUTER_API_KEY || '';
    this.defaultModel = process.env.NINEROUTER_DEFAULT_MODEL || 'gpt-4o';
    this.defaultTimeoutMs = process.env.NINEROUTER_TIMEOUT_MS ? Number(process.env.NINEROUTER_TIMEOUT_MS) : 30000;

    if (!this.apiKey && process.env.NODE_ENV !== 'test') {
      throw new Error('[9Router Critical] NINEROUTER_API_KEY não configurada.');
    }
  }

  public async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<LLMResponse> {
    const model = options?.model || this.defaultModel;
    const timeout = options?.timeoutMs || this.defaultTimeoutMs;
    
    let attempt = 0;
    while (attempt <= this.maxRetries) {
      const startTime = Date.now();
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
          if (response.status === 401) throw new Error('[9Router Auth Failure]');
          throw new Error(`[9Router API Error ${response.status}]`);
        }

        const json: any = await response.json();
        return {
          content: json.choices?.[0]?.message?.content || '',
          modelUsed: json.model || model,
          inputTokens: json.usage?.prompt_tokens,
          outputTokens: json.usage?.completion_tokens,
          totalTokens: json.usage?.total_tokens,
          latencyMs: Date.now() - startTime
        };
      } catch (err: any) {
        clearTimeout(timer);
        attempt++;
        if (attempt > this.maxRetries) throw err;
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
    throw new Error('Max retries exceeded');
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
      const res = await fetch(`${this.baseUrl}/models`, { headers: { 'Authorization': `Bearer ${this.apiKey}` } });
      if (!res.ok) throw new Error('Failed to fetch models');
      const json: any = await res.json();
      return (json.data || []).map((m: any) => m.id);
    } catch {
      return [];
    }
  }
}

export class FakeLLMProvider implements LLMProvider {
  public providerName = 'fake_test_provider';
  constructor(private customResponse?: string) {}
  public async generate(m: LLMMessage[]): Promise<LLMResponse> {
    return { content: this.customResponse || '{}', modelUsed: 'fake-gpt-4o', latencyMs: 0 };
  }
  public async generateStructured<T>(m: LLMMessage[], v: (j: any) => T): Promise<{ data: T; rawResponse: LLMResponse }> {
    const r = await this.generate(m);
    return { data: v(JSON.parse(r.content)), rawResponse: r };
  }
  public async healthCheck(): Promise<boolean> { return true; }
  public async listModels(): Promise<string[]> { return ['fake-gpt-4o']; }
}
