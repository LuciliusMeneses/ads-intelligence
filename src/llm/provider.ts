/**
 * ADS INTELLIGENCE — LLM Provider Abstraction & 9Router Adapter
 * Provides LLMProvider interface, NineRouterLLMProvider (OpenAI-compatible), and FakeLLMProvider.
 */

import { z } from 'zod';

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

const NineRouterConfigSchema = z.object({
  baseUrl: z.string().url().default('https://api.9router.com/v1'),
  apiKey: z.string().min(1, 'API key missing'),
  defaultModel: z.string().default('gpt-4o'),
  timeoutMs: z.number().positive().default(30000)
});

export class NineRouterLLMProvider implements LLMProvider {
  public providerName = '9router';
  private config: z.infer<typeof NineRouterConfigSchema>;

  constructor() {
    const parsed = NineRouterConfigSchema.safeParse({
      baseUrl: process.env.NINEROUTER_BASE_URL,
      apiKey: process.env.NINEROUTER_API_KEY,
      defaultModel: process.env.NINEROUTER_DEFAULT_MODEL,
      timeoutMs: process.env.NINEROUTER_TIMEOUT_MS ? Number(process.env.NINEROUTER_TIMEOUT_MS) : undefined
    });

    if (!parsed.success) {
      throw new Error(`[9Router Configuration Error] ${parsed.error.message}`);
    }
    this.config = parsed.data;
  }

  public async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<LLMResponse> {
    const startTime = Date.now();
    const model = options?.model || this.config.defaultModel;
    const timeout = options?.timeoutMs || this.config.timeoutMs;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
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
        throw new Error(`[9Router API Error ${response.status}]`);
      }

      const json: any = await response.json();
      const latencyMs = Date.now() - startTime;

      return {
        content: json.choices?.[0]?.message?.content || '',
        modelUsed: json.model || model,
        inputTokens: json.usage?.prompt_tokens,
        outputTokens: json.usage?.completion_tokens,
        totalTokens: json.usage?.total_tokens,
        latencyMs
      };
    } catch (err: any) {
      clearTimeout(timer);
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
      const res = await fetch(`${this.config.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
        signal: AbortSignal.timeout(5000)
      });
      return res.ok;
    } catch { return false; }
  }

  public async listModels(): Promise<string[]> {
    const res = await fetch(`${this.config.baseUrl}/models`, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });
    if (!res.ok) throw new Error('Failed to fetch models');
    const json = await res.json();
    return (json.data || []).map((m: any) => m.id);
  }
}

export class FakeLLMProvider implements LLMProvider {
  public providerName = 'fake_test_provider';
  constructor(private customResponse?: string) {}

  public async generate(messages: LLMMessage[]): Promise<LLMResponse> {
    return {
      content: this.customResponse || '{}',
      modelUsed: 'fake-gpt-4o',
      latencyMs: 1
    };
  }

  public async generateStructured<T>(
    _m: LLMMessage[],
    schemaValidator: (json: any) => T
  ): Promise<{ data: T; rawResponse: LLMResponse }> {
    return { data: schemaValidator({}), rawResponse: await this.generate([]) };
  }

  public async healthCheck(): Promise<boolean> { return true; }
  public async listModels(): Promise<string[]> { return ['fake-gpt-4o']; }
}
