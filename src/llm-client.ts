import { CoreMessage, generateText, Message, ToolResultUnion } from 'ai';
import { LLMProvider } from './llm-provider.js';

export type LLMPrompt = Omit<
  Parameters<typeof generateText>[0],
  'model' | 'messages'
>;

export type LLMReponseMessages = Awaited<
  ReturnType<typeof generateText>
>['response']['messages'];

export type LLMToolResults = Array<ToolResultUnion<any>>;

export type LLMMessageType = 'user' | 'assistant' | 'system';

export type LLMMessages = Array<CoreMessage> | Array<Omit<Message, 'id'>>;

export type LLMClientOption = {
  provider: LLMProvider;
};

export class LLMClient {
  #provider: LLMProvider;
  #messages: LLMMessages = [];

  constructor({ provider }: LLMClientOption) {
    this.#provider = provider;

    console.log('[LLMClient] Initialized with', provider.name());
  }

  provider() {
    return this.#provider;
  }

  messages() {
    return this.#messages;
  }

  append(type: LLMMessageType, message: string | any) {
    this.#messages.push({
      role: type,
      content: message,
    });
  }

  async #generateText(prompt: LLMPrompt = {}) {
    return await generateText({
      model: this.#provider.model(),
      messages: this.#messages,
      ...prompt,
    });
  }

  async generate(prompt?: LLMPrompt) {
    console.log(
      '[LLMClient] Lets generate a result',
      prompt?.tools ? `with tools ${Object.keys(prompt?.tools ?? {})}` : ''
    );

    return await this.#generateText(prompt);
  }
}

export const utils = {
  extractTextMessage(role: 'user' | 'assistant', messages: LLMReponseMessages) {
    const extractedMessages = [];

    for (const message of messages) {
      if (message.role !== role) {
        continue;
      }

      const type = typeof message.content;
      if (type === 'string') {
        extractedMessages.push(message.content);
      } else if (Array.isArray(message.content)) {
        for (const content of message.content) {
          if (content.type === 'text') {
            extractedMessages.push(content.text);
          }
        }
      }
    }

    return extractedMessages;
  },
};
