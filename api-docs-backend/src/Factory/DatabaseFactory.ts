// src/factories/DatabaseFactory.ts
import { PineconeDb } from '@llm-tools/embedjs-pinecone';
import { HNSWDb } from '@llm-tools/embedjs-hnswlib';

type DataSources = 'crust-data' | 'nextjs-sitemap' | 'flutter-sitemap';

export class DatabaseFactory {
    static createDatabase(dataSource: DataSources) {
        if (dataSource === 'crust-data') {
            return new HNSWDb();
        }

        const projectName = dataSource === 'flutter-sitemap' ? 'flutter-docs-cleaned' : 'next-docs-cleaned';
        return new PineconeDb({
            projectName,
            namespace: '',
            indexSpec: {
                pod: { podType: 'p1.x1', environment: 'us-east-1' },
            },
        });
    }
}
