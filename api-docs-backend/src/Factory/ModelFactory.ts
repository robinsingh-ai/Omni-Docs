// src/factories/ModelFactory.ts
import { OpenAi } from '@llm-tools/embedjs-openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Ollama, OllamaEmbeddings } from '@llm-tools/embedjs-ollama';

export class ModelFactory {
    static createModelAndEmbeddings(model: string, embeddings: string) {
        let modelInstance;
        let embeddingsInstance;

        if (model === 'gpt-3.5-turbo') {
            modelInstance = new OpenAi({ model });
            embeddingsInstance = new OpenAIEmbeddings({});
        } else if (model === 'llama3.1') {
            modelInstance = new Ollama({ modelName: model, baseUrl: 'http://localhost:11434' });
            embeddingsInstance = new OllamaEmbeddings({ model: embeddings, baseUrl: 'http://localhost:11434' });
        } else {
            throw new Error(`Unsupported model: ${model}`);
        }

        return { modelInstance, embeddingsInstance };
    }
}
