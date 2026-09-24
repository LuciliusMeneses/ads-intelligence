/**
 * ADS INTELLIGENCE — Model Registry
 * Manages dynamic discovery and versioning of LLM models.
 */

export interface ModelEntry {
  provider: string;
  modelId: string;
  displayName: string;
  capabilities: string[];
  fetchedAt: number;
  registryVersion: string;
  active: boolean;
}

export class ModelRegistry {
  private static models: Map<string, ModelEntry> = new Map();
  private static version = '1.0.0';

  public static updateRegistry(provider: string, modelIds: string[]): void {
    for (const id of modelIds) {
      this.models.set(`${provider}:${id}`, {
        provider,
        modelId: id,
        displayName: id,
        capabilities: ['general', 'coding'],
        fetchedAt: Date.now(),
        registryVersion: this.version,
        active: true
      });
    }
  }

  public static getModel(provider: string, modelId: string): ModelEntry | undefined {
    return this.models.get(`${provider}:${modelId}`);
  }

  public static listActiveModels(): ModelEntry[] {
    return Array.from(this.models.values()).filter(m => m.active);
  }
}
