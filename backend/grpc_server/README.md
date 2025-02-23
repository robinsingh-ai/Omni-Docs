# gRPC Server for Documentation QA

This server provides a gRPC interface for querying documentation using LLMs. It handles streaming responses, document source management, and LLM integration.

## Architecture 

## Key Components

- **ChatService**: Main gRPC service handling chat requests
- **QAAgent**: Manages LLM interactions and response streaming
- **PipelineManager**: Handles document source initialization and retrieval
- **RetrievalPipeline**: Core document retrieval functionality

## Message Flow

1. Client sends `ChatRequest` with:
   - model_name
   - query
   - index_name (documentation source)
   - chat_history

2. Server streams `ChatResponse` messages:
   - type: "markdown" | "error" | "end" | "sources"
   - content: Response content or error message

## Proto Updates

When modifying the proto file (`proto/chat_service.proto`), you need to regenerate the gRPC code:

```bash
# From the backend directory
cd backend

# For the gRPC server
python -m grpc_tools.protoc -I./proto --python_out=./grpc_server --grpc_python_out=./grpc_server ./proto/chat_service.proto

# For the backend-chatbot
cd ../backend-chatbot
python -m grpc_tools.protoc -I../backend/proto --python_out=./app/grpc --grpc_python_out=./app/grpc ../backend/proto/chat_service.proto
```

## Running the Server

```bash
# From the grpc_server directory
python server.py
```

The server will start on port 50051 by default.

## Error Handling

- Invalid model names return an error response
- Uninitialized document sources return an error response
- Streaming errors are handled gracefully with error messages
- JSON parsing errors are logged but don't crash the stream

## Message Types

1. **markdown**: Regular response content
2. **sources**: Document references and previews
3. **error**: Error messages
4. **end**: Stream completion marker

## Dependencies

- grpcio
- grpcio-tools
- protobuf
- langchain
- Your chosen LLM implementation

## Development Notes

- Always regenerate proto code after modifying the proto file
- Test streaming responses with the test client
- Check logs for detailed error information
- Handle both string and enum values for document sources 



Example of a query:
curl -X POST \
  "http://localhost:8000/api/v1/stream/test" \
  -H "Authorization: Bearer Token" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model_name": "llama3.1",
    "query": "SSR",
    "index_name": "nextjs",
    "chat_history": []
}'