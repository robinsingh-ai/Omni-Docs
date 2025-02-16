# app/agents/qa_agent.py
from typing import Any, Dict, List, AsyncGenerator
from langchain.llms.base import BaseLLM
import asyncio
import re
import json

from app.core.logger import setup_logger
from app.core.constants import PromptConstants
# from app.core.retrieval_setup import DocSource
from retrieval_service.app.core.enums import DocSource
from app.utils.retrival_manager import PipelineManager

class QAAgent:
    def __init__(self, llm: BaseLLM, index_name: str):
        """Initialize QA Agent with LLM and index name."""
        self.llm = llm
        self.index_name = index_name
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

    def _create_markdown_prompt(self, query: str, context: str) -> str:
        """Create markdown-formatted prompt using template from constants."""
        return PromptConstants.MARKDOWN_PROMPT_TEMPLATE.format(
            query=query,
            context=context
        )

    async def answer_query_stream(self, query: str) -> AsyncGenerator[str, None]:
        """Stream the answer to a query with separated markdown and sources."""
        try:
            self.logger.info(f"Processing streaming query: {query}")
            
            # Get relevant documents using pipeline
            results = self.pipeline_manager.search_documents(
                DocSource(self.index_name), 
                query
            )
            
            if results['status'] != 'success':
                raise Exception(f"Search failed with status: {results['status']}")
            
            # Format context from documents
            docs = results['results'][:4]  # Get top 4 results
            context = "\n\n".join([doc['text'] for doc in docs])
            
            # Determine if this is a task question
            is_task = self._is_task_question(query)
            
            # Initialize source documents array
            sources = []
            if is_task:
                for doc in docs:
                    sources.append({
                        "url": doc['url'],
                        "title": doc['url'].split('/')[-1],
                        "content_preview": doc['text'][:200] + "..."
                    })
            
            # First, send the sources as a separate object
            if sources:
                yield json.dumps({
                    "type": "sources",
                    "content": sources
                }) + "\n"
            
            # Create markdown prompt
            prompt = self._create_markdown_prompt(query, context)
            
            # Buffer for collecting tokens into meaningful chunks
            current_chunk = ""
            
            # Stream the markdown content
            async for chunk in self.llm.astream(prompt):
                token = chunk.content if hasattr(chunk, 'content') else str(chunk)
                current_chunk += token
                
                # Send chunk when we have a complete sentence or significant content
                if any(token.endswith(p) for p in ['.', '!', '?', '\n']) and current_chunk:
                    yield json.dumps({
                        "type": "markdown",
                        "content": current_chunk
                    }) + "\n"
                    current_chunk = ""
            
            # Send any remaining content
            if current_chunk:
                yield json.dumps({
                    "type": "markdown",
                    "content": current_chunk
                }) + "\n"
            
            # Signal completion
            yield json.dumps({
                "type": "end"
            }) + "\n"
            
        except Exception as e:
            self.logger.error(f"Error in streaming answer: {e}")
            yield json.dumps({
                "type": "error",
                "content": str(e)
            }) + "\n"
            raise

    def answer_query(self, query: str) -> Dict[str, Any]:
        """Answer a user query using the retrieval pipeline."""
        try:
            self.logger.info(f"Processing query: {query}")
            
            results = self.pipeline_manager.search_documents(
                DocSource(self.index_name), 
                query
            )
            
            if results['status'] != 'success':
                raise Exception(f"Search failed with status: {results['status']}")
            
            docs = results['results'][:4]
            context = "\n\n".join([doc['text'] for doc in docs])
            
            prompt = self._create_markdown_prompt(query, context)
            response = self.llm(prompt)
            
            is_task = self._is_task_question(query)
            source_documents = []
            
            if is_task:
                for doc in docs:
                    source = {
                        "url": doc['url'],
                        "title": doc['url'].split('/')[-1],
                        "content_preview": doc['text'][:200] + "..."
                    }
                    source_documents.append(source)
            
            return {
                "answer": response,
                "source_documents": source_documents
            }
            
        except Exception as e:
            self.logger.error(f"Error answering query: {e}")
            raise