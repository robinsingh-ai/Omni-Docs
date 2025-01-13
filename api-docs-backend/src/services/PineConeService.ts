// import { RAGApplicationBuilder } from '@llm-tools/embedjs';
// import { OpenAiEmbeddings } from '@llm-tools/embedjs-openai';
// import { PineconeDb } from '@llm-tools/embedjs-pinecone';
// import { WebLoader } from '@llm-tools/embedjs-loader-web';

// // set OPENAI_API_KEY in your env
// process.env.OPENAI_API_KEY = "sk-xxx";

// const app = await new RAGApplicationBuilder()
//     .setEmbeddingModel(new OpenAiEmbeddings())
//     .setModel('SIMPLE_MODELS.OPENAI_GPT4_O')
//     .setVectorDatabase(new PineconeDb({
//         projectName: '<name>',
//         namespace: '<name>',
//         indexSpec: {
//             pod: {
//                 podType: 'p1.x1',
//                 environment: 'us-east1-gcp',
//             },
//         },
//     }))
//     .build();


// //add data source and start query it
// await app.addLoader(new WebLoader({ urlOrContent: 'https://www.forbes.com/profile/elon-musk' }));
// await app.query('Tell me about Elon Musk');
