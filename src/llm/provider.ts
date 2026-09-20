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
      console.warn('[9Router Warning] NINEROUTER_API_KEY não configurada no ambiente.');
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
      if (err.name === 'AbortError') {
        throw new Error(`[9Router Timeout] Chamada LLM excedeu o limite de ${timeout}ms.`);
      }
      throw err;
    }
  }

  public async generateStructured<T>(
    messages: LLMMessage[],
    schemaValidator: (json: any) => T,
    options?: LLMGenerateOptions
  ): Promise<{ data: T; rawResponse: LLMResponse }> {
    const rawResponse = await this.generate(messages, { ...options, responseFormat: 'json_object' });
    let parsedJson: any;

    try {
      parsedJson = JSON.parse(rawResponse.content);
    } catch (e: any) {
      throw new Error(`[LLM JSON Parse Error] Resposta do LLM não é um JSON válido: ${rawResponse.content}`);
    }

    const validatedData = schemaValidator(parsedJson);
    return { data: validatedData, rawResponse };
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const models = await this.listModels();
      return models.length >= 0;
    } catch {
      return false;
    }
  }

  public async listModels(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!res.ok) return [this.defaultModel];
      const json: any = await res.json();
      return (json.data || []).map((m: any) => m.id);
    } catch {
      return [this.defaultModel];
    }
  }
}

export class FakeLLMProvider implements LLMProvider {
  public providerName = 'fake_test_provider';

  constructor(private customResponse?: string) {}

  public async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<LLMResponse> {
    return {
      content: this.customResponse || JSON.stringify({
        summary: 'Análise simulada para testes de unidade.',
        facts: ['Métrica factual de teste'],
        calculations: ['Calculado ROAS de 4.2x'],
        inferences: ['Projeção de escala sustentável'],
        recommendations: [{ type: 'BUDGET', title: 'Ajustar verba', description: 'Recomenda-se teste' }],
        evidenceIds: ['ref_1'],
        missingData: [],
        risks: ['Risco de leilão'],
        confidenceRationale: 'Raciocínio simulado'
      }),
      modelUsed: 'fake-gpt-4o',
      inputTokens: 100,
      outputTokens: 150,
      totalTokens: 250,
      latencyMs: 15
    };
  }

  public async generateStructured<T>(
    messages: LLMMessage[],
    schemaValidator: (json: any) => T,
    options?: LLMGenerateOptions
  ): Promise<{ data: T; rawResponse: LLMResponse }> {
    const raw = await this.generate(messages, options);
    const json = JSON.parse(raw.content);
    return { data: schemaValidator(json), rawResponse: raw };
  }

  public async healthCheck(): Promise<boolean> { return true; }
  public async listModels(): Promise<string[]> { return ['fake-gpt-4o', 'fake-claude-3-5-sonnet']; }
}
