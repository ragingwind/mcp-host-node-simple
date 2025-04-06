import {
  AnthropicProvider as AnthropicProviderType,
  createAnthropic,
} from '@ai-sdk/anthropic';
import { LanguageModel } from 'ai';
import 'dotenv/config';

type BaseType<T> = T extends infer U ? U : never;

export type Provider = BaseType<AnthropicProviderType>;

export interface LLMProvider {
  name(): string;
  model(): LanguageModel;
}

export class AnthropicProvider implements LLMProvider {
  #providerName = 'Anthropic';
  #modelName = 'claude-3-5-sonnet-20241022';
  #model: LanguageModel;

  constructor() {
    const provider = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.#model = provider(this.#modelName);
  }

  model(): LanguageModel {
    return this.#model;
  }

  name(): string {
    return `${this.#providerName}::${this.#modelName}`;
  }
}
