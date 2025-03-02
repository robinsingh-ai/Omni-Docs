from typing import AsyncGenerator, Dict, Any, List
import json
import re
from langchain.llms.base import BaseLLM
from core.logger import setup_logger
from core.constants import PromptConstants
from retrieval_service.app.core.enums import DocSource
from utils.retrieval_manager import PipelineManager

class QAAgent:
    def __init__(self, llm: BaseLLM, index_name: str):
        """Initialize QA Agent with LLM and index name."""
        self.llm = llm
        self.index_name = index_name  # Keep as string
        self.pipeline_manager = PipelineManager()
        self.logger = setup_logger(__name__)
        
        # Get the actual model name with better fallbacks
        self.model_name = self._get_actual_model_name(llm)
        self.logger.info(f"Using model: {self.model_name}")

    def _get_actual_model_name(self, llm: BaseLLM) -> str:
        """Get the actual model name from the LLM instance with better fallbacks."""
        # Try to get the model name from various possible attributes
        if hasattr(llm, "model_name"):
            return llm.model_name
        elif hasattr(llm, "model"):
            return llm.model
        elif hasattr(llm, "_model_name"):
            return llm._model_name
        elif hasattr(llm, "model_id"):
            return llm.model_id
        elif hasattr(llm, "_llm_type"):
            # If it's an Ollama model, try to get the specific model name
            if llm._llm_type == "ollama":
                # Try to get from model kwargs or config
                if hasattr(llm, "model_kwargs") and "model" in llm.model_kwargs:
                    return f"ollama/{llm.model_kwargs['model']}"
                elif hasattr(llm, "model_config") and "model" in llm.model_config:
                    return f"ollama/{llm.model_config['model']}"
            return llm._llm_type
        
        # Last resort: try to get from string representation
        try:
            llm_str = str(llm)
            if "model=" in llm_str:
                return llm_str.split("model=")[1].split()[0].strip("'\"")
        except:
            pass
            
        return "unknown_model"

    def _is_task_question(self, query: str) -> bool:
        """Determine if a question is asking about how to do something."""
        task_indicators = [
            r'how to',
            r'how do I',
            r'steps to',
            r'guide for',
            r'tutorial',
            r'create',
            r'build',
            r'implement',
            r'set up',
            r'configure',
            r'install',
            r'deploy',
            r'start',
            r'make'
        ]
        query_lower = query.lower()
        return any(re.search(pattern, query_lower) for pattern in task_indicators)

    def _create_markdown_prompt(self, query: str, context: str, chat_history: List[Dict[str, str]] = None) -> str:
        """Create markdown-formatted prompt using template from constants."""
        history_context = self._format_chat_history(chat_history) if chat_history else ""
        return PromptConstants.MARKDOWN_PROMPT_TEMPLATE.format(
            query=query,
            context=context,
            history_context=history_context
        )

    def _format_chat_history(self, messages: List[Dict[str, str]]) -> str:
        """Format chat history into a string context."""
        try:
            if not messages:
                return ""
            
            self.logger.debug(f"Formatting chat history: {messages}")
            formatted = []
            for msg in messages:
                if not isinstance(msg, dict) or 'role' not in msg or 'content' not in msg:
                    self.logger.warning(f"Skipping invalid message format: {msg}")
                    continue
                formatted.append(f"{msg['role'].capitalize()}: {msg['content']}")
            
            result = "\n".join(formatted[-5:])  # Use last 5 messages
            self.logger.debug(f"Formatted chat history: {result}")
            return result
            
        except Exception as e:
            self.logger.error(f"Error formatting chat history: {e}")
            return ""

    async def answer_query_stream(self, query: str, chat_history: List[Dict[str, str]] = None) -> AsyncGenerator[str, None]:
        """Stream the answer to a query with separated markdown and sources."""
        try:
            self.logger.info(f"Processing streaming query: {query}")
            self.logger.debug(f"Chat history received: {chat_history}")
            
            if chat_history is None:
                chat_history = []
            
            # First, send model info
            yield json.dumps({
                "type": "model_info",
                "content": self.model_name
            }) + "\n"
            
            results = await self.pipeline_manager.search_documents(
                self.index_name,
                query
            )
            
            if results['status'] != 'success' or not results.get('results'):
                yield json.dumps({
                    "type": "error",
                    "content": f"No relevant information found for your query in the {self.index_name} documentation. Please try rephrasing your question."
                }) + "\n"
                return
            
            docs = results['results'][:4]
            context = "\n\n".join([doc['text'] for doc in docs])
            
            # Determine if this is a task question
            is_task = self._is_task_question(query)
            
            # Initialize source documents array
            sources = []
            if is_task:
                for doc in docs:
                    sources.append({
                        "url": doc['url'],
                        "title": doc.get('title', doc['url'].split('/')[-1]),
                        "content_preview": doc['text'][:200] + "..."
                    })
            
            # First, send the sources as a separate object if we have any
            if sources:
                self.logger.info(f"Sending {len(sources)} sources")
                yield json.dumps({
                    "type": "sources",
                    "content": sources
                }) + "\n"
            
            prompt = self._create_markdown_prompt(query, context, chat_history)
            
            current_chunk = ""
            try:
                async for chunk in self.llm.astream(prompt):
                    # Extract token from chunk based on its type
                    if isinstance(chunk, dict):
                        token = chunk.get('text', '') or chunk.get('content', '')
                    elif hasattr(chunk, 'text'):
                        token = chunk.text
                    elif hasattr(chunk, 'content'):
                        token = chunk.content
                    elif isinstance(chunk, str):
                        token = chunk
                    else:
                        self.logger.warning(f"Skipping unexpected chunk format: {type(chunk)}")
                        continue

                    if not token:  # Skip empty tokens
                        continue
                        
                    current_chunk += token
                    
                    # Only yield complete sentences or markdown blocks
                    if any(token.endswith(p) for p in ['.', '!', '?', '\n']) and current_chunk.strip():
                        yield json.dumps({
                            "type": "markdown",
                            "content": current_chunk.strip()
                        }) + "\n"
                        current_chunk = ""
                
                # Send any remaining content
                if current_chunk.strip():
                    yield json.dumps({
                        "type": "markdown",
                        "content": current_chunk.strip()
                    }) + "\n"

                # Signal completion
                yield json.dumps({
                    "type": "end"
                }) + "\n"

            except Exception as e:
                self.logger.error(f"Error in streaming response: {str(e)}")
                yield json.dumps({
                    "type": "error",
                    "content": f"Streaming error: {str(e)}"
                }) + "\n"
            
        except Exception as e:
            self.logger.error(f"Error in answer_query_stream: {str(e)}")
            yield json.dumps({
                "type": "error",
                "content": f"Query error: {str(e)}"
            }) + "\n" 