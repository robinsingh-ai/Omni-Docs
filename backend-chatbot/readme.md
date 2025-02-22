# Start the server:

Run redis server:
```
docker pull redis
docker run -d --name redis-server -p 6379:6379 redis

```
Run the server:
```
python main.py
```

or 

for multi-threaded server:

```
uvicorn app.api_router:app --host 127.0.0.1 --port 8000 --workers 4 --reload
```

# Document Initalization 
```
curl -X POST "http://localhost:8000/api/v1/crawl" \
     -H "Content-Type: application/json" \
     -d '{
       "sitemap_url": "https://nextjs.org/sitemap.xml",
       "index_name": "nextjs"
     }'
```

# Query the documentation:
```
curl -X POST "http://localhost:8000/api/v1/query" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "How do I create a new Next.js project?",
       "index_name": "nextjs"
     }'

```


## Components

- Crawler Agent: User retrival service to load and crawl the sitemaps
- QA Agent: Handles user queries using the indexed documentation
- FAISS Manager: Manages vector store operations (Removed for now) since retrival service handles it
- Web Crawler: Handles sitemap parsing and content extraction (Removed for now) since retrival service handles it
- LLM Utils: Manages LLM and embedding model configurations

## Development
- To add support for a new documentation source:
    - Add the initial prompt to data/initial_prompts.json
    - Crawl and index the documentation using the /crawl endpoint
    - Start querying using the /query endpoint


##### Database Structure

For more details about the backend architecture, refer to the [Github Wiki](https://github.com/maheshj01/api-docs-ai/wiki/Backend-Architecture)

<img width="935" alt="Image" src="https://github.com/user-attachments/assets/30a1e19f-902b-4ac5-8395-b1327e9d448d" />