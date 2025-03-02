import grpc
from concurrent import futures
import json
import asyncio
from typing import List, Dict
import time

from chat_service_pb2 import ChatRequest, ChatResponse, InitSourceRequest, InitSourceResponse, Message, ProcessDocRequest, ProcessDocResponse, ModelsResponse, SourcesResponse
from chat_service_pb2_grpc import ChatServiceServicer, add_ChatServiceServicer_to_server
from core.models import ModelsManager
from core.logger import setup_logger
from agents.qa_agent import QAAgent
from utils.llm_utils import get_llm
from utils.retrieval_manager import PipelineManager
from retrieval_service.app.core.enums import DocSource

logger = setup_logger(__name__)

class ChatServicer(ChatServiceServicer):
    def __init__(self):
        self.pipeline_manager = PipelineManager()
        self.available_models = {}
        self.initialized_sources = set()
        
    async def initialize(self):
        """Initialize models and doc sources globally."""
        logger.info("Starting server initialization...")
        
        # Initialize models
        logger.info("Checking model availability...")
        await ModelsManager.check_model_availability()
        
        # Pre-initialize all models
        for model_name in ModelsManager._AVAILABLE_MODELS:
            try:
                model_response = ModelsManager.get_model_config(model_name)
                if model_response.data.is_available:
                    self.available_models[model_name] = get_llm(model_response.data)
                    logger.info(f"✓ Initialized model: {model_name}")
            except Exception as e:
                logger.error(f"✗ Failed to initialize model {model_name}: {e}")
        
        # Initialize all doc sources
        logger.info("Initializing document sources...")
        for source in DocSource:
            try:
                await self.pipeline_manager.initialize_pipeline(source.value)
                self.initialized_sources.add(source.value)
                logger.info(f"✓ Initialized {source.value} documentation")
            except Exception as e:
                logger.error(f"✗ Failed to initialize {source.value}: {e}")
        
        logger.info(f"Server initialization complete! Available models: {list(self.available_models.keys())}")
        logger.info(f"Initialized sources: {list(self.initialized_sources)}")

    async def StreamChat(self, request: ChatRequest, context) -> ChatResponse:
        try:
            if request.model_name not in self.available_models:
                raise ValueError(f"Model {request.model_name} not available")
            
            if request.index_name not in self.initialized_sources:
                raise ValueError(f"Documentation source {request.index_name} not available")
            
            llm = self.available_models[request.model_name]
            qa_agent = QAAgent(llm, request.index_name)
            
            history_context = self._format_chat_history(request.chat_history)
            
            async for chunk in qa_agent.answer_query_stream(request.query, history_context):
                try:
                    response_dict = json.loads(chunk.strip())
                    
                    # Handle end message type
                    if response_dict.get("type") == "end":
                        yield ChatResponse(type="end", content="")
                        break
                        
                    # Handle error message type    
                    elif response_dict.get("type") == "error":
                        yield ChatResponse(
                            type="error",
                            content=response_dict.get("content", "Unknown error")
                        )
                        break
                        
                    # Handle regular markdown content
                    elif response_dict.get("type") == "markdown" and "content" in response_dict:
                        yield ChatResponse(
                            type="markdown",
                            content=response_dict["content"]
                        )
                    else:
                        logger.warning(f"Skipping malformed response: {response_dict}")
                        continue
                        
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error: {e}")
                    continue
                except Exception as e:
                    logger.error(f"Error processing chunk: {e}")
                    continue
                
        except Exception as e:
            logger.error(f"Error in StreamChat: {e}")
            yield ChatResponse(
                type="error",
                content=str(e)
            )
                
    async def InitializeDocSource(self, request: InitSourceRequest, context) -> InitSourceResponse:
        try:
            await self.pipeline_manager.initialize_pipeline(request.source_name)
            return InitSourceResponse(
                success=True,
                message=f"Successfully initialized {request.source_name}"
            )
        except Exception as e:
            logger.error(f"Error initializing source: {e}")
            return InitSourceResponse(
                success=False,
                message=str(e)
            )
                
    def _format_chat_history(self, messages: List[Message]) -> str:
        formatted = []
        for msg in messages:
            prefix = "User:" if msg.role == "user" else "Assistant:"
            formatted.append(f"{prefix} {msg.content}")
        return "\n".join(formatted)

    async def ProcessDocumentation(self, request: ProcessDocRequest, context) -> ProcessDocResponse:
        """Process and crawl documentation for a specific source."""
        try:
            logger.info(f"Starting documentation processing for {request.source_name}")
            source = DocSource[request.source_name.upper()]
            
            # Get pipeline and process documents
            pipeline = await self.pipeline_manager.get_pipeline(source.value)
            pipeline.process_documents(source.value)
            
            # Update initialized sources
            self.initialized_sources.add(source.value)
            
            return ProcessDocResponse(
                success=True,
                message=f"Successfully processed documentation for {request.source_name}"
            )
        except Exception as e:
            logger.error(f"Error processing documentation: {e}")
            return ProcessDocResponse(
                success=False,
                message=str(e)
            )

    async def GetAvailableModels(self, request, context) -> ModelsResponse:
        """Return a list of all available models."""
        try:
            model_names = list(self.available_models.keys())
            logger.info(f"Returning available models: {model_names}")
            return ModelsResponse(
                model_names=model_names,
                success=True,
                message=f"Found {len(model_names)} available models"
            )
        except Exception as e:
            logger.error(f"Error getting available models: {e}")
            return ModelsResponse(
                model_names=[],
                success=False,
                message=str(e)
            )

    async def GetAvailableSources(self, request, context) -> SourcesResponse:
        """Return a list of all available documentation sources."""
        try:
            logger.info("GetAvailableSources called")
            source_names = list(self.initialized_sources)
            logger.info(f"Returning available sources: {source_names}")
            return SourcesResponse(
                source_names=source_names,
                success=True,
                message=f"Found {len(source_names)} available documentation sources"
            )
        except Exception as e:
            logger.error(f"Error getting available sources: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return SourcesResponse(
                source_names=[],
                success=False,
                message=str(e)
            )

async def serve():
    server = grpc.aio.server(
        futures.ThreadPoolExecutor(max_workers=10),
        compression=grpc.Compression.Gzip
    )
    
    # Initialize service with all models and sources
    servicer = ChatServicer()
    await servicer.initialize()  # This will now initialize everything
    
    add_ChatServiceServicer_to_server(servicer, server)
    server.add_insecure_port('[::]:50051')
    
    await server.start()
    logger.info("gRPC server started on port 50051")
    await server.wait_for_termination()

if __name__ == '__main__':
    asyncio.run(serve()) 