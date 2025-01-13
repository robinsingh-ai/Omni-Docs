#### Backend for AI Chatbot
The backend for an AI chatbot that provides responses for flutter, nextjs, and crust api docs

The backend is built using
- NodeJS
- EmbedJS framework
- Pinecone db
- Llama 3.1 

#### Running

Inorder to run the backend, you need to have the following

- NodeJS installed on your machine. You can download NodeJS from [here](https://nodejs.org/en/download/)
- Ollama with the following models
    - nomic-embed-text:latest    0a109f422b47    274 MB    7 days ago      
    - llama3.1:latest            46e0c10c039e    4.9 GB    7 days ago  

You can pull the models by running the following commands:

```bash
ollama pull nomic-embed-text:latest
ollama pull llama3.1:latest
``` 
- .env in the root directory with the following content

```bash
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_BACKEND_WS_URL=ws://localhost:8080
```


Once you have everything installed, you can run the following commands to start the backend:

```bash
npm install
npm start
```

The backend will start on port 8080