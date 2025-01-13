### Goal to create a LLM powered API DOCS chatbot (Dash API)

Setup NodeJS Backend

- [] Initialize Express/Node project
- [] Setup environment configuration
- [] Create basic server structure

Notion Integration

- [] Setup Notion SDK
- [] Create API to fetch pages from Notion
- [] Parse and clean Notion content

Vector Database Setup

- [] Choose and setup vector database (e.g., Pinecone)
- [] Setup OpenAI for embeddings
- [] Create embedding generation pipeline

RAG Implementation

- [] Create document chunking system
- [] Setup vector storage system
- [] Implement retrieval system

Chat Integration

- [] Setup OpenAI/Claude for chat completion (optional)
- [] Create context injection system
- [] Implement chat API endpoints

Now only focus on setting up the nodejs backend with typescript and use proper design pattern to structure the code and setup appropriate classes

The backend will expose an Api for our frontend

- type:post:
  endppoint: localhost:3000/api/v1/query
  body: {
  query: "How do I search for people given their current title, current company and location?"
  }

One of the class is Responsible for interacting with Notion

- type: class
  name: NotionService
  methods: - getPages (priority) - getPage (priority) - getDatabase (priority) - getDatabaseQuery - getBlockChildren - getBlock - getBlockChildren

One of the class is responsible for interacting with the vector database Pinecone

- type: class
  name: PineconeService
  methods: - createIndex (priority) - insertItems (priority) - deleteItems - queryItems - queryItemsByVector

One of the class is responsible for interacting with OpenAI

- type: class
  name: OpenAIService
  methods: - createEmbeddings (priority) - queryEmbeddings

One of the class is responsible for interacting with RAG

- type: class
  name: RAGService
  methods: - createChunks (priority) - createRetrieval - queryRetrieval

_This is for Later_

One of the class is responsible for making an API call to crust_data API based on the query dynamically

- type: class
  name: CaddyService
  methods: - queryCrustData (priority)
