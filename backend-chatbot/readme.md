# Start the server:

```
python main.py
```

# Document Initalization 
```
curl -X POST "http://localhost:8000/crawl" \
     -H "Content-Type: application/json" \
     -d '{
       "sitemap_url": "https://nextjs.org/sitemap.xml",
       "index_name": "nextjs"
     }'
```

# Query the documentation:
```
curl -X POST "http://localhost:8000/query" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "How do I create a new Next.js project?",
       "index_name": "nextjs"
     }'

```


# API Endpoints
## POST /crawl
- Crawls and indexes a documentation website.
```
Request body:
{
    "sitemap_url": "string",
    "index_name": "string"
}
```
## POST /query
- Queries the indexed documentation.
```
Request body:
{
    "query": "string",
    "index_name": "string",
    "chat_history": [
        {
            "role": "string",
            "content": "string"
        }
    ]
}
```
## Components

- Crawler Agent: Responsible for crawling documentation websites and creating FAISS indices
- QA Agent: Handles user queries using the indexed documentation
- FAISS Manager: Manages vector store operations
- Web Crawler: Handles sitemap parsing and content extraction
- LLM Utils: Manages LLM and embedding model configurations

## Development
- To add support for a new documentation source:
    - Add the initial prompt to data/initial_prompts.json
    - Crawl and index the documentation using the /crawl endpoint
    - Start querying using the /query endpoint