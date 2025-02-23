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

    def _create_markdown_prompt(self, query: str, context: str, history_context: str = "") -> str:
        """Create markdown-formatted prompt using template from constants."""
        full_context = f"{history_context}\n\n{context}" if history_context else context
        return PromptConstants.MARKDOWN_PROMPT_TEMPLATE.format(
            query=query,
            context=full_context
        )

    def _format_chat_history(self, messages: List[Dict[str, str]]) -> str:
        """Format chat history into a string context."""
        if not messages:
            return ""
        return "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in messages[-5:]  # Use last 5 messages
        ])

    async def answer_query_stream(self, query: str, history_context: str = "") -> AsyncGenerator[str, None]:
        """Stream the answer to a query with separated markdown and sources."""
        try:
            self.logger.info(f"Processing streaming query: {query}")
            
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
            
            prompt = PromptConstants.MARKDOWN_PROMPT_TEMPLATE.format(
                query=query,
                context=context,
                history_context=history_context
            )
            
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